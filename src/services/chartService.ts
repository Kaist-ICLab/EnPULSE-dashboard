import { DynamicDataColumn } from '@/hooks/chart/useUserDailyStat';
import { supabase } from '@/lib/supabase';
import { BucketCategoricalData, BucketNumericalData, groupByTimestamp, groupByTimestampAndBitmask, mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTable } from '@/types/campaign';
import { ChartType, TimelineData } from '@/types/chart';
import dayjs from 'dayjs';
import { DeepRequired } from '@/utils/type';

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

export async function getSensorComparisonData(
    date: Date,
    participant: CampaignParticipant | undefined,
    tables: DeepRequired<CampaignTable>[],
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participant == undefined || tables.length == 0) return [];

    const timeGap = timeRange.end - timeRange.start;
    const uuid = participant.uuid;

    const fields = tables.flatMap(table => table.campaign_table_field).map(field => ({
        ...field,
        table_name: tables.find(t => t.id === field.campaign_table_id)?.name ?? ''
    })).filter(field => field.table_name !== '')

    const data = await mapQuery(fields, field => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: uuid,
            table_name: field.table_name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    return fields.map((field, idx) => {
        if (field.field_type == "categorical" || field.field_type == "text") {
            // Group data by timestamp
            const rawCategoricalData = data[idx] as (BucketCategoricalData[] | null);
            const groupedData = groupByTimestamp(rawCategoricalData);

            return {
                title: `${field.table_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: groupedData ?? []
            }

        } else if (field.field_type === "bitmask") {
            const rawCategoricalData = data[idx] as (BucketCategoricalData[] | null);
            const groupedData = groupByTimestampAndBitmask(rawCategoricalData);
            return {
                title: `${field.table_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: 'heatmap' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: groupedData ?? []
            };
        } else {
            const numericalData = data[idx] as BucketNumericalData[]
            return {
                title: `${field.table_name} - ${field.name}`,
                id: `${field.id}`,
                chartType: 'numerical' as ChartType,
                params: { date, uuid, fieldId: field.id },
                value: numericalData ? numericalData.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) : []
            }
        }
    })
}

export async function getPersonComparisonData(
    date: Date, participants: CampaignParticipant[],
    table: DeepRequired<CampaignTable> | undefined,
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participants.length == 0 || table == undefined) return [];

    const timeGap = timeRange.end - timeRange.start;

    const field = table.campaign_table_field[0]

    const data = await mapQuery(participants, p => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(date).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(date).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid: p.uuid,
            table_name: table.name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    if (field.field_type == "categorical" || field.field_type == "text") {
        const rawCategoricalData = data as (BucketCategoricalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: p.email,
                id: p.uuid,
                chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
                params: { date, uuid: p.uuid, fieldId: field.id },
                value: groupByTimestamp(rawCategoricalData[idx])
            }
        ))
    } else if (field.field_type === "bitmask") {
        const rawCategoricalData = data as (BucketCategoricalData[] | null)[];
        return participants.map((p, idx) => ({
            title: p.email,
            id: p.uuid,
            chartType: 'heatmap' as ChartType,
            params: { date, uuid: p.uuid, fieldId: field.id },
            value: groupByTimestampAndBitmask(rawCategoricalData[idx])
        }));
    } else {
        const numericalData = data as (BucketNumericalData[] | null)[]
        return participants.map((p, idx) => (
            {
                title: p.email,
                id: p.uuid,
                chartType: "numerical" as ChartType,
                params: { date, uuid: p.uuid, fieldId: field.id },
                value: numericalData[idx]?.map(d => ({ timestamp: new Date(d.bucket).getTime(), avg: d.avg, min: d.min, max: d.max })) ?? []
            }
        ))
    }
}

export async function getDaysComparisonData(
    date: Date, participant: CampaignParticipant | undefined,
    table: DeepRequired<CampaignTable> | undefined,
    timeRange: { start: number, end: number },
    bucketSize: string,
): Promise<TimelineData[]> {
    if (participant == undefined || table == undefined) return [];
    const timeGap = timeRange.end - timeRange.start;
    const field = table.campaign_table_field[0]
    const uuid = participant.uuid;

    const dates = Array.from({ length: 7 }, (_, i) => dayjs(date).subtract(i, 'day').toDate())

    const data = await mapQuery(dates, d => {
        const useCategoricalRpc = field.field_type === "categorical" || field.field_type === "text" || field.field_type === "bitmask";
        return supabase.rpc(useCategoricalRpc ? 'bucket_categorical_data' : 'bucket_numerical_data', {
            start_time: dayjs(d).add(timeRange.start, 'ms').subtract(timeGap, 'ms').format(DATE_FORMAT),
            end_time: dayjs(d).add(timeRange.end, 'ms').add(timeGap, 'ms').format(DATE_FORMAT),
            uuid,
            table_name: table.name,
            column_name: field.name,
            bucket_unit: bucketSize,
        })
    }) as (BucketNumericalData[] | BucketCategoricalData[] | null)[]

    if (field.field_type == "categorical" || field.field_type == "text") {
        const categoricalData = data as (BucketCategoricalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: field.field_type == "categorical" ? 'categorical' as ChartType : 'barcode' as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: groupByTimestamp(categoricalData[idx] ?? [])
        }
        ))
    } else if (field.field_type === "bitmask") {
        const categoricalData = data as (BucketCategoricalData[] | null)[];
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: 'heatmap' as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: groupByTimestampAndBitmask(categoricalData[idx] ?? [])
        }));
    } else {
        const numericalData = data as (BucketNumericalData[] | null)[]
        return dates.map((d, idx) => ({
            title: dayjs(d).format('YYYY-MM-DD'),
            id: dayjs(d).format('YYYY-MM-DD'),
            chartType: "numerical" as ChartType,
            params: { date: d, uuid, fieldId: field.id },
            value: numericalData[idx]?.map(v => ({ timestamp: new Date(v.bucket).getTime(), avg: v.avg, min: v.min, max: v.max })) ?? []
        }))
    }
}
