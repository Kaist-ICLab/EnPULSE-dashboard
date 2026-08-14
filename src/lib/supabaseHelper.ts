import { supabase } from "./supabase";
import { Err, Ok } from "@/utils/type";

export type BucketNumericalData = { bucket: string, avg: number, min: number, max: number }
export type BucketCategoricalData = { bucket: string, category: string, count: number }

type SupabaseQuery = ReturnType<typeof supabase.rpc> | ReturnType<typeof supabase.from>

export async function mapQuery<P>(data: P[], query: (param: P) => SupabaseQuery, isCount = false) {
    const promises = data.map(query)

    const results = (await Promise.allSettled(promises)).map(result => {
        if (result.status === 'fulfilled') return Ok(isCount ? result.value.count : result.value.data);
        return Err(result.reason.message);
    })

    return results
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