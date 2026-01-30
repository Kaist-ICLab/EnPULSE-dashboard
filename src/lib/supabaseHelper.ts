import { PostgrestTransformBuilder } from "@supabase/postgrest-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

export type BucketNumericalData = { bucket: string, avg: number, min: number, max: number }
export type BucketCategoricalData = { bucket: string, category: string, count: number }

export async function mapQuery<T, V extends Record<string, unknown>, S extends GenericSchema, R>(data: T[], query: (param: T) => PostgrestTransformBuilder<S, V, R>, isCount = false) {
    const promises = data.map(query)

    const results = await Promise.allSettled(promises)
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    if (errors.length > 0) {
        console.error(errors);
        throw new Error(errors.join(', '));
    }

    return results
        .filter(result => result.status === 'fulfilled')
        .map(result => isCount ? result.value.count : result.value.data);
}

export function groupByTimestamp(data: BucketCategoricalData[] | null) {
    if (!data) return [];
    // Group data into { timestamp, value: [{category, count}, ...] }
    const grouped: Record<number, { [category: string]: number }> = {};

    data.forEach(item => {
        const timestamp = new Date(item.bucket).getTime();
        if (!grouped[timestamp]) {
            grouped[timestamp] = {};
        }
        grouped[timestamp][item.category] = item.count;
    });

    const groupedData = Object.entries(grouped).map(([timestampStr, categories]) => ({
        timestamp: Number(timestampStr),
        value: Object.entries(categories).map(([category, count]) => ({
            category: category,
            count,
            aggregated: 0
        }))
    }));

    groupedData.forEach(d => {
        let aggregated = 0;
        d.value.forEach(v => {
            aggregated += v.count;
            v.aggregated = aggregated;
        });
    });

    return groupedData;
}

// Bitmask data is grouped by timestamp and bit index
export function groupByTimestampAndBitmask(data: BucketCategoricalData[] | null) {
    if (!data) return [];
    // Group data into { timestamp, value: [{bit index, count}, ...] }

    const bitmaskGrouped: Record<number, { [bitIndex: string]: number }> = {};

    const groupedData = groupByTimestamp(data);
    groupedData.forEach(d => {
        d.value.forEach(v => {
            if (!bitmaskGrouped[d.timestamp]) {
                bitmaskGrouped[d.timestamp] = {};
            }

            const numberValue = parseInt(v.category, 10).toString(2).split("").reverse().join("");
            for (let i = 0; i < numberValue.length; i++) {
                if (!bitmaskGrouped[d.timestamp][i]) {
                    bitmaskGrouped[d.timestamp][i] = 0;
                }
                bitmaskGrouped[d.timestamp][i] += numberValue[i] === '1' ? v.count : 0;
            }
        });
    })

    return Object.entries(bitmaskGrouped).map(([timestamp, bitIndexCounts]) => ({
        timestamp: Number(timestamp),
        value: Object.entries(bitIndexCounts).map(([bitIndex, count]) => ({
            bitIndex: Number(bitIndex),
            count: count,
            aggregated: 0
        }))
    }));
}