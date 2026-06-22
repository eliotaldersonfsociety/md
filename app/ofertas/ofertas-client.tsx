"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, Heart, ShoppingCart, X, ChevronDown, Store, Building2, Check, Minus, Plus, Flame, Clock, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { allProducts } from "@/lib/products-data"
import { Product as ProductType, ProductVariant } from "@/components/category-page"
import { RatingSection } from "@/components/rating-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useUSDPrice } from "@/lib/exchange-rate"

const categories = ["Todos", "cojines", "peluches", "latas", "cervicales"]

const sortOptions = [
  { value: "featured", label: "Mayor descuento" },
  { value: "ending-soon", label: "Más nuevos" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor valorados" },
]

const FEATURES_FALLBACK = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

function getStockTag(product: ProductType, selectedVariant: ProductVariant | null) {
  const variant = selectedVariant
  const offerStock = variant?.ofStock ?? (product.ofActive === 1 ? product.ofStock : undefined)

  if (offerStock !== undefined && offerStock !== null && offerStock <= 0) {
    return <div className="text-xs text-red-600 mt-2 font-medium">Agotado en oferta</div>
  }
  if (offerStock !== undefined && offerStock !== null && offerStock <= 3) {
    return <div className="text-xs text-orange-600 mt-2">Quedan {offerStock} unidades en oferta</div>
  }
  if (variant && (variant.stock ?? Infinity) < 10) {
    return <div className="text-xs text-orange-600 mt-2">Quedan pocas unidades de esta opción</div>
  }
  if (product.variants && product.variants.length > 0 && variant) {
    const displayStock = offerStock ?? variant.stock ?? 0
    return <div className="text-xs text-muted-foreground mt-2">{displayStock > 0 ? `Disponible: ${displayStock} unidades` : 'Agotado'}</div>
  }
  if (product.stock !== undefined) {
    return <div className="text-xs text-muted-foreground mt-2">{product.stock > 0 ? `Disponible: ${product.stock} unidades` : 'Agotado'}</div>
  }
  return null
}

function mergeProducts(dbProducts: any[]): ProductType[] {
  const staticMap = new Map(allProducts.map(p => [p.id, p]))

  return dbProducts.map(p => {
    const staticP = staticMap.get(p.id)
    const productOriginalPrice = p.of_original_price ?? p.original_price ?? p.originalPrice
    const productOfActive = p.of_active ?? p.ofActive ?? 0
    const hasProductOffer = productOfActive === 1 || p.is_sale || p.original_price || p.originalPrice || p.badge || p.of_price || productOriginalPrice || p.of_badge

    const seenLabels = new Set<string>()
    const variants = (p.variants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .filter((v: any) => v.is_active !== false)
       .map((v: any) => ({
         id: String(v.id ?? v.label),
         label: v.label,
         price: v.price ?? p.price,
         wholesalePrice: (v.wholesalePrice ?? v.wholesale_price) ?? p.wholesale_price ?? p.wholesalePrice ?? p.price,
         stock: v.stock ?? 0,
         badge: v.badge,
         badgeColor: v.badgeColor ?? v.badge_color,
         originalPrice: v.originalPrice ?? v.original_price,
         ofActive: v.ofActive ?? v.of_active ?? 0,
         ofPrice: v.ofPrice ?? v.of_price,
         ofWholesalePrice: v.ofWholesalePrice ?? v.of_wholesale_price,
         ofOriginalPrice: v.ofOriginalPrice ?? v.of_original_price,
         ofBadge: v.ofBadge ?? v.of_badge,
         ofBadgeColor: v.ofBadgeColor ?? v.of_badge_color,
         ofStock: v.ofStock ?? v.of_stock,
       }))

    seenLabels.clear()
    const adultVariants = (p.adult_variants || p.adultVariants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .filter((v: any) => v.is_active !== false)
      .map((v: any) => ({
        id: String(v.id ?? v.label),
        label: v.label,
        price: v.price ?? p.price,
        wholesalePrice: (v.wholesalePrice ?? v.wholesale_price) ?? p.wholesale_price ?? p.wholesalePrice ?? p.price,
        stock: v.stock ?? 0,
        badge: v.badge,
        badgeColor: v.badgeColor ?? v.badge_color,
        originalPrice: v.originalPrice ?? v.original_price,
        ofActive: v.ofActive ?? v.of_active ?? 0,
        ofPrice: v.ofPrice ?? v.of_price,
        ofWholesalePrice: v.ofWholesalePrice ?? v.of_wholesale_price,
        ofOriginalPrice: v.ofOriginalPrice ?? v.of_original_price,
        ofBadge: v.ofBadge ?? v.of_badge,
        ofBadgeColor: v.ofBadgeColor ?? v.of_badge_color,
        ofStock: v.ofStock ?? v.of_stock,
      }))

    seenLabels.clear()
    const childVariants = (p.child_variants || p.childVariants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .filter((v: any) => v.is_active !== false)
      .map((v: any) => ({
        id: String(v.id ?? v.label),
        label: v.label,
        price: v.price ?? p.price,
        wholesalePrice: (v.wholesalePrice ?? v.wholesale_price) ?? p.wholesale_price ?? p.wholesalePrice ?? p.price,
        stock: v.stock ?? 0,
        badge: v.badge,
        badgeColor: v.badgeColor ?? v.badge_color,
        originalPrice: v.originalPrice ?? v.original_price,
        ofActive: v.ofActive ?? v.of_active ?? 0,
        ofPrice: v.ofPrice ?? v.of_price,
        ofWholesalePrice: v.ofWholesalePrice ?? v.of_wholesale_price,
        ofOriginalPrice: v.ofOriginalPrice ?? v.of_original_price,
        ofBadge: v.ofBadge ?? v.of_badge,
        ofBadgeColor: v.ofBadgeColor ?? v.of_badge_color,
        ofStock: v.ofStock ?? v.of_stock,
      }))

    return {
      id: p.id,
      name: p.name,
      price: hasProductOffer && p.of_price ? p.of_price : (staticP?.price ?? p.price),
      wholesalePrice: hasProductOffer && p.of_wholesale_price ? p.of_wholesale_price : (staticP?.wholesalePrice ?? p.wholesale_price ?? p.wholesalePrice ?? p.price),
      originalPrice: staticP?.originalPrice ?? productOriginalPrice,
      image: staticP?.image ?? p.image,
      images: staticP?.images,
      badge: p.of_badge || p.badge,
      badgeColor: p.of_badge_color || p.badge_color || p.badgeColor,
      variants: variants.length > 0 ? variants : undefined,
      rating: p.rating,
      reviews: p.reviews ?? p.rating_count ?? 0,
      category: p.category,
      adultVariants: adultVariants.length > 0 ? adultVariants : undefined,
      childVariants: childVariants.length > 0 ? childVariants : undefined,
      adultImages: p.adult_images ?? p.adultImages,
      childImages: p.child_images ?? p.childImages,
      features: staticP?.features || FEATURES_FALLBACK,
      stock: p.of_stock ?? p.stock,
      isNew: !!p.is_new,
      isSale: !!hasProductOffer,
      ofActive: productOfActive,
      ofPrice: p.of_price,
      ofWholesalePrice: p.of_wholesale_price,
      ofOriginalPrice: productOriginalPrice,
      ofBadge: p.of_badge,
      ofBadgeColor: p.of_badge_color,
      ofStock: p.of_stock,
      minWholesale: p.minWholesale ?? p.min_wholesale ?? 12,
    }
  })
}

export default function OfertasClient({ initialProducts, maxDiscount }: { initialProducts: any[]; maxDiscount?: number }) {
  const { addToCart, addToWholesale, purchaseMode, setPurchaseMode } = useCart()
  const { formatUSD } = useUSDPrice()
  const products = useMemo(() => mergeProducts(initialProducts), [initialProducts])
  const allProductsForDisplay = useMemo(() => products, [products])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [addedProducts, setAddedProducts] = useState<Record<number, boolean>>({})
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({})
  const [variantTypes, setVariantTypes] = useState<Record<number, "adult" | "child">>({})
  
  const [editMode, setEditMode] = useState(false)
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({})
  const [editedWholesalePrices, setEditedWholesalePrices] = useState<Record<number, number>>({})
  const [editedStock, setEditedStock] = useState<Record<number, number>>({})
  const [editedBadges, setEditedBadges] = useState<Record<number, { text: string; color: string }>>({})

const filteredProducts = useMemo(() => {
    let filtered = [...allProductsForDisplay]

    filtered = filtered.map((p) => {
      const offeredVariants = (variants: any[] | undefined) => {
        if (!variants || variants.length === 0) return undefined
        return variants.filter(v => v.badge || v.ofActive || v.ofPrice || v.ofOriginalPrice || v.ofBadge || v.ofStock)
      }

      return {
        ...p,
        variants: offeredVariants(p.variants),
        adultVariants: offeredVariants(p.adultVariants),
        childVariants: offeredVariants(p.childVariants),
      }
    }).filter((p) => p.ofActive || p.ofPrice || p.ofOriginalPrice || p.ofBadge || (p.variants && p.variants.some(v => v.ofActive || v.ofPrice || v.ofOriginalPrice || v.ofBadge || v.ofStock)) || (p.adultVariants && p.adultVariants.some(v => v.ofActive || v.ofPrice || v.ofOriginalPrice || v.ofBadge || v.ofStock)) || (p.childVariants && p.childVariants.some(v => v.ofActive || v.ofPrice || v.ofOriginalPrice || v.ofBadge || v.ofStock)))

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    if (showOnlyNew) {
      filtered = filtered.filter((p) => p.isNew)
    }

    switch (sortBy) {
      case "featured":
        filtered = filtered.sort((a, b) => {
          const discountA = a.originalPrice ? (1 - a.price / a.originalPrice) : 0
          const discountB = b.originalPrice ? (1 - b.price / b.originalPrice) : 0
          return discountB - discountA
        })
        break
      case "ending-soon":
        filtered = filtered.filter((p) => p.isNew).concat(filtered.filter((p) => !p.isNew))
        break
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return filtered
  }, [allProductsForDisplay, searchQuery, selectedCategory, sortBy, priceRange, showOnlyNew])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const getQuantity = (productId: number) => quantities[productId] || 12

  const updateQuantity = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 12
      const next = Math.max(12, current + delta)
      return { ...prev, [productId]: next }
    })
  }

  const getSelectedVariant = (product: ProductType): ProductVariant | null => {
    const variants = getCurrentVariants(product)
    if (!variants || variants.length === 0) return null
    const selectedId = selectedVariants[product.id]
    return variants.find(v => v.id === selectedId) || variants[0]
  }

  const getCurrentVariants = (product: ProductType): ProductVariant[] => {
    const currentType = variantTypes[product.id] || null
    if (currentType === "child") return product.childVariants || []
    if (currentType === "adult") return product.adultVariants || []
    return product.variants || []
  }

  const getVariantStock = (variant: ProductVariant | null): number => {
    if (!variant) return Infinity
    if (variant.ofActive === 1 && variant.ofStock !== undefined && variant.ofStock !== null) return variant.ofStock
    return variant.stock ?? Infinity
  }

  const getProductPrice = (product: ProductType): number => {
      const basePrice = editedPrices[product.id] ?? product.price
      const baseWholesalePrice = editedWholesalePrices[product.id] ?? product.wholesalePrice
      
      const variant = getSelectedVariant(product)
      if (variant) {
        const hasVariantOffer = variant.ofActive === 1
        const hasBadgeOrOriginal = variant.badge || variant.originalPrice
        if (hasVariantOffer && variant.ofPrice) {
          return purchaseMode === "wholesale" ? (variant.ofWholesalePrice ?? variant.ofPrice) : variant.ofPrice
        }
        if (hasBadgeOrOriginal) {
          return purchaseMode === "wholesale" ? variant.wholesalePrice : variant.price
        }
        return purchaseMode === "wholesale" ? variant.wholesalePrice : variant.price
      }
      if (product.ofActive === 1 && product.ofPrice) {
        return purchaseMode === "wholesale" ? (product.ofWholesalePrice ?? product.ofPrice) : product.ofPrice
      }
      if (product.badge || product.originalPrice || product.isSale) {
        return purchaseMode === "wholesale" ? baseWholesalePrice : basePrice
      }
      return purchaseMode === "wholesale" ? (baseWholesalePrice || Math.round(basePrice * 0.7)) : basePrice
    }

  const getButtonText = (product: ProductType) => {
    const variant = getSelectedVariant(product)
    const offerStock = variant?.ofStock ?? (product.ofActive === 1 ? product.ofStock : undefined)
    if (offerStock !== undefined && offerStock !== null && offerStock <= 0) {
      return "Agotado en oferta"
    }
    return purchaseMode === "wholesale" ? "Agregar al pedido" : "Agregar"
  }

  const getStockDisabled = (product: ProductType) => {
    const v = getSelectedVariant(product)
    const os = v?.ofStock ?? (product.ofActive === 1 ? product.ofStock : undefined)
    if (os !== undefined && os !== null) return os <= 0
    const s = getSelectedVariant(product)?.stock ?? product.stock
    return s !== undefined && s <= 0
  }

  const handleAddToCart = (product: ProductType) => {
    const variant = getSelectedVariant(product)
    const availableOfferStock = variant?.ofStock ?? (product.ofActive === 1 ? product.ofStock ?? Infinity : Infinity)
    if (availableOfferStock <= 0) return

    const price = getProductPrice(product)
    const variantLabel = variant ? ` - ${variant.label}` : ""
    const currentType = variantTypes[product.id] || null
    const cartImage = currentType === "child"
      ? (product.childImages?.[0] || product.image)
      : (product.adultImages?.[0] || product.images?.[0] || product.image)

    if (purchaseMode === "wholesale") {
      const qty = getQuantity(product.id)
      const maxStock = variant ? getVariantStock(variant) : (product.ofActive === 1 ? product.ofStock ?? Infinity : Infinity)
      const finalQty = maxStock !== Infinity ? Math.min(qty, maxStock) : qty
      addToWholesale({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        productId: product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: product.category!
      }, finalQty)
    } else {
      addToCart({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        productId: product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: product.category!
      })
    }

    setAddedProducts(prev => ({ ...prev, [product.id]: true }))
    setQuantities(prev => ({ ...prev, [product.id]: (prev[product.id] ?? 1) - 1 }))
    setTimeout(() => {
      setAddedProducts(prev => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  const calculatedMaxDiscount = Math.max(...allProductsForDisplay.flatMap(p => {
    const productOriginalPrice = p.ofOriginalPrice ?? p.originalPrice
    const productPrice = p.ofPrice ?? p.price
    const discounts = [productOriginalPrice ? Math.max(0, Math.round((1 - productPrice / productOriginalPrice) * 100)) : 0]
    const collectVariantDiscounts = (variants: ProductVariant[] | undefined) => {
      if (!variants) return
      for (const variant of variants) {
        const originalPrice = variant.ofOriginalPrice ?? variant.originalPrice
        const price = variant.ofPrice ?? variant.price
        if (originalPrice && price) {
          discounts.push(Math.max(0, Math.round((1 - price / originalPrice) * 100)))
        }
      }
    }
    collectVariantDiscounts(p.variants)
    collectVariantDiscounts(p.adultVariants)
    collectVariantDiscounts(p.childVariants)
    return discounts
  }), 0)
  const totalSavings = allProductsForDisplay.reduce((acc, p) => {
    const originalPrice = p.ofOriginalPrice ?? p.originalPrice ?? 0
    const price = p.ofPrice ?? p.price
    return acc + Math.max(0, originalPrice - price)
  }, 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="absolute top-10 left-10 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full rotate-[-15deg] animate-pulse hidden md:block">
          -50%
        </div>
        <div className="absolute top-20 right-20 bg-white text-red-600 font-bold px-4 py-2 rounded-full rotate-[10deg] hidden md:block">
          HOT SALE
        </div>
        <div className="absolute bottom-10 left-20 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full rotate-[5deg] hidden md:block">
          -30%
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Percent className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">OFERTAS HASTA {maxDiscount ?? calculatedMaxDiscount}% OFF</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Ofertas Especiales
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Aprovecha descuentos increíbles en cojines, cervicales, peluches y latas. Ofertas que no puedes dejar pasar.
            </p>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold">{allProductsForDisplay.length}</div>
                <div className="text-sm opacity-80">Productos en oferta</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl md:text-3xl lg:text-4xl font-bold">Hasta {maxDiscount ?? calculatedMaxDiscount}%</div>
                <div className="text-sm opacity-80">De descuento</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold">{formatPrice(totalSavings)}</div>
                <div className="text-sm opacity-80">Ahorro total disponible</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full mt-6">
              <button
                onClick={() => setPurchaseMode("retail")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  purchaseMode === "retail"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Store className="h-4 w-4" />
                Al Detal
              </button>
              <button
                onClick={() => setPurchaseMode("wholesale")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  purchaseMode === "wholesale"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-white hover:bg-white/20"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Al Mayor
              </button>
            </div>

            {purchaseMode === "wholesale" && (
              <p className="mt-4 text-sm text-green-200 font-medium">
                Precios especiales para mayoristas - Minimo 12 unidades por referencia
              </p>
            )}
          </div>
        </div>
      </section>

      

      {/* Countdown Banner */}
      <section className="bg-yellow-400 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-yellow-900">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Las ofertas terminan pronto - No te las pierdas</span>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

             {/* Actions */}
             <div className="flex items-center gap-3">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowFilters(!showFilters)}
                 className="gap-2"
               >
                 <SlidersHorizontal className="h-4 w-4" />
                 Filtros
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setEditMode(!editMode)}
                 className="gap-2"
               >
                 {editMode ? (
                   <>
                     <Check className="h-4 w-4 mr-1" />
                     Salir edición
                   </>
                 ) : (
                   <>
                     <SlidersHorizontal className="h-4 w-4" />
                     Editar productos
                   </>
                 )}
               </Button>

              <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setGridCols(3)}
                  className={cn(
                    "p-1.5 rounded",
                    gridCols === 3 ? "bg-primary text-white" : "hover:bg-muted"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={cn(
                    "p-1.5 rounded",
                    gridCols === 4 ? "bg-primary text-white" : "hover:bg-muted"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Precio:</span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0] || ""}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 h-9"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1] || ""}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 h-9"
                />
              </div>

<label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyNew}
                  onChange={(e) => setShowOnlyNew(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Solo nuevos</span>
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Todos")
                  setPriceRange([0, 100000])
                  setShowOnlyNew(false)
                }}
                className="text-primary"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Mostrando {filteredProducts.length} ofertas disponibles productos
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No encontramos productos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta cambiar los filtros o buscar algo diferente
              </p>
              <Button
onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Todos")
                  setPriceRange([0, 100000])
                  setShowOnlyNew(false)
                }}
              >
                Ver todos los productos
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-6",
                gridCols === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {filteredProducts.map((product) => {
                const currentPrice = getProductPrice(product)
                const selectedVariant = getSelectedVariant(product)
                const currentType = variantTypes[product.id] || null
                const displayImage = currentType === "child"
                  ? (product.childImages?.[0] || product.image)
                  : (product.adultImages?.[0] || product.images?.[0] || product.image)

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />

                        {/* Badges */}
                        {editMode ? (
                          <>
                            {selectedVariant?.badge && (
                              <span className={`${selectedVariant.badgeColor || "bg-red-500"} text-white text-xs font-bold px-3 py-1 rounded-full mb-2 block`}>
                                {selectedVariant.badge}
                              </span>
                            )}
                            <input
                             type="text"
                             placeholder="Texto del badge"
                             defaultValue={editedBadges[product.id]?.text || ''}
                             onChange={(e) => {
                               setEditedBadges(prev => ({
                                 ...prev,
                                 [product.id]: {
                                   ...(prev[product.id] || {}),
                                   text: e.target.value
                                 }
                               }))
                             }}
                             className="w-32 border rounded px-2 py-1 mb-1"
                           />
                           <input
                             type="text"
                             placeholder="Color (ej: bg-red-500)"
                             defaultValue={editedBadges[product.id]?.color || ''}
                             onChange={(e) => {
                               setEditedBadges(prev => ({
                                 ...prev,
                                 [product.id]: {
                                   ...(prev[product.id] || {}),
                                   color: e.target.value
                                 }
                               }))
                             }}
                             className="w-32 border rounded px-2 py-1"
                           />
                         </>
) : (
                                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {selectedVariant?.ofActive && selectedVariant.ofBadge && (
                                      <span className={`${selectedVariant.ofBadgeColor || "bg-red-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                        {selectedVariant.ofBadge}
                                      </span>
                                    )}
                                    {selectedVariant?.ofActive && selectedVariant.ofOriginalPrice && selectedVariant.ofPrice && (
                                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        -{Math.max(0, Math.round((1 - selectedVariant.ofPrice / selectedVariant.ofOriginalPrice) * 100))}%
                                      </span>
                                    )}
                                    {!selectedVariant?.ofActive && selectedVariant?.badge && selectedVariant.badge.trim() !== '' && (
                                      <span className={`${selectedVariant.badgeColor || "bg-red-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                        {selectedVariant.badge}
                                      </span>
                                    )}
                                    {!selectedVariant?.ofActive && !selectedVariant?.badge && product.ofBadge && product.ofBadge.trim() !== '' && (
                                      <span className={`${product.ofBadgeColor || product.badgeColor || "bg-red-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                        {product.ofBadge}
                                      </span>
                                    )}
                                    {!selectedVariant?.ofActive && !product.ofBadge && !selectedVariant?.badge && product.badge && product.badge.trim() !== '' && (
                                      <span className={`${product.badgeColor || "bg-red-500"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                        {product.badge}
                                      </span>
                                    )}
                                    {!selectedVariant?.ofActive && product.ofOriginalPrice && product.ofPrice && (
                                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        -{Math.max(0, Math.round((1 - product.ofPrice / product.ofOriginalPrice) * 100))}%
                                      </span>
                                    )}
                                    {!selectedVariant?.ofActive && !product.ofOriginalPrice && product.originalPrice && (
                                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        -{Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100))}%
                                      </span>
                                    )}
                                  </div>
                        )}

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={cn(
                          "absolute top-3 right-3 p-2 rounded-full transition-all",
                          favorites.includes(product.id)
                            ? "bg-primary text-white"
                            : "bg-white/80 hover:bg-white text-gray-600"
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5",
                            favorites.includes(product.id) && "fill-current"
                          )}
                        />
                      </button>

                      {/* Quick Add */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Button
                          className={`w-full text-xs md:text-sm transition-all ${
                            addedProducts[product.id]
                              ? 'bg-green-500 hover:bg-green-600'
                              : purchaseMode === "wholesale"
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-primary hover:bg-primary/90'
                          }`}
size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={getStockDisabled(product)}
                        >
                          {addedProducts[product.id] ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Agregado
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {getButtonText(product)}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium uppercase tracking-wide">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="mt-2">
                        <RatingSection productId={product.id} />
                      </div>

                      {/* Features */}
                      {product.features && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.features.map((feature, idx) => (
                            <span key={idx} className={`text-xs px-2 py-0.5 rounded ${feature === "Arreglo GRATIS" ? "bg-green-100 text-green-700 font-bold" : "bg-muted/50 text-muted-foreground"}`}>
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                       {/* Stock indicator - show variant stock if selected, otherwise product stock */}
{editMode ? (
                          <>
                            <input
                              type="number"
                              placeholder="Stock"
                              defaultValue={editedStock[product.id] || product.stock || 0}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0
                                setEditedStock(prev => ({ ...prev, [product.id]: value }))
                              }}
                              className="w-24 text-right border rounded px-2 py-1"
                            />
                            {product.stock !== undefined && (
                              <span className="text-xs text-muted-foreground mt-1 block">
                                Stock original: {product.stock}
                              </span>
                            )}
                          </>
                        ) : getStockTag(product, getSelectedVariant(product))}

                      {/* Variant Type Selector (Adulto/Niño) */}
                      {product.adultVariants && product.childVariants && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Tipo:</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setVariantTypes(prev => ({ ...prev, [product.id]: "adult" }))}
                              className={`px-3 py-1 text-xs rounded-md border transition-all ${
                                variantTypes[product.id] !== "child"
                                  ? purchaseMode === "wholesale"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              Adulto
                            </button>
                            <button
                              onClick={() => setVariantTypes(prev => ({ ...prev, [product.id]: "child" }))}
                              className={`px-3 py-1 text-xs rounded-md border transition-all ${
                                variantTypes[product.id] === "child"
                                  ? purchaseMode === "wholesale"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              Niño
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Variant Selector */}
                      {product.adultVariants && product.childVariants && variantTypes[product.id]
                        ? getCurrentVariants(product).length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1.5">Tamaño:</p>
                              <div className="flex flex-wrap gap-1">
                                {Array.from(new Map(getCurrentVariants(product).map(v => [v.label, v])).values()).map((variant) => (
                                  <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: variant.id }))}
                                    className={`px-2 py-1 text-xs rounded-md border transition-all flex items-center gap-1 ${
                                      (selectedVariant?.id === variant.id || (!selectedVariants[product.id] && variant === getCurrentVariants(product)[0]))
                                        ? purchaseMode === "wholesale"
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                   >
                                     <span>{variant.label}</span>
                                   </button>
                                ))}
                              </div>
                            </div>
                          )
                        : product.variants && product.variants.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1.5">Opción:</p>
                              <div className="flex flex-wrap gap-1">
                                {Array.from(new Map(product.variants.map(v => [v.label, v])).values()).map((variant) => (
                                  <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: variant.id }))}
                                    className={`px-2 py-1 text-xs rounded-md border transition-all flex items-center gap-1 ${
                                      (selectedVariant?.id === variant.id || (!selectedVariants[product.id] && variant === product.variants![0]))
                                        ? purchaseMode === "wholesale"
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                   >
                                     <span>{variant.label}</span>
                                   </button>
                                ))}
                              </div>
                            </div>
                          )}

                       <div className="flex items-center gap-2 mb-3">
                         {editMode ? (
<>
                              <input
                                type="number"
                                placeholder="Precio"
                                defaultValue={editedPrices[product.id] || product.price}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0
                                  setEditedPrices(prev => ({ ...prev, [product.id]: value }))
                                }}
                                className="w-32 text-right border rounded px-2 py-1"
                                 
                              />
                              <input
                                type="number"
                                placeholder="Precio Mayorista"
                                defaultValue={editedWholesalePrices[product.id] || product.wholesalePrice || Math.round((editedPrices[product.id] || product.price) * 0.7)}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0
                                  setEditedWholesalePrices(prev => ({ ...prev, [product.id]: value }))
                                }}
                                className="w-32 text-right border rounded px-2 py-1 ml-2"
                              />
                            </>
                           ) : (
                             <>
                               <span className={`text-xl font-bold ${purchaseMode === "wholesale" ? "text-green-600" : "text-primary"}`}>
                                 {formatPrice(currentPrice)}
                               </span>
                               <span className="text-sm text-muted-foreground">{formatUSD(currentPrice)}</span>
                             </>
                           )}
                          {purchaseMode === "wholesale" && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Mayorista
                            </span>
                          )}
                       </div>

                      {/* Quantity selector for wholesale */}
                      {purchaseMode === "wholesale" && (
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, -6)}
                            disabled={getQuantity(product.id) <= 3}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium text-sm">
                            {getQuantity(product.id)} uds
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(product.id, 6)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Load More */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="gap-2">
                Cargar más productos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary to-pink-400 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Buscas un peluche personalizado?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Creamos productos únicos para tu marca o evento especial. Desde 200 unidades con tu diseño exclusivo.
          </p>
          <Link href="/contacto">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
              Solicitar cotización
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}





