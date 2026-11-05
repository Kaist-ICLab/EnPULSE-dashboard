// NEXT_PUBLIC_ values are fixed at build time, and each must be read by its full name.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? "";

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

// .example.env placeholders start with YOUR_.
const isFilledIn = (value: string) => value.trim() !== "" && !value.startsWith("YOUR_");

/** Names of the required settings that are missing or still placeholders. */
export const missingSupabaseConfig: string[] = [
  ...(isHttpUrl(url) ? [] : ["NEXT_PUBLIC_SUPABASE_URL"]),
  ...(isFilledIn(serviceRoleKey) ? [] : ["NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY"]),
];

// createClient throws on an invalid URL, which would stop the build and the setup message.
// These stand-ins are never contacted: lib/supabase.ts fails requests until the config is set.
export const supabaseUrl = isHttpUrl(url) ? url : "https://placeholder-url.supabase.co";
export const supabaseServiceKey = serviceRoleKey || "placeholder-key";
