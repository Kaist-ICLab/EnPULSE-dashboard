import { RefObject, useEffect, useState } from "react";

// Must stay in sync with the <colgroup> widths in DailyStatTable:
// the label column is `w-56` (224px) and each participant column is `w-32` (128px).
export const LABEL_COLUMN_WIDTH = 224;
export const PARTICIPANT_COLUMN_WIDTH = 128;

/**
 * Number of participant columns that fit into `ref`'s current width, recomputed on resize.
 * Returns null until the first measurement, so callers can wait instead of fetching data
 * for a placeholder count and then fetching again once the real width is known.
 * A fixed 5 participants used only about a third of a 27-inch booth monitor.
 * Ported from origin/junmo/configuration (8691dc5), adjusted to main's label column width.
 */
export const useResponsiveParticipantCount = (ref: RefObject<HTMLElement | null>) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = (width: number) => {
      if (width === 0) return;
      setCount(Math.max(1, Math.floor((width - LABEL_COLUMN_WIDTH) / PARTICIPANT_COLUMN_WIDTH)));
    };

    measure(element.clientWidth);

    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width));
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return count;
};

export default useResponsiveParticipantCount;
