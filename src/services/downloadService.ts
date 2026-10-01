import { supabase } from "@/lib/supabase";
import { mapQuery } from "@/lib/supabaseHelper";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/date";
import { Ok } from "@/utils/type";
import { databaseDayStart } from "@/utils/databaseTimezone";

export async function getDownloadRowCount(participants: string[], startDate: Date, endDate: Date, tables: string[]) {
  const data = (await mapQuery(tables, (table) => {
    return supabase
      .rpc("count_rows_by_uuid_day", {
        p_table: table,
        p_uuids: participants,
        p_start_day: dayjs(startDate).startOf("day").format(DATE_FORMAT),
        p_end_day: dayjs(endDate).endOf("day").format(DATE_FORMAT),
      })
      .order("uuid", { ascending: true })
      .order("day", { ascending: true });
  })) as Ok<{ count: number; day: string; uuid: string }[]>[];

  return tables.flatMap((val, idx) =>
    data[idx].data.map((d) => ({
      table: val,
      uuid: d.uuid,
      // count_rows_by_uuid_day groups by "timestamp"::date in the database time zone.
      // Parse the day as a calendar date (dayjs reads "YYYY-MM-DD" as local midnight);
      // new Date("YYYY-MM-DD") is UTC midnight and showed the previous day in some zones.
      date: dayjs(d.day).toDate(),
      count: d.count,
    })),
  );
}

export async function getDownloadData(
  participant: string,
  fields: string[],
  date: Date,
  table: string,
  isPreview: boolean = false,
) {
  const selectedFields = "uuid, timestamp, " + fields.join(",");
  // Fetch the same database-time-zone day that getDownloadRowCount counted, so the CSV has
  // exactly the listed number of rows (the browser's local day could differ by hours).
  const dayStart = databaseDayStart(dayjs(date).format("YYYY-MM-DD"));
  let supabasePromise = supabase
    .from(table as never)
    .select(selectedFields)
    .eq("uuid", participant)
    .gte("timestamp", dayStart.format(DATE_FORMAT))
    .lt("timestamp", dayStart.add(1, "day").format(DATE_FORMAT))
    .order("timestamp", { ascending: true });

  if (isPreview) supabasePromise = supabasePromise.limit(10);
  const { data, error } = await supabasePromise;

  if (error) throw new Error(error.message);

  return data;
}
