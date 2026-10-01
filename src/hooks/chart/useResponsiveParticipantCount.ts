import { RefObject, useEffect, useState } from "react";

// Must stay in sync with the <colgroup> widths in DailyStatTable:
// the label column is `w-40` and each participant column is `w-32`.
export const LABEL_COLUMN_WIDTH = 160;
export const PARTICIPANT_COLUMN_WIDTH = 128;

/**
 * Number of participant columns that fit into `ref`'s current width.
 * Recomputed whenever the element is resized, so the daily overview table
 * shows as many participants per page as the window allows.
 */
export const useResponsiveParticipantCount = (ref: RefObject<HTMLElement | null>, fallback: number = 5) => {
  const [count, setCount] = useState(fallback);

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
