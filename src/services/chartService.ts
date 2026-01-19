import { DynamicDataColumn } from '@/hooks/charts/useUserDailyStat';
import { supabase } from '@/lib/supabase';
import { mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTableFieldWithTable } from '@/types/campaign';
import { TimelineParams, ChartType } from '@/types/chart';
import { BucketCategoricalData, BucketNumericalData, groupByTimestamp } from '@/lib/supabaseHelper';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

export async function getCampaignDailySummary(campaignId: number, date: Date, page: number, pageCount: number) {
    const from = (page - 1) * pageCount;
    const to = from + pageCount - 1;

    const { data, error } = await supabase
        .from(`profiles`)
        .select(`uuid, email, campaign_table_user_daily_summary(*), messages(count)`)
        .eq('campaign_id', campaignId)
        .filter('campaign_table_user_daily_summary.day', 'eq', dayjs(date).format('YYYY-MM-DD'))
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

export async function getTimelineOverviewData(fields: CampaignTableFieldWithTable[], params: TimelineParams, timeRange: { start: number, end: number }, bucketSize: string) {
    const { uuid, date } = params;
    const timeGap = timeRange.end - timeRange.start;

    const data = await mapQuery(fields, v => {
        return supabase.rpc(v.field_type == "categorical" ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: uuid,
            table_name: v.tableName,
            column_name: v.name,
            bucket_unit: bucketSize,
        })
    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    return fields.map((v, idx) => {
        if (v.field_type == "categorical") {
            // Group data by timestamp
            const rawCategoricalData = data[idx] as (BucketCategoricalData[] | null);
            const groupedData = groupByTimestamp(rawCategoricalData);

            return {
                title: v.displayName,
                id: `${v.id}`,
                table: v.tableName,
                column: v.name,
                chartType: 'categorical' as ChartType,
                params: { ...params, fieldId: v.id },
                value: groupedData ?? []
            }

        } else {
            const numericalData = data[idx] as BucketNumericalData[]
            return {
                title: v.displayName,
                id: `${v.id}`,
                table: v.tableName,
                column: v.name,
                chartType: 'numerical' as ChartType,
                params: { ...params, fieldId: v.id },
                value: numericalData ? numericalData.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) : []
            }
        }
    })
}

export async function getInterPersonData(fields: CampaignTableFieldWithTable[], participants: CampaignParticipant[], params: TimelineParams, timeRange: { start: number, end: number }, bucketSize: string) {
    const { date, fieldId } = params;
    const timeGap = timeRange.end - timeRange.start;
    const field = fields.find(v => v.id === fieldId)
    if (!field) throw new Error('Field not found');

    const tableName = field.tableName
    const columnName = field.name

    const data = await mapQuery(participants, p => {
        return supabase.rpc(field.field_type == "categorical" ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: p.uuid,
            table_name: tableName,
            column_name: columnName,
            bucket_unit: bucketSize,
        })
    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    if (field.field_type == "categorical") {
        const rawCategoricalData = data as (BucketCategoricalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: p.email,
                id: p.uuid,
                table: tableName,
                column: columnName,
                chartType: "categorical" as ChartType,
                params: { ...params, uuid: p.uuid },
                value: groupByTimestamp(rawCategoricalData[idx])
            }
        ))
    } else {
        const numericalData = data as (BucketNumericalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: p.email,
                id: p.uuid,
                table: tableName,
                column: columnName,
                chartType: "numerical" as ChartType,
                params: { ...params, uuid: p.uuid },
                timestamp: numericalData[idx]?.map(d => new Date(d.bucket).getTime()) ?? [],
                value: numericalData[idx]?.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) ?? []
            }
        ))
    }
}

export async function getIntraPersonData(fields: CampaignTableFieldWithTable[], params: TimelineParams, timeRange: { start: number, end: number }, bucketSize: string) {
    const { date, fieldId, uuid } = params;
    const timeGap = timeRange.end - timeRange.start;
    const field = fields.find(v => v.id === fieldId)
    if (!field) throw new Error('Field not found');

    const tableName = field.tableName
    const columnName = field.name

    const dates = Array.from({ length: 7 }, (_, i) => new Date(date.getTime() - i * 24 * 60 * 60 * 1000))

    const data = await mapQuery(dates, d => {
        return supabase.rpc(field.field_type == "categorical" ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(d).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(d).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: uuid,
            table_name: tableName,
            column_name: columnName,
            bucket_unit: bucketSize,
        })

    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    if (field.field_type == "categorical") {
        const categoricalData = data as (BucketCategoricalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            table: tableName,
            column: columnName,
            chartType: "categorical" as ChartType,
            params: { ...params, date: d },
            value: groupByTimestamp(categoricalData[idx] ?? [])
        }
        ))
    } else {
        const numericalData = data as (BucketNumericalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            table: tableName,
            column: columnName,
            chartType: "numerical" as ChartType,
            params: { ...params, date: d },
            value: numericalData[idx]?.map(v => ({ timestamp: new Date(v.bucket).getTime(), avg: v.avg, min: v.min, max: v.max })) ?? []
        }))
    }
}
