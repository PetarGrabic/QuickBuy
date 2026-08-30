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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage unavailable
  }
}

function clearCart() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}

export { loadCart, saveCart, clearCart }
