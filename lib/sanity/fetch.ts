import type { QueryParams } from "next-sanity"

import { client } from "./client"

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  /** Cache tags the /api/revalidate webhook can bust. One per singleton _type. */
  tags?: string[]
  /** Escape hatch for time-based revalidation. Unused by v1 call sites. */
  revalidate?: number | false
}

/**
 * Fetch published content from Sanity.
 *
 * With `tags`, the result is cached indefinitely and only refreshed when the
 * Sanity webhook hits /api/revalidate and busts a matching tag — no staleness
 * window. Never throws: a network/API failure resolves to `null` so callers
 * fall back to their hardcoded defaults (same degrade-gracefully approach as
 * lib/auth/query.ts).
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = false,
}: SanityFetchOptions): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: tags.length ? false : revalidate,
        tags,
      },
    })
  } catch (error) {
    console.error("[sanityFetch] request failed", { tags, error })
    return null
  }
}
