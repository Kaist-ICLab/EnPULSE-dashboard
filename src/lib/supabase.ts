// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './schema'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)


