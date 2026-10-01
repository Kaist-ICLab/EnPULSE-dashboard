import { useMemo, useState } from "react";
import { UserDailyStatData } from "@/types/dashboard";

/**
 * Participant selection for the Daily Overview table, keyed by uuid. It used to be a
 * boolean array indexed by row position, so after changing page the same checkboxes
 * pointed at different participants. Selections now persist across pages; "select all"
 * applies to the participants on the current page.
 */
export function useDailyStatTableCheckedState(data: UserDailyStatData[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Per-row flags for the current page, in the same order as `data`.
  const checkedState = useMemo(() => data.map((row) => selected.has(row.uuid)), [data, selected]);
  const checkCount = selected.size;
  const isAllChecked = data.length > 0 && checkedState.every((state) => state);
  // Selection order is insertion order, so [0] is the first participant that was ticked.
  const selectedUuids = useMemo(() => Array.from(selected), [selected]);

  const toggleChecked = (index: number) => {
    const uuid = data[index]?.uuid;
    if (!uuid) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  };

  const toggleAllChecked = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const row of data) {
        if (isAllChecked) next.delete(row.uuid);
        else next.add(row.uuid);
      }
      return next;
    });
  };

  return { checkCount, toggleChecked, checkedState, isAllChecked, toggleAllChecked, selectedUuids };
}
