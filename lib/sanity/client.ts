import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId } from "@/sanity/env"

// Read-only client for published editorial content. The `production` dataset is
// public, so no token is needed. Mirrors the single-client approach in
// lib/supabase.ts.
//
// useCdn: false — every fetch goes to the origin API so a cache miss always sees
// the freshly published content. Misses are rare: lib/sanity/fetch.ts caches
// results indefinitely and they're only re-fetched after the /api/revalidate
// webhook busts a tag, which is exactly when freshness matters (the editor is
// checking their edit). The apicdn would otherwise lag a publish by seconds.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
})
