import { Database } from "@/lib/schema";
import { DeviceType } from "@/types/survey";

export type TriggerSensorKind = "stress" | "physical_activity" | "gesture" | "timing";

export const TRIGGER_SENSOR_KIND_LABEL: Record<TriggerSensorKind, string> = {
  stress: "Stress",
  physical_activity: "Physical Activity",
  gesture: "Gesture",
  timing: "Timing",
};

// Hardcoded value enums per sensor — adjust to match what the EnPULSE Android library emits.
// "timing" is deliberately excluded: its values are the campaign's own named schedules
// (campaign_table.config on the timing_sensor row), not a fixed enum — see getTriggerSensorValues.
export const STATIC_TRIGGER_SENSOR_VALUES: Record<Exclude<TriggerSensorKind, "timing">, readonly string[]> = {
  stress: ["Low", "High"],
  physical_activity: ["In Vehicle", "On Bicycle", "On Foot", "Running", "Still", "Tilting", "Unknown", "Walking"],
  gesture: [
    "Alarm Clock",
    "Blender In Use",
    "Brushing Hair",
    "Chopping",
    "Clapping",
    "Coughing",
    "Drill In Use",
    "Drinking",
    "Grating",
    "Hair Dryer In Use",
    "Hammering",
    "Knocking",
    "Laughing",
    "Microwave",
    "Pouring Pitcher",
    "Sanding",
    "Scratching",
    "Screwing",
    "Shaver In Use",
    "Toilet Flushing",
    "Toothbrushing",
    "Twisting Jar",
    "Vacuum In Use",
    "Washing Utensils",
    "Washing Hands",
    "Wiping With Rag",
    "Other",
  ],
} as const;

// `timingScheduleValues` comes from the campaign's `timing_sensor` campaign_table row's
// `config` array (see `getTimingScheduleValues` in `src/types/timingSchedule.ts`) — kept as a
// plain function parameter, rather than importing that module here, to avoid this file (a
// generic trigger/condition model) depending on the timing-specific config schema.
export function getTriggerSensorValues(sensor: TriggerSensorKind, timingScheduleValues: string[]): readonly string[] {
  return sensor === "timing" ? timingScheduleValues : STATIC_TRIGGER_SENSOR_VALUES[sensor];
}

// Self-recursive: each `children`/`child` slot is itself a `TriggerCondition`,
// so AND / OR / NOT can be nested arbitrarily — e.g. `(A AND B) OR C`,
// `NOT ((A OR B) AND C)`, etc. There is no max depth and no flatten step.
export type TriggerCondition =
  | { type: "detection"; sensor: TriggerSensorKind; value: string }
  | { type: "and"; children: TriggerCondition[] }
  | { type: "or"; children: TriggerCondition[] }
  | { type: "not"; child: TriggerCondition };

export type TriggerActionKind = "ema" | "watch_ema" | "broadcast" | "notification";

export const TRIGGER_ACTION_KIND_LABEL: Record<TriggerActionKind, string> = {
  ema: "EMA",
  watch_ema: "Smartwatch EMA",
  broadcast: "Broadcast",
  notification: "Notification",
};

// One key/value pair attached to the Android Intent's Bundle. `value` is always
// stored as a string and is parsed on the Android side per `valueType`.
export type BroadcastExtraType = "string" | "int" | "long" | "boolean" | "float" | "double";

export const BROADCAST_EXTRA_TYPES: readonly BroadcastExtraType[] = [
  "string",
  "int",
  "long",
  "boolean",
  "float",
  "double",
] as const;

export type BroadcastExtra = {
  key: string;
  valueType: BroadcastExtraType;
  value: string;
};

// `surveyIndex` is used while editing because newly added surveys still have id === -1
// in the editable store. `useUpdateCampaign` resolves it to a real `survey.id` after
// `upsertSurvey` returns. `surveyIndex === -1` means "not selected yet".
export type TriggerAction =
  | { kind: "ema"; surveyIndex: number; minIntervalMillis: number }
  | { kind: "watch_ema"; surveyIndex: number; minIntervalMillis: number }
  | {
      kind: "broadcast";
      // Intent action string the receiving app's <intent-filter android:name="..."/> matches on.
      action: string;
      // Optional explicit-broadcast target package; recommended on Android 8+.
      targetPackage?: string;
      extras: BroadcastExtra[];
      // Optional because rows saved before this field existed lack it (the app treats
      // a missing value as 0).
      minIntervalMillis?: number;
    }
  | {
      kind: "notification";
      title: string;
      description: string;
      url?: string;
      // Which device the notification is shown on — same re-fire throttle semantics as the
      // ema/watch_ema actions' minIntervalMillis.
      deviceType: DeviceType;
      minIntervalMillis: number;
    };

// Shape stored in the `action` jsonb column of `campaign_trigger` (one element per stored array entry).
export type PersistedTriggerAction =
  | { kind: "ema"; survey_id: number; minIntervalMillis: number }
  | { kind: "watch_ema"; survey_id: number; minIntervalMillis: number }
  | {
      kind: "broadcast";
      action: string;
      targetPackage?: string;
      extras: BroadcastExtra[];
      minIntervalMillis?: number;
    }
  | {
      kind: "notification";
      title: string;
      description: string;
      url?: string;
      deviceType: DeviceType;
      minIntervalMillis: number;
    };

