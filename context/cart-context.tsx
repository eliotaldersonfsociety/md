"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface ProductVariant {
  id: string
  label: string
  price: number
  wholesalePrice: number
}

export interface Product {
  id: number
  productId?: number
  name: string
  price: number
  wholesalePrice: number
  originalPrice?: number
  image: string
  category: string
  source?: string
  isNew?: boolean
  isSale?: boolean
  isBestSeller?: boolean
  minWholesale?: number
  variants?: ProductVariant[]
  variantLabel?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface WholesaleItem extends Product {
  quantity: number
}

type PurchaseMode = "retail" | "wholesale"

interface CartContextType {
  purchaseMode: PurchaseMode
  setPurchaseMode: (mode: PurchaseMode) => void
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  wholesaleItems: WholesaleItem[]
  addToWholesale: (product: Product, quantity?: number) => void
  removeFromWholesale: (productId: number) => void
  updateWholesaleQuantity: (productId: number, quantity: number) => void
  clearWholesale: () => void
  getWholesaleTotal: () => number
  getWholesaleCount: () => number
  getTotalUnits: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("retail")
  const [items, setItems] = useState<CartItem[]>([])
  const [wholesaleItems, setWholesaleItems] = useState<WholesaleItem[]>([])

  const addToCart = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prevItems) => prevItems.map((item) => item.id === productId ? { ...item, quantity } : item))
  }, [removeFromCart])

  const clearCart = useCallback(() => setItems([]), [])

  const getCartTotal = useCallback(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items])
  const getCartCount = useCallback(() => items.reduce((count, item) => count + item.quantity, 0), [items])

  const addToWholesale = useCallback((product: Product, quantity: number = 3) => {
    setWholesaleItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [...prevItems, { ...product, quantity }]
    })
  }, [])

  const removeFromWholesale = useCallback((productId: number) => {
    setWholesaleItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const updateWholesaleQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromWholesale(productId)
      return
    }
    setWholesaleItems((prevItems) => prevItems.map((item) => item.id === productId ? { ...item, quantity } : item))
  }, [removeFromWholesale])

  const clearWholesale = useCallback(() => setWholesaleItems([]), [])
  const getWholesaleTotal = useCallback(() => wholesaleItems.reduce((total, item) => total + item.wholesalePrice * item.quantity, 0), [wholesaleItems])
  const getWholesaleCount = useCallback(() => wholesaleItems.length, [wholesaleItems])
  const getTotalUnits = useCallback(() => wholesaleItems.reduce((count, item) => count + item.quantity, 0), [wholesaleItems])

  return (
    <CartContext.Provider value={{
      purchaseMode, setPurchaseMode, items, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount,
      wholesaleItems, addToWholesale, removeFromWholesale, updateWholesaleQuantity, clearWholesale, getWholesaleTotal, getWholesaleCount, getTotalUnits,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error("useCart must be used within a CartProvider")
  return context
}
