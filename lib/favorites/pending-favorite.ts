// A guest who presses the heart and then goes to log in has their intended
// product remembered here; `FavoritesProvider` applies it right after the
// session resolves so the product is already favorited on return.

const KEY = "quickbuy:pending-favorite"
const MAX_AGE_MS = 10 * 60_000

function rememberPendingFavorite(productId: number) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ id: productId, ts: Date.now() }))
  } catch {
    // sessionStorage unavailable — favoriting just won't auto-apply.
  }
}

/** Returns the pending product id (once) and clears it, or null. */
function takePendingFavorite(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    sessionStorage.removeItem(KEY)
    const { id, ts } = JSON.parse(raw) as { id: number; ts: number }
    if (Date.now() - ts > MAX_AGE_MS) return null
    return typeof id === "number" ? id : null
  } catch {
    return null
  }
}

export { rememberPendingFavorite, takePendingFavorite }
