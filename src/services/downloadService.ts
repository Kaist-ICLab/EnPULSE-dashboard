import { supabase } from "@/lib/supabase";
import { mapQuery } from "@/lib/supabaseHelper";

export async function getDownloadRowCount(participants: string[], startDate: Date, endDate: Date, tables: string[]) {
    const data = await mapQuery(tables, table => {
        return supabase.rpc('count_rows_by_uuid_day', {
            p_table: table,
            p_uuids: participants,
            p_start_day: startDate.toISOString(),
            p_end_day: endDate.toISOString(),
        })
    }) as { count: number, day: string, uuid: string }[][]

    return tables.flatMap((val, idx) => data[idx].map(d => ({
        table: val,
        uuid: d.uuid,
        date: new Date(d.day),
        count: d.count,
    })))
}