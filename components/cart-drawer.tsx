"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatPriceCurrency } from "@/lib/geolocation"
import { useGeolocation } from "@/lib/geolocation"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  const { isColombia } = useGeolocation()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-[#5c2d91]">
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Tu Carrito</h2>
            <span className="ml-2 px-2 py-0.5 bg-[#e91e8c] rounded-full text-xs font-medium">
              {getCartCount()} items
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Tu carrito esta vacio</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Agrega algunos peluches adorables a tu carrito
              </p>
              <Button 
                onClick={onClose}
                className="bg-[#5c2d91] hover:bg-[#5c2d91]/90 text-white rounded-full"
              >
                Seguir Comprando
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-muted/50 rounded-xl border border-border"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.category}
                    </p>
                    <p className="text-sm font-bold text-[#e91e8c]">
                      {formatPriceCurrency(item.price, isColombia)}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1 bg-card rounded-full border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 bg-muted/30">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-medium">{formatPriceCurrency(getCartTotal(), isColombia)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Envio</span>
              <span className="text-sm text-muted-foreground">Calculado en checkout</span>
            </div>
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-border">
              <span className="text-base font-semibold">Total</span>
              <span className="text-lg font-bold text-[#e91e8c]">{formatPriceCurrency(getCartTotal(), isColombia)}</span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" onClick={onClose}>
              <Button className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-full h-12 text-base font-semibold">
                Ir a Pagar
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full mt-2 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              Seguir Comprando
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
