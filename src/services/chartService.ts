import { supabase } from '@/lib/supabase';
import { BucketCategoricalData, BucketNumericalData, groupByTimestamp, groupByTimestampAndBitmask, mapQuery } from '@/lib/supabaseHelper';
import { CampaignParticipant, CampaignTable } from '@/types/campaign';
import { ChartType, TimelineData } from '@/types/chart';
import dayjs from 'dayjs';
import { DeepRequired } from '@/utils/type';
import { DATE_FORMAT } from '@/utils/date';
import { UserDailyStatData } from '@/types/dashboard';

export async function getCampaignDailySummary(uuids: string[], date: Date) {
    const { data: contactData, error: contactError } = await supabase
        .from('profiles')
        .select('messages(count)')
        .in('uuid', uuids)
        .order('uuid', { ascending: true })

    if (contactError) throw new Error(contactError.message);

    const { data, error } = await supabase
        .from(`campaign_table_row_count`)
        .select('*')
        .in('uuid', uuids)
        .eq('day', dayjs(date).format('YYYY-MM-DD'))
        .order('uuid', { ascending: true })
        .order('table_id', { ascending: true })
        .order('time_slot', { ascending: true })

    if (error) throw new Error(error.message);

    if (data.length == 0) return []

    // Aggregate data per profile, with contacts, tables, and time_slots
    const result: UserDailyStatData[] = uuids.map((uuid, idx) => ({
        uuid: uuid,
        contacts: contactData[idx].messages[0].count,
        tables: []
    }));

    for (const v of data) {
        // Table aggregation
        const tables = result.find(r => r.uuid === v.uuid)!.tables;
        if (!tables.find(t => t.table_id === v.table_id)) {
            tables.push({
                table_id: v.table_id,
                totalCount: 0,
                counts: []
            });
        }

        const table = tables.find(t => t.table_id === v.table_id)!;
        // Time slot aggregation
        table.totalCount += v.count;
        table.counts.push(v.count);
    }

    return result;
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
