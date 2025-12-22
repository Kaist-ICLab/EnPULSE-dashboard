// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './schema'

const supabaseUrl = 'http://143.248.53.125:8000' // 또는 supabase 프로젝트 URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYyODczMjAwLCJleHAiOjE5MjA2Mzk2MDB9.D-Hqc9yhQJo6NHkBSllMzu-P435ay6-L_JYhEfO58TQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)


