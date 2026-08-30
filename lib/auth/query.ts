import { supabaseAuth } from "@/lib/auth/supabase-client"

// On a gateway 401 (stale/expired access token used before autoRefreshToken swaps
// in a fresh one) supabase-js can surface a near-empty error object — which is why
// the old `console.error("...", error)` calls logged a bare `{}`.
function looksLikeAuthError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const e = error as { status?: number; code?: string; message?: string }
  if (e.status === 401) return true
  if (e.code === "PGRST301" || e.code === "401") return true
  if (e.message && /jwt|token|expired|refresh/i.test(e.message)) return true
  // empty `{}` — no useful fields at all
  return !e.code && !e.message && !e.status
}

function describe(error: unknown): string {
  if (!error) return "unknown error"
  if (typeof error === "string") return error
  const e = error as { message?: string; code?: string }
  return [e.message, e.code].filter(Boolean).join(" ") || JSON.stringify(error)
}

/**
 * Runs a PostgREST query builder. If it fails with an auth-shaped error, refreshes
 * the session once and retries. On final failure it logs a descriptive line (never
 * a bare `{}`) and returns the settled result so callers can degrade gracefully.
 */
export async function runAuthedQuery<T extends { error: unknown }>(
  run: () => PromiseLike<T>,
  label: string
): Promise<T> {
  let res = await run()
  if (res.error && looksLikeAuthError(res.error)) {
    await supabaseAuth.auth.refreshSession()
    res = await run()
  }
  if (res.error) {
    console.warn(`${label}: ${describe(res.error)}`)
  }
  return res
}
