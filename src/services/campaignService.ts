import type { Json } from "@/lib/schema";
import { supabase } from "@/lib/supabase";
import {
  Campaign,
  CampaignListItem,
  CampaignTable,
  CampaignTableField,
  CampaignWebapp,
  FetchedCampaign,
  RemovedEntries,
} from "@/types/campaign";
import {
  FetchedSurveyQuestion,
  FetchedSurveyTrigger,
  Survey,
  SurveyQuestion,
  SurveyQuestionTrigger,
} from "@/types/survey";
import { CampaignTrigger, TriggerCondition, loadActions, persistActions } from "@/types/trigger";
import { omit } from "@/utils/type";

type SingleLevelSurveyQuestion = Omit<FetchedSurveyQuestion, "survey_question_trigger" | "config"> & {
  config: unknown;
  survey_question_trigger: (Omit<FetchedSurveyTrigger, "survey_question"> & {
    survey_question?: SingleLevelSurveyQuestion[];
  })[];
};

// survey_question has no order column, so the question's position among its siblings
// is stored in its `config` JSON (the app ignores unknown config keys). Questions saved
// before this have no position and fall back to id order.
const QUESTION_POSITION_KEY = "position";

function getQuestionPosition(q: { config: unknown }): number {
  const position = (q.config as Record<string, unknown> | null)?.[QUESTION_POSITION_KEY];
  return typeof position === "number" ? position : Number.MAX_SAFE_INTEGER;
}

function sortByQuestionPosition<T extends { id?: number; config: unknown }>(questions: T[]): T[] {
  return questions.sort((a, b) => getQuestionPosition(a) - getQuestionPosition(b) || (a.id ?? 0) - (b.id ?? 0));
}

/** Write each question's index among its siblings into its config, at every nesting level. */
function assignQuestionPositions(questions: SurveyQuestion[]) {
  questions.forEach((q, index) => {
    q.config = {
      ...((q.config as object | null) ?? {}),
      [QUESTION_POSITION_KEY]: index,
    } as unknown as SurveyQuestion["config"];
    q.survey_question_trigger.forEach((t) => assignQuestionPositions(t.survey_question));
  });
}

function restoreSurveyHierarchy(surveyQuestion: SingleLevelSurveyQuestion, questionList: SingleLevelSurveyQuestion[]) {
  for (const trigger of surveyQuestion.survey_question_trigger) {
    const childQuestion = sortByQuestionPosition(questionList.filter((q) => q.triggered_by === trigger.id));
    trigger.survey_question = childQuestion;

    childQuestion.forEach((q) => restoreSurveyHierarchy(q, questionList));
  }
}

function recursivelyFillSurveyId(surveyQuestion: SurveyQuestion[], surveyId: number) {
  if (surveyQuestion.length === 0) return;

  surveyQuestion.forEach((sq) => (sq.survey_id = surveyId));

  const nextLevelQuestion = surveyQuestion.flatMap((sq) =>
    sq.survey_question_trigger.flatMap((st) => st.survey_question),
  );
  recursivelyFillSurveyId(nextLevelQuestion, surveyId);
}

export const getCampaignList = async (): Promise<Map<number, CampaignListItem>> => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(`id, name, description, start_time, end_time`)
    .order("id");
  if (error) throw new Error(error.message);
  return new Map(data.map((campaign) => [campaign.id, campaign]));
};

/** Thrown by getCampaignInfo when no campaign has the given id, as opposed to a backend failure. */
export class CampaignNotFoundError extends Error {}

export const getCampaignInfo = async (campaignId: number): Promise<FetchedCampaign> => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `*, profiles(*), survey(*, survey_question(*, survey_question_trigger!survey_question_trigger_question_id_fkey(*))), campaign_table(*, campaign_table_field(*, campaign_table_field_mapping(*))), campaign_trigger(*), campaign_webapp(*)`,
    )
    .eq("id", campaignId)
    .single();

  // PGRST116: `.single()` matched zero rows.
  if (error?.code === "PGRST116") throw new CampaignNotFoundError(error.message);
  if (error) throw new Error(error.message);

  data.survey.forEach((s) => {
    const topLevelSurveyQuestion = sortByQuestionPosition(s.survey_question.filter((sq) => sq.triggered_by === null));
    topLevelSurveyQuestion.forEach((sq) => restoreSurveyHierarchy(sq, s.survey_question));
    s.survey_question = topLevelSurveyQuestion;
  });

  // Convert persisted action shape ({survey_id}) to in-memory shape ({surveyIndex}).
  // The index is into data.survey, which is the same array that ends up in the store.
  // `loadActions` accepts either an array (current shape) or a single object
  // (pre-multi-action rows) so old data still rehydrates.
  data.campaign_trigger = data.campaign_trigger.map((row: (typeof data.campaign_trigger)[number]) => ({
    ...row,
    condition: row.condition as unknown as TriggerCondition,
    actions: loadActions(row.action, data.survey, data.campaign_webapp),
  }));

  data.profiles = data.profiles.sort((a, b) => a.pid - b.pid);

  return data as unknown as FetchedCampaign;
};

