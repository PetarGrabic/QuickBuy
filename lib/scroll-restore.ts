// Preserve the scroll position across a redirect round-trip (e.g. a guest is
// bounced to /login and then sent back to the page they came from). The origin
// calls `rememberReturnScroll()` right before navigating away; <ScrollRestorer>
// (mounted globally) restores it once the same URL is reached again.

const KEY = "quickbuy:return-scroll"
const MAX_AGE_MS = 10 * 60_000

interface SavedScroll {
  path: string
  y: number
  ts: number
}

function rememberReturnScroll() {
  try {
    const path = window.location.pathname + window.location.search
    const saved: SavedScroll = { path, y: window.scrollY, ts: Date.now() }
    sessionStorage.setItem(KEY, JSON.stringify(saved))
  } catch {
    // sessionStorage unavailable — nothing we can do, not worth surfacing.
  }
}

/** Returns the saved Y for `currentPath` (once) and clears it, or null. */
function takeReturnScroll(currentPath: string): number | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as SavedScroll
    if (saved.path !== currentPath) return null
    sessionStorage.removeItem(KEY)
    if (Date.now() - saved.ts > MAX_AGE_MS) return null
    return typeof saved.y === "number" ? saved.y : null
  } catch {
    return null
  }
}

export { rememberReturnScroll, takeReturnScroll }
