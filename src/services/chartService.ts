import { DynamicDataColumn } from '@/hooks/charts/useUserDailyStat';
import { supabase } from '@/lib/supabase';
import { mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTableFieldWithTable } from '@/types/campaign';
import { ChartParams } from '@/types/chart';
// import { mapQuery } from '@/lib/supabaseHelper';

type BucketData = { bucket: string, avg_value: number, min_value: number, max_value: number }[][]

export async function getCampaignDailySummary(campaignId: number, date: Date, page: number, pageCount: number) {
    const from = (page - 1) * pageCount;
    const to = from + pageCount - 1;

    const { data, error } = await supabase
        .from(`profiles`)
        .select(`uuid, email, campaign_table_user_daily_summary(*), messages(count)`)
        .eq('campaign_id', campaignId)
        .filter('campaign_table_user_daily_summary.day', 'eq', date.toISOString().split('T')[0])
        .range(from, to)

    if (error) throw new Error(error.message);

    if (data.length == 0) return []

    const campaignTableId = data[0].campaign_table_user_daily_summary.map(v => v.campaign_table_id)
    const columnNameQuery = await mapQuery(campaignTableId, v => {
        return supabase
            .from(`campaign_table`)
            .select(`name, daily_count_max`)
            .eq(`id`, v)
    }) as { name: string; daily_count_max: number }[][]
    const columnName = columnNameQuery.map(v => v[0]?.name ?? '')
    const dailyCountMax = columnNameQuery.map(v => v[0]?.daily_count_max ?? 0)

    return data.map(v => {
        const columns = {} as { [name: string]: DynamicDataColumn }

        v.campaign_table_user_daily_summary.forEach((table, idx) => {
            const timeline = Array.from({ length: 8 }).map((_, i) =>
                table[`hourly_count_${i}`]
            )
            const dailyCount = timeline.reduce((a, b) => a + b, 0)
            columns[columnName[idx]] = {
                dailyCountMax: dailyCountMax[idx],
                dailyCount,
                timeline
            }
        })

        return {
            email: v.email,
            uuid: v.uuid,
            contacts: v.messages[0].count,
            columns
        }
    })
}

export async function getDailyStatCount(campaignId: number) {
    const { count, error } = await supabase
        .from(`profiles`)
        .select(`*`, { count: 'exact' })
        .eq('campaign_id', campaignId)

    if (error) throw new Error(error.message);

    return Math.max(count ?? 1, 1)
}

export async function getTimelineOverviewData(fields: CampaignTableFieldWithTable[], params: ChartParams, timeRange: { start: number, end: number }, bucketSize: string) {
    const { uuid, date } = params;

    const data = await mapQuery(fields, v => {
        return supabase.rpc('bucket_numerical_data', {
            start_time: new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            uuid: uuid,
            table_name: v.tableName,
            column_name: v.name,
            bucket_unit: bucketSize,
        })
        // return supabase
        //     .from(v.tableName)
        //     .select(`${v.name}, timestamp`)
        //     .eq('uuid', uuid)
        //     .gte('timestamp', date.toISOString().split('T')[0])
        //     .lt('timestamp', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    }) as BucketData

    const timestamp = data[0]?.map(v => new Date(v.bucket).getTime())

    return fields.map((v, idx) => (
        {
            title: v.displayName,
            id: `${v.id}`,
            table: v.tableName,
            column: v.name,
            chartType: (v.field_type === "categorical" ? "categorical" : "numerical") as ("categorical" | "numerical"),
            params: { ...params, fieldId: v.id },
            timestamp,
            value: data[idx] ? data[idx].map(d => ({ avg_value: d.avg_value, min_value: d.min_value, max_value: d.max_value })) : []
        }
    ))
}

export async function getInterPersonData(fields: CampaignTableFieldWithTable[], participants: CampaignParticipant[], params: ChartParams, bucketSize: string) {
    const { date, fieldId } = params;
    const field = fields.find(v => v.id === fieldId)
    if (!field) throw new Error('Field not found');

    const tableName = field.tableName
    const columnName = field.name

    const data = await mapQuery(participants, p => {
        // return supabase
        //     .from(tableName)
        //     .select(`${columnName}, timestamp`)
        //     .eq('uuid', p.uuid)
        //     .gte('timestamp', date.toISOString().split('T')[0])
        //     .lt('timestamp', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

        return supabase.rpc('bucket_numerical_data', {
            start_time: date.toISOString(),
            end_time: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            uuid: p.uuid,
            table_name: tableName,
            column_name: columnName,
            bucket_unit: bucketSize,
        })
    }) as BucketData

    return participants.map((p, idx) => (
        {
            title: p.email,
            id: p.uuid,
            table: tableName,
            column: columnName,
            chartType: (field.field_type === "categorical" ? "categorical" : "numerical") as ("categorical" | "numerical"),
            params: { ...params, uuid: p.uuid },
            timestamp: data[idx].map(d => new Date(d.bucket).getTime()),
            value: data[idx].map(d => ({ avg_value: d.avg_value, min_value: d.min_value, max_value: d.max_value }))
        }
    ))
}

export async function getIntraPersonData(fields: CampaignTableFieldWithTable[], params: ChartParams, bucketSize: string) {
    const { date, fieldId, uuid } = params;

    const field = fields.find(v => v.id === fieldId)
    if (!field) throw new Error('Field not found');

    const tableName = field.tableName
    const columnName = field.name

    const dates = Array.from({ length: 7 }, (_, i) => new Date(date.getTime() - i * 24 * 60 * 60 * 1000))

    const data = await mapQuery(dates, d => {
        return supabase.rpc('bucket_numerical_data', {
            start_time: d.toISOString(),
            end_time: new Date(d.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            uuid: uuid,
            table_name: tableName,
            column_name: columnName,
            bucket_unit: bucketSize,
        })

        // return supabase
        //     .from(tableName)
        //     .select(`${columnName}, timestamp`)
        //     .eq('uuid', uuid)
        //     .gte('timestamp', d.toISOString().split('T')[0])
        //     .lt('timestamp', new Date(d.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    }) as BucketData

    return dates.map((d, idx) => ({
        title: d.toISOString().split('T')[0],
        id: d.toISOString().split('T')[0],
        table: tableName,
        column: columnName,
        chartType: (field.field_type === "categorical" ? "categorical" : "numerical") as ("categorical" | "numerical"),
        params: { ...params, date: d },
        timestamp: data[idx].map(v => new Date(v.bucket).getTime()),
        value: data[idx].map(v => ({ avg_value: v.avg_value, min_value: v.min_value, max_value: v.max_value }))
    }))
}
