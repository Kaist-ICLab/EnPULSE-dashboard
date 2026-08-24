"use client";

import { Button } from "flowbite-react";
import { useMemo } from "react";
import useTimingScheduleState from "@/hooks/configuration/useTimingScheduleState";
import { defaultTimingScheduleEntry, nextDefaultScheduleName } from "@/types/timingSchedule";
import TimingScheduleEntryCard from "./TimingScheduleEntryCard";

// Renders in place of PassiveSensingConfigTable for the timing_sensor row — this table doesn't
// log data rows, so the usual field grid / daily-count-threshold UI doesn't apply here.
const TimingScheduleForm: React.FC = () => {
  const { entries, addEntry, updateEntry, removeEntry, setEntryKind } = useTimingScheduleState();

  const nameCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((e) => counts.set(e.value.trim(), (counts.get(e.value.trim()) ?? 0) + 1));
    return counts;
  }, [entries]);

  const nameError = (value: string): string | undefined => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return "Schedule name cannot be empty";
    if ((nameCounts.get(trimmed) ?? 0) > 1) return "Schedule name must be unique";
    return undefined;
  };

  return (
    <div className="flex flex-col gap-3">
      {entries.length === 0 && <p className="text-sm text-gray-500 italic">No timing schedules configured yet.</p>}
      {entries.map((entry, index) => (
        <TimingScheduleEntryCard
          key={index}
          entry={entry}
          index={index}
          onUpdate={(updates) => updateEntry(index, updates)}
          onKindChange={(kind) => setEntryKind(index, kind)}
          onRemove={() => removeEntry(index)}
          nameError={nameError(entry.value)}
        />
      ))}
      <Button
        color="gray"
        size="sm"
        onClick={() =>
          addEntry(defaultTimingScheduleEntry("esm", nextDefaultScheduleName(entries.map((e) => e.value))))
        }
      >
        <span className="icon-[material-symbols--add] mr-2 h-5 w-5" />
        Add Schedule
      </Button>
    </div>
  );
};

export default TimingScheduleForm;
