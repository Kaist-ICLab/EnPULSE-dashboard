/**
 * Watch microEMA expiration time. expire_after_ms defaults to 0 in the database, and the
 * watch's countdown loop (`while (remaining > 0)`) skips entirely at 0, so the prompt
 * closes as "expired" the instant it opens. Also guards against a value low enough that
 * no participant could realistically answer in time (e.g. typing "30" meaning 30ms).
 */
export const DEFAULT_WATCH_SURVEY_EXPIRE_MS = 30_000;
export const MIN_WATCH_SURVEY_EXPIRE_MS = 5_000;

/**
 * Largest allowed number-scale range (max - min). The branching rule editor lists every
 * value on the scale as an option, so a max like 100000000 froze the tab, and a phone
 * picker with hundreds of steps is unusable anyway.
 */
export const MAX_NUMBER_SCALE_STEPS = 100;

/** Why a number-scale range is invalid, as a user-facing sentence, or null when it is fine. */
export function getNumberScaleIssue(min: number, max: number): string | null {
  if (!Number.isInteger(min) || !Number.isInteger(max)) return "The scale's minimum and maximum must be whole numbers.";
  if (max <= min) return "The scale's maximum must be greater than its minimum.";
  if (max - min > MAX_NUMBER_SCALE_STEPS) {
    return `The scale can span at most ${MAX_NUMBER_SCALE_STEPS} steps (maximum minus minimum).`;
  }
  return null;
}
