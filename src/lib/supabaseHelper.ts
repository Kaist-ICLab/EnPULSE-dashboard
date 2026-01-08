import { PostgrestTransformBuilder } from "@supabase/postgrest-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

export type BucketNumericalData = { bucket: string, avg: number, min: number, max: number }
export type BucketCategoricalData = { bucket: string, category: number, count: number }

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

export function groupByTimestamp(data: BucketCategoricalData[]) {
    // Group data into { timestamp, value: [{category, count}, ...] }
    const grouped: Record<number, { [category: number]: number }> = {};

    data.forEach(item => {
        const timestamp = new Date(item.bucket).getTime();
        if (!grouped[timestamp]) {
            grouped[timestamp] = {};
        }
        grouped[timestamp][item.category] = item.count;
    });

    return Object.entries(grouped).map(([timestampStr, categories]) => ({
        timestamp: Number(timestampStr),
        value: Object.entries(categories).map(([category, count]) => ({
            category: Number(category),
            count
        }))
    }));
}