export const upsertCampaign = async (
  campaign: Campaign,
  passwordHash: string | null,
  insertChildTables: boolean = true,
): Promise<number> => {
  if (campaign.id === -1) delete campaign.id;

  const campaignTable = structuredClone(campaign.campaign_table);
  const survey = structuredClone(campaign.survey);
  const triggers = structuredClone(campaign.campaign_trigger);
  const webapps = structuredClone(campaign.campaign_webapp);

  const insertedCampaign = omit(
    structuredClone(campaign),
    "campaign_table",
    "survey",
    "profiles",
    "campaign_trigger",
    "campaign_webapp",
  );

  const { data, error } = await supabase.from("campaigns").upsert(insertedCampaign).select();

  if (error) throw new Error(error.message);
  const campaignId = data[0].id;

  if (passwordHash) {
    const { error: credentialTableError } = await supabase.from("campaign_credentials").upsert(
      {
        campaign_id: campaignId,
        password_hash: passwordHash,
      },
      { onConflict: "campaign_id" },
    );

    if (credentialTableError) throw new Error(credentialTableError.message);
  }

  if (insertChildTables) {
    campaignTable.forEach((ct) => {
      ct.campaign_id = campaignId;
    });
    survey.forEach((s) => {
      s.campaign_id = campaignId;
    });
    triggers.forEach((t) => {
      t.campaign_id = campaignId;
    });
    webapps.forEach((w) => {
      w.campaign_id = campaignId;
    });

    const [, surveyIds, webappIds] = await Promise.all([
      upsertCampaignTable(campaignTable),
      upsertSurvey(survey),
      upsertCampaignWebapp(webapps),
    ]);

    if (triggers.length > 0) {
      await upsertCampaignTrigger(triggers, campaignId, surveyIds, webappIds);
    }
  }

  return data[0].id;
};

const NEW_ROW_INSERT_CONCURRENCY = 8;

/**
 * Upsert rows and return their database ids in the same order as `rows`.
 *
 * Children are linked to parents by these ids, which used to be read positionally from a
 * single bulk upsert's RETURNING list; Postgres does not guarantee that order. Existing
 * rows (with an id) are upserted in bulk and matched by id; new rows are inserted one per
 * request (a few at a time) so each returned id is known to belong to its row.
 */
async function upsertReturningIds<Row extends { id?: number }>(table: string, rows: Row[]): Promise<number[]> {
  const ids: number[] = new Array(rows.length);

  const existing = rows.map((row, index) => ({ row, index })).filter(({ row }) => typeof row.id === "number");
  if (existing.length > 0) {
    const { data, error } = await supabase
      .from(table as never)
      .upsert(existing.map(({ row }) => row) as never, { defaultToNull: false })
      .select("id");
    if (error) throw new Error(error.message);
    const returned = new Set((data as { id: number }[]).map((d) => d.id));
    for (const { row, index } of existing) {
      if (!returned.has(row.id as number)) throw new Error(`Row ${row.id} in ${table} was not saved.`);
      ids[index] = row.id as number;
    }
  }

  const created = rows.map((row, index) => ({ row, index })).filter(({ row }) => typeof row.id !== "number");
  for (let start = 0; start < created.length; start += NEW_ROW_INSERT_CONCURRENCY) {
    await Promise.all(
      created.slice(start, start + NEW_ROW_INSERT_CONCURRENCY).map(async ({ row, index }) => {
        const { data, error } = await supabase
          .from(table as never)
          .insert(row as never)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        ids[index] = (data as { id: number }).id;
      }),
    );
  }

  return ids;
}

