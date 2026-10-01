import type { ImportedCampaignConfig } from "@/stores/campaignConfigEditStore";

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const fail = (detail: string): never => {
  throw new Error(`This is not a valid EnPULSE configuration file: ${detail}.`);
};

/** Ensure `obj[key]` is an array, defaulting a missing key to []. */
const arrayField = (obj: JsonObject, key: string, where: string): unknown[] => {
  if (obj[key] === undefined) obj[key] = [];
  if (!Array.isArray(obj[key])) fail(`"${key}" in ${where} must be a list`);
  return obj[key] as unknown[];
};

const checkQuestions = (questions: unknown[], where: string) => {
  questions.forEach((q, i) => {
    if (!isObject(q)) fail(`question ${i + 1} in ${where} is malformed`);
    const question = q as JsonObject;
    for (const trigger of arrayField(question, "survey_question_trigger", where)) {
      if (!isObject(trigger)) fail(`a branching rule in ${where} is malformed`);
      checkQuestions(arrayField(trigger as JsonObject, "survey_question", where), where);
    }
  });
};

/**
 * Parse and structurally validate an exported campaign configuration.
 *
 * The edit store walks nested arrays (fields, mappings, questions, branches), so
 * a malformed file would otherwise crash the editor. Missing nested lists are
 * filled with []; survey references in triggers that point past the imported
 * surveys are reset to "not selected" (-1). `campaign_trigger` stays undefined
 * when the file has none (exports made before triggers were included), so the
 * caller can tell "no triggers" from "old format".
 *
 * Throws an Error with a user-facing message.
 */
export function parseExportedCampaignConfig(raw: string): ImportedCampaignConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail("the file is not JSON");
  }
  if (!isObject(parsed)) return fail("expected an object at the top level");
  // Every export has both lists; without them an import would silently replace the
  // whole configuration with nothing.
  if (parsed.tables === undefined || parsed.surveys === undefined) {
    return fail('it has no "tables" or "surveys" list');
  }

  const tables = arrayField(parsed, "tables", "the file");
  tables.forEach((t, i) => {
    if (!isObject(t) || typeof t.name !== "string") fail(`sensor ${i + 1} has no name`);
    for (const field of arrayField(t as JsonObject, "campaign_table_field", `sensor "${(t as JsonObject).name}"`)) {
      if (!isObject(field)) fail(`a field of sensor "${(t as JsonObject).name}" is malformed`);
      arrayField(field as JsonObject, "campaign_table_field_mapping", `sensor "${(t as JsonObject).name}"`);
    }
  });

  const surveys = arrayField(parsed, "surveys", "the file");
  surveys.forEach((s, i) => {
    if (!isObject(s)) fail(`survey ${i + 1} is malformed`);
    checkQuestions(arrayField(s as JsonObject, "survey_question", `survey ${i + 1}`), `survey ${i + 1}`);
  });

  arrayField(parsed, "webapps", "the file");

  if (parsed.campaign_trigger !== undefined) {
    const triggers = arrayField(parsed, "campaign_trigger", "the file");
    triggers.forEach((t, i) => {
      if (!isObject(t) || !isObject(t.condition)) fail(`trigger ${i + 1} has no condition`);
      for (const action of arrayField(t as JsonObject, "actions", `trigger ${i + 1}`)) {
        if (!isObject(action)) fail(`an action of trigger ${i + 1} is malformed`);
        const a = action as JsonObject;
        if ("surveyIndex" in a) {
          const index = a.surveyIndex;
          if (typeof index !== "number" || !Number.isInteger(index) || index < -1 || index >= surveys.length) {
            a.surveyIndex = -1;
          }
        }
      }
    });
  }

  return parsed as unknown as ImportedCampaignConfig;
}
