"use client"

import * as React from "react"

import { getDiscountedPrice } from "@/lib/discounts"
import { loadCart, saveCart, clearCart } from "@/lib/cart/cart-storage"
import { useAuth } from "@/lib/auth/auth-context"
import { supabaseAuth } from "@/lib/auth/supabase-client"
import { runAuthedQuery } from "@/lib/auth/query"
import { toast } from "@/components/ui/toast"

interface CartItem {
  id: number
  title: string
  thumbnail: string
  price: number
  discountPercentage: number
  stock: number
  quantity: number
}

interface LastAdded extends Omit<CartItem, "quantity"> {
  quantityAdded: number
  nonce: number
}

interface CartState {
  items: CartItem[]
  hydrated: boolean
  lastAdded: LastAdded | null
}

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "SET_QUANTITY"; id: number; quantity: number }
  | { type: "RESTORE_ITEM"; item: CartItem; index: number }
  | { type: "HYDRATE"; items: CartItem[] }

function maxQuantityFor(stock: number) {
  return Math.min(stock, 10)
}

// Always yields a DB-valid quantity (1..10, and never above stock).
function clampCartQty(qty: number, stock: number): number {
  const cap = Math.min(Math.max(maxQuantityFor(stock), 1), 10)
  return Math.min(cap, Math.max(1, Math.round(qty)))
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const cap = maxQuantityFor(action.item.stock)
      const existing = state.items.find((i) => i.id === action.item.id)
      const lastAdded: LastAdded = {
        ...action.item,
        quantityAdded: action.quantity,
        nonce: Date.now(),
      }
      if (existing) {
        return {
          ...state,
          lastAdded,
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(cap, i.quantity + action.quantity) }
              : i
          ),
        }
      }
      return {
        ...state,
        lastAdded,
        items: [
          ...state.items,
          { ...action.item, quantity: Math.min(cap, action.quantity) },
        ],
      }
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case "SET_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? {
                ...i,
                quantity: Math.max(1, Math.min(maxQuantityFor(i.stock), action.quantity)),
              }
            : i
        ),
      }
    case "RESTORE_ITEM": {
      if (state.items.some((i) => i.id === action.item.id)) return state
      const items = [...state.items]
      const index = Math.min(action.index, items.length)
      items.splice(index, 0, action.item)
      return { ...state, items }
    }
    case "HYDRATE":
      return { ...state, items: action.items, hydrated: true }
    default:
      return state
  }
}

// --- Remote (Supabase) cart persistence for logged-in users -------------------

interface RemoteProduct {
  id: number
  title: string
  thumbnail: string
  price: number
  discount_percentage: number
  stock: number
}

let lastSyncErrorToast = 0
function notifyCartSyncError() {
  if (Date.now() - lastSyncErrorToast < 5000) return
  lastSyncErrorToast = Date.now()
  toast.add({
    title: "Couldn't sync your cart",
    description: "Your change is saved locally — we'll retry.",
    type: "error",
    timeout: 4000,
  })
}

async function fetchRemoteCart(userId: string): Promise<CartItem[]> {
  const { data, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("cart_items")
        .select(
          "product_id, quantity, products!inner(id, title, thumbnail, price, discount_percentage, stock)"
        )
        .eq("user_id", userId),
    "cart load"
  )
  if (error || !data) return []
  return data.map((row) => {
    const p = row.products as unknown as RemoteProduct
    return {
      id: row.product_id,
      title: p.title,
      thumbnail: p.thumbnail,
      price: p.price,
      discountPercentage: p.discount_percentage,
      stock: p.stock,
      quantity: clampCartQty(row.quantity, p.stock),
    }
  })
}

async function mergeIntoRemoteCart(
  userId: string,
  localItems: CartItem[]
): Promise<CartItem[]> {
  if (localItems.length === 0) return fetchRemoteCart(userId)

  const { data: remoteRows, error } = await runAuthedQuery(
    () =>
      supabaseAuth
        .from("cart_items")
        .select("product_id, quantity")
        .eq("user_id", userId),
    "cart merge (read)"
  )
  if (error) {
    return fetchRemoteCart(userId)
  }

  const totals = new Map<number, number>()
  for (const r of remoteRows ?? []) totals.set(r.product_id, r.quantity)
  for (const it of localItems) {
    totals.set(it.id, (totals.get(it.id) ?? 0) + it.quantity)
  }

  const ids = [...totals.keys()]
  const { data: prods } = await supabaseAuth
    .from("products")
    .select("id, title, thumbnail, price, discount_percentage, stock")
    .in("id", ids)

  const merged: CartItem[] = (prods ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    thumbnail: p.thumbnail,
    price: p.price,
    discountPercentage: p.discount_percentage,
    stock: p.stock,
    quantity: clampCartQty(totals.get(p.id) ?? 1, p.stock),
  }))

  if (merged.length > 0) {
    const { error: upErr } = await supabaseAuth.from("cart_items").upsert(
      merged.map((m) => ({
        user_id: userId,
        product_id: m.id,
        quantity: m.quantity,
      })),
      { onConflict: "user_id,product_id" }
    )
    if (upErr) console.error("cart merge (upsert)", upErr)
  }

  return merged
}

