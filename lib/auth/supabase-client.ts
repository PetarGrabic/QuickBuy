import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
  )
}

// Auth + per-user data client (cart, recent searches, recent products).
// Separate from `lib/supabase.ts` (the read-only catalogue client, which has
// `persistSession: false` and a cache wrapper). This one keeps the user's
// session in localStorage and auto-refreshes it — it runs in the browser.
export const supabaseAuth = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
