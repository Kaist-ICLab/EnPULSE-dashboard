import { supabase } from "@/lib/supabase";
import { Err, Ok, Result } from "@/utils/type";

export const WEBAPP_ICON_BUCKET = "campaign-webapp-icons";

/**
 * Uploads a web app icon to the public `campaign-webapp-icons` bucket and
 * returns its storage path (the bucket-relative object key, e.g.
 * `<uuid>-<filename>`) - not a full URL. The filename is UUID-prefixed and
 * independent of any campaign/webapp id, since those may still be
 * unassigned sentinel ids (-1) at upload time (e.g. while filling out the
 * `/create` wizard). Storing the path rather than a full URL lets any
 * client - this dashboard or the Android app, if it also uses supabase-kt -
 * derive the public URL directly from `bucket + path` via the Storage
 * client instead of parsing a URL string.
 */
export async function uploadWebappIcon(file: File): Promise<Result<string>> {
  const path = `${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from(WEBAPP_ICON_BUCKET).upload(path, file, { upsert: true });

  if (error) return Err(error.message);
  return Ok(path);
}

/** Builds the public URL for a previously uploaded web app icon path. */
export function getWebappIconUrl(iconPath: string): string {
  return supabase.storage.from(WEBAPP_ICON_BUCKET).getPublicUrl(iconPath).data.publicUrl;
}

/**
 * Best-effort deletion of a previously uploaded web app icon by its storage
 * path. Failures are swallowed - a leftover file in the bucket is harmless
 * and shouldn't block whatever the caller is doing.
 */
export async function deleteWebappIcon(iconPath: string): Promise<void> {
  if (!iconPath) return;

  try {
    await supabase.storage.from(WEBAPP_ICON_BUCKET).remove([iconPath]);
  } catch {
    // best-effort - ignore
  }
}
