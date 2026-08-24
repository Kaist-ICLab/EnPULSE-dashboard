import { Json } from "@/lib/schema";
import { CampaignTable } from "@/types/campaign";

// `campaign_table.config` is generic per-sensor configuration (any sensor may use it later,
// not just this one) — see docs/supabase-campaign-table-config-migration.md. This file is the
// timing_sensor-specific *consumer* of that generic column; `CampaignTable.config` itself stays
// plain `Json`, unlike how `trigger.ts` narrows `CampaignTrigger.condition`/`.action`.
export const TIMING_SENSOR_TABLE_NAME = "timing_sensor";

export type TimingScheduleKind = "esm" | "fixed" | "manual";

export const TIMING_SCHEDULE_KIND_LABEL: Record<TimingScheduleKind, string> = {
  esm: "ESM (Experience Sampling Method)",
  fixed: "Fixed Times",
  manual: "Manual (no automatic firing)",
};

// All numeric fields are milliseconds, matching TimingSensor.Config.fromJson on the client —
// same units/semantics as the old (now-removed) survey.schedule_method column, just relocated.
export type TimingScheduleEsm = {
  value: string;
  kind: "esm";
  minInterval: number;
  maxInterval: number;
  startOfDay: number;
  endOfDay: number;
  numSurvey: number;
};

export type TimingScheduleFixed = {
  value: string;
  kind: "fixed";
  timeOfDay: number[];
};

// Legal but pointless to author from the UI — a trigger simply omitting a
// Detection("timing", ...) leaf achieves the same "no automatic gate" outcome. Kept in the
// type/kind selector for round-tripping any such entries a user (or a future migration) creates.
export type TimingScheduleManual = {
  value: string;
  kind: "manual";
};

export type TimingScheduleEntry = TimingScheduleEsm | TimingScheduleFixed | TimingScheduleManual;

// `Partial<TimingScheduleEntry>` would collapse to only the fields common across every union
// member (`value`/`kind`) since `keyof` of a union is the intersection of its members' keys —
// not useful for "update one kind-specific field on an entry whose kind is already known". This
// is a flat partial over every field across every kind (excluding `kind` itself, which goes
// through `setEntryKind` since changing kind resets the other fields to that kind's defaults).
export type TimingScheduleEntryFieldUpdate = Partial<{
  value: string;
  minInterval: number;
  maxInterval: number;
  startOfDay: number;
  endOfDay: number;
  numSurvey: number;
  timeOfDay: number[];
}>;

export function defaultTimingScheduleEntry(kind: TimingScheduleKind, value: string): TimingScheduleEntry {
  if (kind === "esm") {
    return { value, kind, minInterval: 3600000, maxInterval: 7200000, startOfDay: 0, endOfDay: 86400000, numSurvey: 3 };
  }
  if (kind === "fixed") {
    return { value, kind, timeOfDay: [] };
  }
  return { value, kind };
}

export function nextDefaultScheduleName(existing: string[]): string {
  let i = existing.length + 1;
  while (existing.includes(`schedule_${i}`)) i++;
  return `schedule_${i}`;
}

// Tolerant runtime guard — a malformed config is a client-side no-op, not fatal, so this only
// filters out entries missing the two always-required string fields; otherwise-partial entries
// (e.g. an esm entry missing numSurvey) are kept as-is since they feed an editable form, not
// just a reader, and `isTimingScheduleEntryComplete` is the place that flags incompleteness.
export function isTimingScheduleEntry(x: unknown): x is TimingScheduleEntry {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return (
    typeof obj.value === "string" &&
    typeof obj.kind === "string" &&
    ["esm", "fixed", "manual"].includes(obj.kind.toLowerCase())
  );
}

export function parseTimingScheduleConfig(raw: Json | null | undefined): TimingScheduleEntry[] {
  if (!Array.isArray(raw)) return [];
  // Lowercasing `kind` widens it from its per-variant literal back to `string`, so the
  // discriminated union can't be re-verified structurally here — `isTimingScheduleEntry`
  // already confirmed each element has a recognized `kind` before this cast.
  return raw
    .filter(isTimingScheduleEntry)
    .map((e) => ({ ...e, kind: e.kind.toLowerCase() })) as unknown as TimingScheduleEntry[];
}

export function serializeTimingScheduleConfig(entries: TimingScheduleEntry[]): Json {
  return entries as unknown as Json;
}

export function isTimingScheduleEntryComplete(entry: TimingScheduleEntry): boolean {
  if (entry.value.trim().length === 0) return false;
  switch (entry.kind) {
    case "esm":
      return (
        entry.minInterval > 0 &&
        entry.maxInterval >= entry.minInterval &&
        entry.numSurvey > 0 &&
        entry.endOfDay > entry.startOfDay
      );
    case "fixed":
      return entry.timeOfDay.length > 0;
    case "manual":
      return true;
  }
}

export function findTimingSensorTable(tables: CampaignTable[]): CampaignTable | undefined {
  return tables.find((t) => t.name === TIMING_SENSOR_TABLE_NAME);
}

export function getTimingScheduleEntries(table: CampaignTable | undefined): TimingScheduleEntry[] {
  if (!table) return [];
  return parseTimingScheduleConfig(table.config ?? null);
}

export function getTimingScheduleValues(tables: CampaignTable[]): string[] {
  return getTimingScheduleEntries(findTimingSensorTable(tables)).map((e) => e.value);
}
