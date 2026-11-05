// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "./schema";
import { missingSupabaseConfig, supabaseServiceKey, supabaseUrl } from "./supabaseConfig";

// Next still runs nested server layouts when the root layout shows the setup message, so
// without this they would send requests to the stand-in URL. This returns an error response
// rather than throwing, because the client retries network errors for several seconds.
const failWithoutConfig: typeof fetch = async () =>
  Response.json(
    { message: `Supabase is not configured. Set these in .env: ${missingSupabaseConfig.join(", ")}` },
    { status: 500 },
  );

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  missingSupabaseConfig.length > 0 ? { global: { fetch: failWithoutConfig } } : undefined,
);
