"use client"

import * as React from "react"

import { getDiscountedPrice } from "@/lib/discounts"
import { loadCart, saveCart } from "@/lib/cart/cart-storage"

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
  const [state, dispatch] = React.useReducer(cartReducer, {
    items: [],
    hydrated: false,
    lastAdded: null,
  })

  React.useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() })
  }, [])

  React.useEffect(() => {
    if (!state.hydrated) return
    saveCart(state.items)
  }, [state.items, state.hydrated])

  const itemCount = state.items.reduce((n, i) => n + i.quantity, 0)
  const subtotal = state.items.reduce(
    (sum, i) =>
      sum + getDiscountedPrice(i.price, i.discountPercentage, i.stock) * i.quantity,
    0
  )

  const value = React.useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      lastAdded: state.lastAdded,
      addItem: (item, quantity) => dispatch({ type: "ADD_ITEM", item, quantity }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
      setQuantity: (id, quantity) => dispatch({ type: "SET_QUANTITY", id, quantity }),
      restoreItem: (item, index) => dispatch({ type: "RESTORE_ITEM", item, index }),
    }),
    [state.items, state.lastAdded, itemCount, subtotal]
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