async function upsertRemoteItem(
  userId: string,
  productId: number,
  quantity: number
) {
  const { error } = await supabaseAuth
    .from("cart_items")
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: "user_id,product_id" }
    )
  if (error) {
    console.error("cart upsert", error)
    notifyCartSyncError()
  }
}

async function deleteRemoteItem(userId: string, productId: number) {
  const { error } = await supabaseAuth
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId)
  if (error) {
    console.error("cart delete", error)
    notifyCartSyncError()
  }
}

// --- Context -----------------------------------------------------------------

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  lastAdded: LastAdded | null
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void
  removeItem: (id: number) => void
  setQuantity: (id: number, quantity: number) => void
  restoreItem: (item: CartItem, index: number) => void
}

const CartContext = React.createContext<CartContextValue | null>(null)

function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [state, dispatch] = React.useReducer(cartReducer, {
    items: [],
    hydrated: false,
    lastAdded: null,
  })

  const itemsRef = React.useRef(state.items)
  itemsRef.current = state.items
  const prevUserIdRef = React.useRef<string | null>(null)

  // Immediate guest hydrate (from localStorage) so the cart isn't empty while
  // auth resolves. Re-hydrated below once we know the user.
  React.useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() })
  }, [])

  // Auth-driven (re)hydrate + guest→user merge.
  React.useEffect(() => {
    if (authLoading) return
    const uid = user?.id ?? null
    const prev = prevUserIdRef.current
    prevUserIdRef.current = uid

    if (!uid) {
      // Logged out (or still a guest). Reset to whatever is in localStorage.
      if (prev) dispatch({ type: "HYDRATE", items: loadCart() })
      return
    }

    let cancelled = false
    void (async () => {
      const items = prev
        ? await fetchRemoteCart(uid) // switched accounts
        : await mergeIntoRemoteCart(uid, loadCart()) // first sight of this user
      if (cancelled) return
      if (!prev) clearCart()
      dispatch({ type: "HYDRATE", items })
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, authLoading])

  // Persist to localStorage for guests only. Logged-in carts live in the DB.
  React.useEffect(() => {
    if (!state.hydrated || user) return
    saveCart(state.items)
  }, [state.items, state.hydrated, user])

  const itemCount = state.items.reduce((n, i) => n + i.quantity, 0)
  const subtotal = state.items.reduce(
    (sum, i) =>
      sum + getDiscountedPrice(i.price, i.discountPercentage) * i.quantity,
    0
  )

  const userId = user?.id ?? null

  const value = React.useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      lastAdded: state.lastAdded,
      addItem: (item, quantity) => {
        dispatch({ type: "ADD_ITEM", item, quantity })
        if (!userId) return
        const existing =
          itemsRef.current.find((i) => i.id === item.id)?.quantity ?? 0
        void upsertRemoteItem(
          userId,
          item.id,
          clampCartQty(existing + quantity, item.stock)
        )
      },
      removeItem: (id) => {
        dispatch({ type: "REMOVE_ITEM", id })
        if (userId) void deleteRemoteItem(userId, id)
      },
      setQuantity: (id, quantity) => {
        dispatch({ type: "SET_QUANTITY", id, quantity })
        if (!userId) return
        const found = itemsRef.current.find((i) => i.id === id)
        if (!found) return
        void upsertRemoteItem(userId, id, clampCartQty(quantity, found.stock))
      },
      restoreItem: (item, index) => {
        dispatch({ type: "RESTORE_ITEM", item, index })
        if (userId) {
          void upsertRemoteItem(
            userId,
            item.id,
            clampCartQty(item.quantity, item.stock)
          )
        }
      },
    }),
    [state.items, state.lastAdded, itemCount, subtotal, userId]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}

export { CartProvider, useCart, maxQuantityFor }
export type { CartItem, LastAdded }
