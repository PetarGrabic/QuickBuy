import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"

// Sanity webhook target. Configure in sanity.io/manage with:
//   Filter:     _type in ["siteSettings","homePage","helpCenter","footer"]
//   Projection: { "tags": [_type] }
//   Secret:     SANITY_REVALIDATE_SECRET
type WebhookPayload = { tags?: string[] }

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Wait out Content Lake eventual consistency so the refetch sees new data.
      true
    )

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 })
    }

    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return new Response("Missing tags", { status: 400 })
    }

    for (const tag of body.tags) {
      // expire: 0 → next request refetches immediately (editor sees their edit now).
      revalidateTag(tag, { expire: 0 })
    }

    return NextResponse.json({ revalidated: true, tags: body.tags, now: Date.now() })
  } catch (err) {
    console.error("[/api/revalidate]", err)
    return new Response((err as Error).message, { status: 500 })
  }
}
