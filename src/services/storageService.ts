import { supabase } from '@/lib/supabase';
import { Err, Ok, Result } from '@/utils/type';

const WEBAPP_ICON_BUCKET = 'campaign-webapp-icons';

/**
 * Uploads a web app icon to the public `campaign-webapp-icons` bucket and
 * returns its public URL. The filename is UUID-prefixed and independent of
 * any campaign/webapp id, since those may still be unassigned sentinel ids
 * (-1) at upload time (e.g. while filling out the `/create` wizard).
 */
export async function uploadWebappIcon(file: File): Promise<Result<string>> {
    const path = `${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from(WEBAPP_ICON_BUCKET)
        .upload(path, file, { upsert: true });

    if (uploadError) return Err(uploadError.message);

    const { data } = supabase.storage.from(WEBAPP_ICON_BUCKET).getPublicUrl(path);
    return Ok(data.publicUrl);
}

/**
 * Best-effort deletion of a previously uploaded web app icon, looked up by
 * its public URL. Failures are swallowed - a leftover file in the bucket is
 * harmless and shouldn't block whatever the caller is doing.
 */
export async function deleteWebappIcon(iconUrl: string): Promise<void> {
    const marker = `/object/public/${WEBAPP_ICON_BUCKET}/`;
    const markerIndex = iconUrl.indexOf(marker);
    if (markerIndex === -1) return;

    const path = iconUrl.slice(markerIndex + marker.length);
    if (!path) return;

    try {
        await supabase.storage.from(WEBAPP_ICON_BUCKET).remove([path]);
    } catch {
        // best-effort - ignore
    }
}
