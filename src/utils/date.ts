import dayjs from "dayjs";

export const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

export function getLocalDay() {
  return dayjs().startOf("day").toDate();
}

export function millisecondsToTimeString(ms: number): string {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Parse an "HH:mm" time input value into milliseconds after midnight. Returns null
 * for an empty or partial value (e.g. after deleting the hour), which previously
 * produced NaN and showed "NaN:NaN".
 */
export function timeStringToMilliseconds(timeString: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(timeString);
  if (!match) return null;
  return (Number(match[1]) * 60 + Number(match[2])) * 60 * 1000;
}

export function millisecondsToMinutes(ms: number): number {
  return Math.round(ms / (60 * 1000));
}

export function minutesToMilliseconds(minutes: number): number {
  return minutes * 60 * 1000;
}
