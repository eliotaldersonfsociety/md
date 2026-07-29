"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Package, ChevronDown, Heart, Layers, Circle, Moon, Key, Building2, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/context/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { WholesaleDrawer } from "@/components/wholesale-drawer"

const categories = [
  { name: "Peluches", image: "/images/categorias/1.webp", href: "/peluches" },
  { name: "Cojines", image: "/images/categorias/2.webp", href: "/cojines" },
  { name: "Latas", image: "/images/categorias/3.webp", href: "/latas" },
  { name: "Cervicales", image: "/images/categorias/4.webp", href: "/cervicales" },
  { name: "Llaveros", image: "/images/categorias/5.webp", href: "/llaveros" },
  { name: "Ropa", image: "/images/categorias/6.webp", href: "/ropa" },
  { name: "Floristeria", image: "/images/categorias/7.webp", href: "/floristeria" },
]

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266-.058-1.644-.07-4.85-.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83" />
    </svg>
  )
}

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false)
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const { getCartCount, getWholesaleCount, purchaseMode } = useCart()
  const cartCount = getCartCount()
  const wholesaleCount = getWholesaleCount()

  return (
    <>
      {/* Top Bar - Magenta */}
      <div className="bg-[#e91e8c] text-white">
        <div className="container mx-auto px-4">
          <div className="flex h-8 items-center justify-between">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link href="https://www.facebook.com/streetachira" className="hover:opacity-80 transition-opacity">
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link href="https://www.instagram.com/fabricadepeluchesmundodisney" className="hover:opacity-80 transition-opacity">
                <InstagramIcon className="h-4 w-4" />
              </Link>
              <Link href="https://www.tiktok.com/@fabricamundodisney" className="hover:opacity-80 transition-opacity">
                <TikTokIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center text-xs font-medium tracking-wide">
              <span className="text-yellow-300 mr-2">★</span>
              ENVIOS POR INTERRAPIDISIMO SERVIENTREGA MRW ZOOM
              <span className="text-yellow-300 ml-2">★</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        {/* Main Header - Purple */}
        <header className="sticky top-0 z-40 w-full bg-[#5c2d91]">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Left Navigation */}
              <nav className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Inicio
                </Link>
                <Link href="/nosotros" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Nosotros
                </Link>
              </nav>

              {/* Center Logo */}
              <Link href="/" className="flex items-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#00bcd4] p-1.5 shadow-lg">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src="/images/logo.webp"
                      alt="Mundo Disney - Logo"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </Link>

              {/* Right Navigation */}
              <div className="flex items-center gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger suppressHydrationWarning className="flex items-center gap-1 text-sm font-medium text-white hover:text-white/80 transition-colors outline-none">
                    Categorias
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48 bg-white">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.name} asChild>
                        <Link 
                          href={category.href} 
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {category.image ? (
                            <div className="relative w-6 h-6 flex-shrink-0">
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <Circle className="h-4 w-4 text-primary" />
                          )}
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/empresas" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Empresas
                </Link>
                <Link href="/contacto" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                  Contacto
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Search className="h-5 w-5" />
                </Button>

                {/* Wholesale Button - Show when in wholesale mode or has items */}
                {(purchaseMode === "wholesale" || wholesaleCount > 0) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-white hover:bg-white/10"
                    onClick={() => setIsWholesaleOpen(true)}
                  >
                    <Package className="h-5 w-5" />
                    {wholesaleCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-[10px] font-bold flex items-center justify-center">
                        {wholesaleCount}
                      </span>
                    )}
                  </Button>
                )}
                
                {/* Cart Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/10"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#00bcd4] text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#5c2d91] border-t border-white/20 z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white">
            <Image src="/images/logo.webp" alt="Mundo Disney" width={28} height={28} className="rounded-full bg-white/90" />
            <span className="text-[10px] font-medium">Inicio</span>
          </Link>
          <Link href="/empresas" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white">
            <Building2 className="h-6 w-6" />
            <span className="text-[10px] font-medium">Empresas</span>
          </Link>
          <Link href="/contacto" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white">
            <Phone className="h-6 w-6" />
            <span className="text-[10px] font-medium">Contacto</span>
          </Link>
          <button onClick={() => setIsWhatsAppOpen(true)} className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white">
            <MessageCircle className="h-6 w-6" />
            <span className="text-[10px] font-medium">WhatsApp</span>
          </button>
          <Link href="/floristeria" className="flex flex-col items-center gap-0.5 text-white/80 hover:text-white">
            <FlowerIcon className="h-6 w-6" />
            <span className="text-[10px] font-medium">Floristeria</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-0.5 text-white hover:bg-white/10 h-auto px-3 py-1"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#00bcd4] text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Carrito</span>
          </Button>
        </div>
      </nav>

      {isWhatsAppOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsWhatsAppOpen(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 space-y-3">
            <p className="text-center font-semibold text-lg">Elige tu país</p>
            <a href="https://wa.me/573112814787" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-xl">🇨🇴</span>
              <span className="font-medium">Colombia</span>
              <span className="ml-auto text-sm text-muted-foreground">+57 311 281 4787</span>
            </a>
            <a href="https://wa.me/584221782843" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-xl">🇻🇪</span>
              <span className="font-medium">Venezuela</span>
              <span className="ml-auto text-sm text-muted-foreground">+58 422 178 2843</span>
            </a>
            <Button variant="ghost" className="w-full" onClick={() => setIsWhatsAppOpen(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Wholesale Drawer */}
      <WholesaleDrawer isOpen={isWholesaleOpen} onClose={() => setIsWholesaleOpen(false)} />
    </>
  )
}
