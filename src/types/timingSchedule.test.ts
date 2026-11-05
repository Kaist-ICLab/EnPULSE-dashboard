import { describe, expect, it } from "vitest";
import {
  defaultTimingScheduleEntry,
  getTimingScheduleEntryIssue,
  getTimingScheduleValues,
  nextDefaultScheduleName,
  parseTimingScheduleConfig,
  TimingScheduleEntry,
  TimingScheduleEsm,
} from "./timingSchedule";
import type { CampaignTable } from "./campaign";

const esm = (overrides: Partial<TimingScheduleEsm> = {}): TimingScheduleEntry => ({
  ...(defaultTimingScheduleEntry("esm", "morning") as TimingScheduleEsm),
  ...overrides,
});

describe("parseTimingScheduleConfig", () => {
  it.each([[null], [undefined], [{}], ["x"]])("returns nothing for %j", (raw) => {
    expect(parseTimingScheduleConfig(raw)).toEqual([]);
  });

  it("drops malformed entries and normalizes the kind", () => {
    const entries = parseTimingScheduleConfig([
      { value: "a", kind: "FIXED", timeOfDay: [] },
      { value: "b", kind: "unknown" },
      { kind: "manual" },
      "text",
    ]);

    expect(entries).toEqual([{ value: "a", kind: "fixed", timeOfDay: [] }]);
  });
});

describe("nextDefaultScheduleName", () => {
  it("skips names that are already used", () => {
    expect(nextDefaultScheduleName([])).toBe("schedule_1");
    expect(nextDefaultScheduleName(["schedule_2"])).toBe("schedule_3");
    expect(nextDefaultScheduleName(["other", "schedule_3"])).toBe("schedule_4");
  });
});

describe("getTimingScheduleEntryIssue", () => {
  it("accepts complete schedules", () => {
    expect(getTimingScheduleEntryIssue(esm())).toBeNull();
    expect(getTimingScheduleEntryIssue({ value: "a", kind: "fixed", timeOfDay: [0] })).toBeNull();
    expect(getTimingScheduleEntryIssue({ value: "a", kind: "manual" })).toBeNull();
  });

  it("requires a name", () => {
    expect(getTimingScheduleEntryIssue({ value: "  ", kind: "manual" })).toContain("no name");
  });

  it.each<[Partial<TimingScheduleEsm>, string]>([
    [{ minInterval: Number.NaN }, "empty time or number"],
    [{ minInterval: 0 }, "above 0"],
    [{ minInterval: 2, maxInterval: 1 }, "shorter than its minimum"],
    [{ numSurvey: 0 }, "at least one survey"],
    [{ startOfDay: 5, endOfDay: 5 }, "must end after it starts"],
  ])("flags the ESM problem %j", (overrides, message) => {
    expect(getTimingScheduleEntryIssue(esm(overrides))).toContain(message);
  });

  it("flags fixed schedules with missing times", () => {
    expect(getTimingScheduleEntryIssue({ value: "a", kind: "fixed", timeOfDay: [] })).toContain("no times of day");
    expect(getTimingScheduleEntryIssue({ value: "a", kind: "fixed", timeOfDay: [Number.NaN] })).toContain("empty time");
  });
});

describe("getTimingScheduleValues", () => {
  it("reads schedule names from the timing sensor table only", () => {
    const tables = [
      { name: "stress_sensor", config: [{ value: "ignored", kind: "manual" }] },
      { name: "timing_sensor", config: [{ value: "morning", kind: "manual" }] },
    ] as unknown as CampaignTable[];

    expect(getTimingScheduleValues(tables)).toEqual(["morning"]);
    expect(getTimingScheduleValues([])).toEqual([]);
  });
});
