/**
 * Watch microEMA expiration time. expire_after_ms defaults to 0 in the database, and the
 * watch's countdown loop (`while (remaining > 0)`) skips entirely at 0, so the prompt
 * closes as "expired" the instant it opens. Also guards against a value low enough that
 * no participant could realistically answer in time (e.g. typing "30" meaning 30ms).
 */
export const DEFAULT_WATCH_SURVEY_EXPIRE_MS = 30_000;
export const MIN_WATCH_SURVEY_EXPIRE_MS = 5_000;
