import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Subsidy = {
  id: string
  title: string
  target_area: string | null
  subsidy_max_limit: number | null
  acceptance_start: string | null
  acceptance_end: string | null
  target_employees: string | null
  purpose: string | null
  detail_url: string | null
  raw_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}
