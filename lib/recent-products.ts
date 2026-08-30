const STORAGE_KEY = "quickbuy:recent-products"
const MAX_RECENT_PRODUCTS = 10

interface RecentProduct {
  id: number
  title: string
  thumbnail: string
}

function isRecentProduct(value: unknown): value is RecentProduct {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as RecentProduct).id === "number" &&
    typeof (value as RecentProduct).title === "string" &&
    typeof (value as RecentProduct).thumbnail === "string"
  )
}

function getRecentProducts(): RecentProduct[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isRecentProduct) : []
  } catch {
    return []
  }
}

function saveRecentProducts(products: RecentProduct[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
  }
}

function clearRecentProducts() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}

// Pure: given a list (newest-first) and a product, return the next list —
// de-duplicated by id, moved to the front, capped.
function nextRecentProducts(
  list: RecentProduct[],
  product: RecentProduct
): RecentProduct[] {
  const rest = list.filter((p) => p.id !== product.id)
  return [product, ...rest].slice(0, MAX_RECENT_PRODUCTS)
}

function addRecentProduct(product: RecentProduct): RecentProduct[] {
  const next = nextRecentProducts(getRecentProducts(), product)
  saveRecentProducts(next)
  return next
}

function removeRecentProduct(id: number): RecentProduct[] {
  const next = getRecentProducts().filter((p) => p.id !== id)
  saveRecentProducts(next)
  return next
}

export {
  getRecentProducts,
  saveRecentProducts,
  clearRecentProducts,
  nextRecentProducts,
  addRecentProduct,
  removeRecentProduct,
  MAX_RECENT_PRODUCTS,
}
export type { RecentProduct }
