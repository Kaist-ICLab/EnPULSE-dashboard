import { DynamicDataColumn } from '@/hooks/charts/useUserDailyStat';
import { supabase } from '@/lib/supabase';
import { mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTableFieldWithTable } from '@/types/campaign';
import { ChartParams } from '@/types/chart';
// import { mapQuery } from '@/lib/supabaseHelper';

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

export async function getTimelineOverviewData(fields: CampaignTableFieldWithTable[], params: ChartParams) {
    const { uuid, date } = params;
    const data = await mapQuery(fields, v => {
        return supabase
            .from(v.tableName)
            .select(`${v.name}, timestamp`)
            .eq('uuid', uuid)
            .gte('timestamp', date.toISOString().split('T')[0])
            .lt('timestamp', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    }) as unknown as { timestamp: string, [key: string]: any }[][]

    const timestamp = data[0]?.map(v => new Date(v.timestamp).getTime())

    return fields.map((v, idx) => (
        {
            title: v.displayName,
            id: `${v.id}`,
            table: v.tableName,
            column: v.name,
            chartType: (v.field_type === "categorical" ? "categorical" : "numerical") as ("categorical" | "numerical"),
            params,
            timestamp,
            value: data[idx].map(d => d[v.name])
        }
    ))
}

export async function getInterPersonData(fields: CampaignTableFieldWithTable[], participants: CampaignParticipant[], params: ChartParams) {
    const { date, fieldId } = params;

    const field = fields.find(v => v.id === fieldId)
    if (!field) throw new Error('Field not found');

    const tableName = field.tableName
    const columnName = field.name

    const data = await mapQuery(participants, p => {
        return supabase
            .from(tableName)
            .select(`${columnName}, timestamp`)
            .eq('uuid', p.uuid)
            .gte('timestamp', date.toISOString().split('T')[0])
            .lt('timestamp', new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    }) as unknown as { timestamp: string, [key: string]: any }[][]

    return participants.map((p, idx) => (
        {
            title: p.email,
            id: p.uuid,
            table: tableName,
            column: columnName,
            chartType: (field.field_type === "categorical" ? "categorical" : "numerical") as ("categorical" | "numerical"),
            params,
            timestamp: data[idx].map(d => new Date(d.timestamp).getTime()),
            value: data[idx].map(d => d[columnName])
        }
    ))
}

