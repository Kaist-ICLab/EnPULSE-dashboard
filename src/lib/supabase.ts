// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "./schema";

// Placeholder is needed for build purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
