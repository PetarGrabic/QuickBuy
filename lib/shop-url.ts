type ShopParams = Record<string, string | undefined>

function buildShopHref(current: ShopParams, overrides: ShopParams): string {
  const merged: ShopParams = { ...current, ...overrides }

  if (!("page" in overrides)) {
    merged.page = undefined
  }

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(merged)) {
    if (value) search.set(key, value)
  }

  const query = search.toString()
  return query ? `/shop?${query}` : "/shop"
}

export { buildShopHref }
export type { ShopParams }