export const upsertCampaignTrigger = async (
  triggers: CampaignTrigger[],
  campaignId: number,
  surveyIds: number[],
  webappIds: number[],
): Promise<void> => {
  if (triggers.length === 0) return;

  const rows = triggers.map((t) => {
    const row: {
      id?: number;
      campaign_id: number;
      name: string;
      condition: Json;
      action: Json;
    } = {
      id: t.id,
      campaign_id: campaignId,
      name: t.name ?? "",
      condition: t.condition as Json,
      // Column is named `action` (singular) but stores a JSON array of persisted actions.
      action: persistActions(t.actions, surveyIds, webappIds) as Json,
    };
    if (row.id === -1 || row.id === undefined) delete row.id;
    return row;
  });

  const { error } = await supabase.from("campaign_trigger").upsert(rows, { defaultToNull: false });
  if (error) throw new Error(error.message);
};

export const upsertCampaignTable = async (
  campaignTable: CampaignTable[],
  insertChildTables: boolean = true,
): Promise<void> => {
  if (campaignTable.length === 0) return;
  campaignTable.filter((ct) => ct.id === -1).forEach((ct) => delete ct.id);

  const propagatedCampaignTable = structuredClone(campaignTable);
  const insertedCampaignTable = structuredClone(campaignTable).map((v) => omit(v, "campaign_table_field"));

  const insertedId = await upsertReturningIds("campaign_table", insertedCampaignTable);

  if (insertChildTables) {
    propagatedCampaignTable.forEach((ct, idx) => {
      ct.campaign_table_field.forEach((ctf) => (ctf.campaign_table_id = insertedId[idx]));
    });
    const campaignTableFields = propagatedCampaignTable.flatMap((ct) => ct.campaign_table_field);
    await upsertCampaignTableField(campaignTableFields, insertChildTables);
  }
};

export const upsertCampaignTableField = async (
  campaignTableField: CampaignTableField[],
  insertChildTables: boolean = true,
): Promise<void> => {
  if (campaignTableField.length === 0) return;
  campaignTableField.filter((ctf) => ctf.id === -1).forEach((ctf) => delete ctf.id);

  const propagatedCampaignTableField: CampaignTableField[] = structuredClone(campaignTableField);
  const insertedCampaignTableField = structuredClone(campaignTableField).map((v) =>
    omit(v, "campaign_table_field_mapping"),
  );

  const insertedId = await upsertReturningIds("campaign_table_field", insertedCampaignTableField);

  if (insertChildTables) {
    propagatedCampaignTableField.forEach((ctf, idx) => {
      ctf.campaign_table_field_mapping.forEach((ctfm) => (ctfm.field_id = insertedId[idx]));
    });
    const campaignTableFieldMappings = propagatedCampaignTableField.flatMap((ctf) => ctf.campaign_table_field_mapping);
    if (campaignTableFieldMappings.length === 0) return;
    // New mappings (e.g. Gesture and Activity Recognition labels from templates) carry
    // id -1. Sending several rows with the same id makes Postgres reject the whole
    // upsert, so strip it as is done for fields above.
    campaignTableFieldMappings.filter((m) => m.id === -1).forEach((m) => delete m.id);
    const { error: mappingError } = await supabase
      .from("campaign_table_field_mapping")
      .upsert(campaignTableFieldMappings, { defaultToNull: false });
    if (mappingError) throw new Error(mappingError.message);
  }
};

export const upsertSurvey = async (survey: Survey[], insertChildTables: boolean = true): Promise<number[]> => {
  if (survey.length === 0) return [];
  survey.filter((s) => s.id === -1).forEach((s) => delete s.id);

  const propagatedSurvey = structuredClone(survey);
  const insertedSurvey = structuredClone(survey).map((v) => omit(v, "survey_question"));

  const insertedId = await upsertReturningIds("survey", insertedSurvey);

  if (insertChildTables) {
    propagatedSurvey.forEach((s, idx) => {
      recursivelyFillSurveyId(s.survey_question, insertedId[idx]);
      // Questions are flattened level by level below, so record sibling order first.
      assignQuestionPositions(s.survey_question);
    });
    const surveyQuestions = propagatedSurvey.flatMap((s) => s.survey_question);
    await upsertSurveyQuestion(surveyQuestions, insertChildTables);
  }

  return insertedId;
};

