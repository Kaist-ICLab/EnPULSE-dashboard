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

function restoreSurveyHierarchy(surveyQuestion: SingleLevelSurveyQuestion, questionList: SingleLevelSurveyQuestion[]) {
  for (const trigger of surveyQuestion.survey_question_trigger) {
    const childQuestion = questionList.filter((q) => q.triggered_by === trigger.id);
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

export const getCampaignInfo = async (campaignId: number): Promise<FetchedCampaign> => {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `*, profiles(*), survey(*, survey_question(*, survey_question_trigger!survey_question_trigger_question_id_fkey(*))), campaign_table(*, campaign_table_field(*, campaign_table_field_mapping(*))), campaign_trigger(*), campaign_webapp(*)`,
    )
    .eq("id", campaignId)
    .single();

  if (error) throw new Error(error.message);

  data.survey.forEach((s) => {
    const topLevelSurveyQuestion = s.survey_question.filter((sq) => sq.triggered_by === null);
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
    actions: loadActions(row.action, data.survey),
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

    const [, surveyIds] = await Promise.all([
      upsertCampaignTable(campaignTable),
      upsertSurvey(survey),
      upsertCampaignWebapp(webapps),
    ]);

    if (triggers.length > 0) {
      await upsertCampaignTrigger(triggers, campaignId, surveyIds);
    }
  }

  return data[0].id;
};

export const upsertCampaignTrigger = async (
  triggers: CampaignTrigger[],
  campaignId: number,
  surveyIds: number[],
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
      action: persistActions(t.actions, surveyIds) as Json,
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

  const { data, error } = await supabase
    .from("campaign_table")
    .upsert(insertedCampaignTable, { defaultToNull: false })
    .select();

  if (error) throw new Error(error.message);
  const insertedId = data.map((d) => d.id);

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

  const { data, error } = await supabase
    .from("campaign_table_field")
    .upsert(insertedCampaignTableField, { defaultToNull: false })
    .select();
  if (error) throw new Error(error.message);
  const insertedId = data.map((d) => d.id);

  if (insertChildTables) {
    propagatedCampaignTableField.forEach((ctf, idx) => {
      ctf.campaign_table_field_mapping.forEach((ctfm) => (ctfm.field_id = insertedId[idx]));
    });
    const campaignTableFieldMappings = propagatedCampaignTableField.flatMap((ctf) => ctf.campaign_table_field_mapping);
    await supabase
      .from("campaign_table_field_mapping")
      .upsert(campaignTableFieldMappings, { defaultToNull: false })
      .select();
  }
};

export const upsertSurvey = async (survey: Survey[], insertChildTables: boolean = true): Promise<number[]> => {
  if (survey.length === 0) return [];
  survey.filter((s) => s.id === -1).forEach((s) => delete s.id);

  const propagatedSurvey = structuredClone(survey);
  const insertedSurvey = structuredClone(survey).map((v) => omit(v, "survey_question"));

  const { data, error } = await supabase.from("survey").upsert(insertedSurvey, { defaultToNull: false }).select();
  if (error) throw new Error(error.message);
  const insertedId = data.map((d) => d.id);

  if (insertChildTables) {
    propagatedSurvey.forEach((s, idx) => recursivelyFillSurveyId(s.survey_question, insertedId[idx]));
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

  const { data, error } = await supabase
    .from("survey_question")
    .upsert(insertedSurveyQuestion, { defaultToNull: false })
    .select();
  if (error) throw new Error(error.message);
  const insertedId = data.map((d) => d.id);

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

  const { data, error } = await supabase
    .from("survey_question_trigger")
    .upsert(insertedSurveyTrigger, { defaultToNull: false })
    .select();
  if (error) throw new Error(error.message);

  const insertedId = data.map((d) => d.id);
  if (insertChildTables) {
    propagatedSurveyTrigger.forEach((st, idx) => {
      st.survey_question.forEach((sq) => (sq.triggered_by = insertedId[idx]));
    });
    const surveyQuestions = propagatedSurveyTrigger.flatMap((st) => st.survey_question);
    await upsertSurveyQuestion(surveyQuestions, insertChildTables);
  }
};

export const upsertCampaignWebapp = async (webapps: CampaignWebapp[]): Promise<void> => {
  if (webapps.length === 0) return;
  webapps.filter((w) => w.id === -1).forEach((w) => delete w.id);

  const insertedWebapps: CampaignWebapp[] = structuredClone(webapps);

  const { error } = await supabase.from("campaign_webapp").upsert(insertedWebapps, { defaultToNull: false });

  if (error) throw new Error(error.message);
};

export const deleteEntries = async (removedEntries: RemovedEntries): Promise<void> => {
  await supabase.from("campaign_table").delete().in("id", removedEntries.table);
  await supabase.from("campaign_table_field").delete().in("id", removedEntries.field);
  await supabase.from("campaign_table_field_mapping").delete().in("id", removedEntries.mapping);
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
