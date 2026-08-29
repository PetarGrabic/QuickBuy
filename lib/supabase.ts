import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
  )
}

// Single isomorphic client for the public, read-only product catalogue.
// No auth / cookies, so a plain @supabase/supabase-js client is the right fit
// (switch to @supabase/ssr only if user sessions are added later).
//
// The fetch wrapper opts every request into Next's Data Cache with an hourly
// revalidate, matching the previous DummyJSON behaviour. The `next` option is a
// harmless no-op in the browser (used by the search autocomplete).
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) =>
      fetch(input, { ...init, next: { revalidate: 3600 } }),
  },
})