export const upsertSurveyQuestion = async (
  surveyQuestion: SurveyQuestion[],
  insertChildTables: boolean = true,
): Promise<void> => {
  if (surveyQuestion.length === 0) return;
  surveyQuestion.filter((sq) => sq.id === -1).forEach((sq) => delete sq.id);

  const propagatedSurveyQuestion: SurveyQuestion[] = structuredClone(surveyQuestion);
  const insertedSurveyQuestion = (structuredClone(surveyQuestion) as SurveyQuestion[]).map((sq) =>
    omit(
      {
        ...sq,
        config: (sq.config ?? {}) as unknown as Json,
      },
      "survey_question_trigger",
    ),
  );

  const insertedId = await upsertReturningIds("survey_question", insertedSurveyQuestion);

  if (insertChildTables) {
    propagatedSurveyQuestion.forEach((sq, idx) => {
      sq.survey_question_trigger.forEach((st) => {
        st.question_id = insertedId[idx];
      });
    });
    const surveyQuestionTriggers = propagatedSurveyQuestion.flatMap((sq) => sq.survey_question_trigger);
    await upsertSurveyTrigger(surveyQuestionTriggers, insertChildTables);
  }
};

export const upsertSurveyTrigger = async (
  surveyTrigger: SurveyQuestionTrigger[],
  insertChildTables: boolean = true,
): Promise<void> => {
  if (surveyTrigger.length === 0) return;

  const propagatedSurveyTrigger: SurveyQuestionTrigger[] = structuredClone(surveyTrigger);
  const insertedSurveyTrigger = structuredClone(surveyTrigger).map((v) => omit(v, "survey_question"));
  insertedSurveyTrigger.filter((st) => st.id === -1).forEach((st) => delete st.id);

  const insertedId = await upsertReturningIds("survey_question_trigger", insertedSurveyTrigger);
  if (insertChildTables) {
    propagatedSurveyTrigger.forEach((st, idx) => {
      st.survey_question.forEach((sq) => (sq.triggered_by = insertedId[idx]));
    });
    const surveyQuestions = propagatedSurveyTrigger.flatMap((st) => st.survey_question);
    await upsertSurveyQuestion(surveyQuestions, insertChildTables);
  }
};

// Returns ids in the same order as `webapps`, like `upsertSurvey` — trigger rows reference a
// webapp by its position in this array (`webappIndex` in the editable TriggerAction) until this
// resolves it to a real `campaign_webapp.id` (see `upsertCampaignTrigger`).
export const upsertCampaignWebapp = async (webapps: CampaignWebapp[]): Promise<number[]> => {
  if (webapps.length === 0) return [];
  webapps.filter((w) => w.id === -1).forEach((w) => delete w.id);

  const insertedWebapps: CampaignWebapp[] = structuredClone(webapps);

  return upsertReturningIds("campaign_webapp", insertedWebapps);
};

/**
 * Delete removed sensor tables, fields and mappings. Must run BEFORE upserting the
 * campaign: campaign_table is unique on (campaign_id, name), so re-adding a removed
 * sensor (or importing a config with the same sensors) would otherwise collide
 * with the row that is still waiting to be deleted.
 */
export const deleteRemovedTables = async (removedEntries: RemovedEntries): Promise<void> => {
  const deletions = [
    { table: "campaign_table_field_mapping", ids: removedEntries.mapping },
    { table: "campaign_table_field", ids: removedEntries.field },
    { table: "campaign_table", ids: removedEntries.table },
  ] as const;

  for (const { table, ids } of deletions) {
    const existingIds = ids.filter((id) => id !== -1);
    if (existingIds.length === 0) continue;
    const { error } = await supabase.from(table).delete().in("id", existingIds);
    if (error) throw new Error(error.message);
  }
};

/**
 * Delete the remaining removed rows. Runs AFTER the upsert, because questions can be
 * re-parented to a new trigger before their old parent is deleted.
 */
export const deleteEntries = async (removedEntries: RemovedEntries): Promise<void> => {
  await supabase.from("survey").delete().in("id", removedEntries.survey);
  await supabase.from("survey_question").delete().in("id", removedEntries.question);
  await supabase.from("survey_question_trigger").delete().in("id", removedEntries.trigger);
  await supabase.from("campaign_trigger").delete().in("id", removedEntries.campaign_trigger);
  await supabase.from("campaign_webapp").delete().in("id", removedEntries.webapp);
};

export const deleteCampaign = async (campaignId: number): Promise<void> => {
  const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);

  if (error) throw new Error(error.message);
};

export const checkCampaignNameValidity = async (campaignName: string, campaignId: number): Promise<boolean> => {
  if (campaignName == "") return false;

  const { data, error } = await supabase.from("campaigns").select("id").eq("name", campaignName).neq("id", campaignId);

  if (error) throw new Error(error.message);
  if (data && data.length > 0) return false;
  return true;
};
