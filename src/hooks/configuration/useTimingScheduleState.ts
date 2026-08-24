import { useCallback, useMemo } from "react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import {
  TIMING_SENSOR_TABLE_NAME,
  TimingScheduleEntry,
  TimingScheduleEntryFieldUpdate,
  TimingScheduleKind,
  defaultTimingScheduleEntry,
  getTimingScheduleEntries,
  parseTimingScheduleConfig,
  serializeTimingScheduleConfig,
} from "@/types/timingSchedule";

const TIMING_SENSOR_TABLE_TEMPLATE = {
  id: -1,
  campaign_id: -1,
  name: TIMING_SENSOR_TABLE_NAME,
  display_name: "Timing Schedules",
  description: "Named schedules consumed by the client's TimingSensor",
  daily_count_max: 0,
  is_custom: false,
};

/**
 * UI-layer home for "timing schedule" as a concept — sits on top of the generic,
 * sensor-agnostic `upsertTableConfigByName` store action the same way the old (removed)
 * `useSurveyScheduleState` sat on top of the single `updateSurveyScheduleMethod` setter.
 * The store itself knows nothing about timing schedules; this hook is where the
 * `campaign_table.config` JSON gets parsed, mutated, and re-serialized.
 */
export function useTimingScheduleState() {
  const { tables, upsertTableConfigByName } = useCampaignConfigEdit((state) => state);

  const tableIndex = useMemo(() => tables.findIndex((t) => t.name === TIMING_SENSOR_TABLE_NAME), [tables]);
  const entries = useMemo(
    () => getTimingScheduleEntries(tableIndex >= 0 ? tables[tableIndex] : undefined),
    [tables, tableIndex],
  );

  // Applies `mutate` to whatever the timing_sensor row's config *actually is at the moment the
  // store processes this call* (not a React-memoized `entries` snapshot), via the atomic
  // `upsertTableConfigByName` store action. This is what makes rapid repeated calls (e.g. a
  // fast double-click before React has re-rendered) safe: the store, not this hook, decides
  // whether the row already exists, and it always checks live state.
  const commit = useCallback(
    (mutate: (current: TimingScheduleEntry[]) => TimingScheduleEntry[]) => {
      upsertTableConfigByName(TIMING_SENSOR_TABLE_NAME, TIMING_SENSOR_TABLE_TEMPLATE, (currentConfig) =>
        serializeTimingScheduleConfig(mutate(parseTimingScheduleConfig(currentConfig))),
      );
    },
    [upsertTableConfigByName],
  );

  const addEntry = useCallback(
    (entry: TimingScheduleEntry) => {
      commit((current) => [...current, entry]);
    },
    [commit],
  );

  const updateEntry = useCallback(
    (index: number, updates: TimingScheduleEntryFieldUpdate) => {
      commit((current) => current.map((e, i) => (i === index ? ({ ...e, ...updates } as TimingScheduleEntry) : e)));
    },
    [commit],
  );

  const removeEntry = useCallback(
    (index: number) => {
      commit((current) => current.filter((_, i) => i !== index));
    },
    [commit],
  );

  const setEntryKind = useCallback(
    (index: number, kind: TimingScheduleKind) => {
      commit((current) => current.map((e, i) => (i === index ? defaultTimingScheduleEntry(kind, e.value) : e)));
    },
    [commit],
  );

  return { tableIndex, entries, addEntry, updateEntry, removeEntry, setEntryKind };
}

export default useTimingScheduleState;
