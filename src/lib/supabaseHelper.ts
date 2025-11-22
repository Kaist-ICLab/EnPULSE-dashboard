import { PostgrestTransformBuilder } from "@supabase/postgrest-js";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

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