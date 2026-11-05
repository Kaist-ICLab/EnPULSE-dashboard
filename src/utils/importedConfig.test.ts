import { describe, expect, it } from "vitest";
import { parseExportedCampaignConfig } from "./importedConfig";

const parse = (config: unknown) => parseExportedCampaignConfig(JSON.stringify(config));
const minimal = { tables: [], surveys: [], webapps: [] };

describe("parseExportedCampaignConfig", () => {
  it("rejects a file that is not JSON", () => {
    expect(() => parseExportedCampaignConfig("not json")).toThrow("the file is not JSON");
  });

  it.each([[[]], [null], ["text"]])("rejects %j at the top level", (value) => {
    expect(() => parse(value)).toThrow("expected an object");
  });

  it("rejects a file without tables and surveys", () => {
    expect(() => parse({ tables: [] })).toThrow('no "tables" or "surveys"');
  });

  it("rejects lists of the wrong type", () => {
    expect(() => parse({ tables: "x", surveys: [] })).toThrow('"tables"');
  });

  it("rejects a sensor with no name", () => {
    expect(() => parse({ ...minimal, tables: [{}] })).toThrow("sensor 1 has no name");
  });

  it("rejects a malformed question, even when nested", () => {
    const survey = {
      survey_question: [{ survey_question_trigger: [{ survey_question: ["bad"] }] }],
    };
    expect(() => parse({ ...minimal, surveys: [survey] })).toThrow("question 1 in survey 1 is malformed");
  });

  it("rejects a trigger with no condition", () => {
    expect(() => parse({ ...minimal, campaign_trigger: [{}] })).toThrow("trigger 1 has no condition");
  });

  it("fills in missing nested lists", () => {
    const config = parse({ tables: [{ name: "s", campaign_table_field: [{}] }], surveys: [{}] });

    expect(config.webapps).toEqual([]);
    expect(config.tables[0].campaign_table_field[0].campaign_table_field_mapping).toEqual([]);
    expect(config.surveys[0].survey_question).toEqual([]);
  });

  it("keeps triggers undefined for files exported before triggers existed", () => {
    expect(parse(minimal).campaign_trigger).toBeUndefined();
  });

  it("clears survey references that point past the imported surveys", () => {
    const action = (surveyIndex: unknown) => ({ kind: "ema", surveyIndex });
    const config = parse({
      ...minimal,
      surveys: [{}],
      campaign_trigger: [{ condition: {}, actions: [action(0), action(5), action("0")] }],
    });

    const indexes = config.campaign_trigger!.flatMap((t) =>
      t.actions.map((a) => ("surveyIndex" in a ? a.surveyIndex : null)),
    );
    expect(indexes).toEqual([0, -1, -1]);
  });
});
