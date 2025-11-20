// import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// if (!supabaseUrl || !supabaseServiceKey) {
//   throw new Error('Missing Supabase server environment variables')
// }

// export const supabaseServer = createSupabaseClient(supabaseUrl, supabaseServiceKey)

// export function createClient() {
//   return createSupabaseClient(supabaseUrl, supabaseServiceKey)
// }

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
