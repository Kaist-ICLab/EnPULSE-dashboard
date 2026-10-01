import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Time zone the database uses for `::date` and `extract(hour ...)`, which decides the
 * day and 2-hour slot of each campaign_table_row_count row. A fresh Docker or cloud
 * Supabase runs in UTC; set NEXT_PUBLIC_DATABASE_TIMEZONE (e.g. "Asia/Seoul") if the
 * server's Postgres TimeZone was changed. Rebuild after changing it.
 */
export const DATABASE_TIMEZONE = process.env.NEXT_PUBLIC_DATABASE_TIMEZONE || "UTC";

/** Start instant of a database-time-zone day plus `hours`. */
export function databaseDayStart(day: string, hours = 0): dayjs.Dayjs {
  return dayjs.tz(`${day} 00:00`, DATABASE_TIMEZONE).add(hours, "hour");
}

/** The database-time-zone calendar dates that overlap [start, end). */
export function databaseDaysBetween(start: dayjs.Dayjs, end: dayjs.Dayjs): string[] {
  const first = start.tz(DATABASE_TIMEZONE).format("YYYY-MM-DD");
  const last = end.subtract(1, "millisecond").tz(DATABASE_TIMEZONE).format("YYYY-MM-DD");
  return first === last ? [first] : [first, last];
}