export function persistAction(a: TriggerAction, surveyIds: number[]): PersistedTriggerAction {
  if (a.kind === "broadcast") return a;
  if (a.kind === "notification") return a;
  return { kind: a.kind, survey_id: surveyIds[a.surveyIndex], minIntervalMillis: a.minIntervalMillis };
}

export function loadAction(persisted: PersistedTriggerAction, surveys: { id: number }[]): TriggerAction {
  if (persisted.kind === "broadcast" || persisted.kind === "notification") return persisted;
  const index = surveys.findIndex((s) => s.id === persisted.survey_id);
  return { kind: persisted.kind, surveyIndex: index, minIntervalMillis: persisted.minIntervalMillis };
}

export function persistActions(actions: TriggerAction[], surveyIds: number[]): PersistedTriggerAction[] {
  return actions.map((a) => persistAction(a, surveyIds));
}

export function loadActions(raw: unknown, surveys: { id: number }[]): TriggerAction[] {
  // Backwards-compatibility: accept either an array of actions (current) or a single
  // persisted-action object (pre-migration rows). Anything else collapses to [].
  if (Array.isArray(raw)) return raw.map((p) => loadAction(p as PersistedTriggerAction, surveys));
  if (raw && typeof raw === "object") return [loadAction(raw as PersistedTriggerAction, surveys)];
  return [];
}

// `condition` and `action` are stored as `jsonb` in the DB (typed `Json` in schema.ts).
// We narrow them to the structured shapes above so the editor and service can rely on
// strong typing; the supabase client serializes them transparently. The DB column name
// is the (singular) `action` but it now stores a JSON array of actions.
export type CampaignTrigger = Omit<
  Database["public"]["Tables"]["campaign_trigger"]["Insert"],
  "condition" | "action"
> & {
  condition: TriggerCondition;
  actions: TriggerAction[];
};

export type FetchedCampaignTrigger = Omit<
  Database["public"]["Tables"]["campaign_trigger"]["Row"],
  "condition" | "action"
> & {
  condition: TriggerCondition;
  actions: TriggerAction[];
};

export function defaultDetection(): TriggerCondition {
  return { type: "detection", sensor: "stress", value: STATIC_TRIGGER_SENSOR_VALUES.stress[0] };
}

// Collects every `value` from `detection` leaves gated on the "timing" sensor, anywhere in the
// tree. Used to detect which schedules a trigger references (e.g. to warn before a rename, or
// to recognize triggers the guided "Schedule a Survey" flow itself produced).
export function findTimingConditionValues(condition: TriggerCondition): string[] {
  switch (condition.type) {
    case "detection":
      return condition.sensor === "timing" ? [condition.value] : [];
    case "and":
    case "or":
      return condition.children.flatMap(findTimingConditionValues);
    case "not":
      return findTimingConditionValues(condition.child);
  }
}

export function defaultAction(kind: TriggerActionKind): TriggerAction {
  if (kind === "broadcast") return { kind: "broadcast", action: "", extras: [], minIntervalMillis: 0 };
  if (kind === "notification")
    return { kind: "notification", title: "", description: "", deviceType: DeviceType.Phone, minIntervalMillis: 0 };
  return { kind, surveyIndex: -1, minIntervalMillis: 0 };
}

export function defaultBroadcastExtra(): BroadcastExtra {
  return { key: "", valueType: "string", value: "" };
}

// A detection is complete only if its value is one the sensor can emit. For "timing" that is
// the campaign's current schedule names, so renaming or removing a schedule flags the
// triggers that still reference the old name (they would otherwise never fire).
export function isConditionComplete(c: TriggerCondition, timingScheduleValues: string[]): boolean {
  switch (c.type) {
    case "detection":
      return (getTriggerSensorValues(c.sensor, timingScheduleValues) ?? []).includes(c.value);
    case "and":
    case "or":
      return c.children.length > 0 && c.children.every((child) => isConditionComplete(child, timingScheduleValues));
    case "not":
      return isConditionComplete(c.child, timingScheduleValues);
  }
}

// The app parses minIntervalMillis as a whole number (Kotlin `long`) and drops the whole
// trigger otherwise, e.g. for 1.5.
const isValidInterval = (ms: number | undefined) => ms === undefined || (Number.isInteger(ms) && ms >= 0);

export function isExtraValueValid(e: BroadcastExtra): boolean {
  if (e.key.trim().length === 0) return false;
  switch (e.valueType) {
    case "string":
      return true;
    case "int":
    case "long":
      return /^-?\d+$/.test(e.value.trim());
    case "float":
    case "double":
      return /^-?\d+(\.\d+)?$/.test(e.value.trim());
    case "boolean":
      return e.value === "true" || e.value === "false";
  }
}

export function isActionComplete(a: TriggerAction): boolean {
  if (!isValidInterval(a.minIntervalMillis)) return false;
  switch (a.kind) {
    case "ema":
    case "watch_ema":
      return a.surveyIndex >= 0;
    case "broadcast":
      return a.action.trim().length > 0 && a.extras.every(isExtraValueValid);
    case "notification":
      return a.title.trim().length > 0 && a.description.trim().length > 0;
  }
}

export function isTriggerComplete(
  t: { condition: TriggerCondition; actions: TriggerAction[] },
  timingScheduleValues: string[],
): boolean {
  return (
    isConditionComplete(t.condition, timingScheduleValues) && t.actions.length > 0 && t.actions.every(isActionComplete)
  );
}
