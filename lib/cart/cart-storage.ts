import type { CartItem } from "@/lib/cart/cart-context"

const STORAGE_KEY = "quickbuy:cart"

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export { loadCart, saveCart }
