const STORAGE_KEY = "quickbuy:recent-searches"
const MAX_RECENT_SEARCHES = 8

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : []
  } catch {
    return []
  }
}

function saveRecentSearches(searches: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.)
  }
}

function clearRecentSearches() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}

// Pure: given a list (newest-first) and a new query, return the next list —
// trimmed, case-insensitively de-duplicated, moved to the front, capped.
function nextRecentSearches(list: string[], query: string): string[] {
  const trimmed = query.trim()
  if (!trimmed) return list
  const rest = list.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())
  return [trimmed, ...rest].slice(0, MAX_RECENT_SEARCHES)
}

function addRecentSearch(query: string): string[] {
  const next = nextRecentSearches(getRecentSearches(), query)
  saveRecentSearches(next)
  return next
}

function removeRecentSearch(query: string): string[] {
  const next = getRecentSearches().filter((q) => q !== query)
  saveRecentSearches(next)
  return next
}

export {
  getRecentSearches,
  saveRecentSearches,
  clearRecentSearches,
  nextRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  MAX_RECENT_SEARCHES,
}
