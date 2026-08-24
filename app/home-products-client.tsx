"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Heart, ShoppingCart, Check, X, MessageCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RatingSection } from "@/components/rating-section"
import { useCart } from "@/context/cart-context"
import { allProducts } from "@/lib/products-data"
import { cn } from "@/lib/utils"
import { useGeolocation, formatPriceCurrency } from "@/lib/geolocation"
import { Product as ProductType, ProductVariant } from "@/components/category-page"
import ProductSkeleton from "@/components/product-skeleton"
import { buildProductSlug } from "@/lib/slugify"
import { WhatsAppModal } from "@/components/whatsapp-modal"

const WHATSAPP_NUMBER = "573112814787"
const FEATURES_FALLBACK = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]


function buildWhatsAppMessage(product: ProductType, variant: ProductVariant | null, price: number, mode: "retail" | "wholesale", quantity: number, isColombia: boolean) {
  let message = `Hola, quiero pedir: ${product.name}`
  if (variant?.label) message += ` - ${variant.label}`
  message += `\nPrecio: ${formatPriceCurrency(price, isColombia)}`
  if (mode === "wholesale") {
    message += `\nModo: Al mayor`
    message += `\nCantidad: ${quantity}`
  } else {
    message += `\nModo: Al detal`
  }
  return encodeURIComponent(message)
}

function mergeProducts(dbProducts: any[]): ProductType[] {
  const staticMap = new Map(allProducts.map(p => [p.id, p]))

  return dbProducts.map(p => {
    const staticP = staticMap.get(p.id)

    const seenLabels = new Set<string>()
    const staticLabelToVariant = new Map(
      (staticP?.variants || []).map((v: any) => [v.label, v])
    )

    function mapVariant(v: any) {
      const staticVariant = staticLabelToVariant.get(v.label)
      let basePrice = staticVariant?.price ?? v.price ?? p.price
      let baseWholesale = staticVariant?.wholesalePrice ?? v.wholesale_price ?? p.wholesale_price ?? p.price

      const isPeluche = (p.category || "").toLowerCase() === "peluches" || /Peluche/.test(p.name || "")

      if (isPeluche && v.label.includes("#2")) {
        baseWholesale = 44000
      }
      if (isPeluche && v.label.includes("#3")) {
        baseWholesale = 72000
      }
      if (isPeluche && v.label.includes("#4")) {
        baseWholesale = 120000
      }

      return {
        id: String(v.id ?? v.label),
        label: v.label,
        price: basePrice,
        wholesalePrice: baseWholesale,
        stock: v.stock ?? staticVariant?.stock ?? 0,
        badge: v.badge,
        badgeColor: v.badge_color,
        originalPrice: v.original_price,
        ofActive: v.of_active ?? 0,
        ofPrice: v.of_price,
        ofWholesalePrice: v.of_wholesale_price,
        ofOriginalPrice: v.of_original_price,
        ofBadge: v.of_badge,
        ofBadgeColor: v.of_badge_color,
        ofStock: v.of_stock,
      }
    }

    const isMiaSam = /Mia la Osa|Sam el Oso/.test(p.name || "")

    let variants = (p.variants || [])
      .filter((v: any) => {
        if (v.label === "#4 - 90cm") return false
        if ((p.category || "").toLowerCase() === "cojines" && /^Peque/i.test(v.label)) return false
        if (isMiaSam && (v.label === "#2 - 40cm" || v.label === "#3 - 60cm")) return false
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })

    if (isMiaSam) {
      const hasV4 = variants.some((v: any) => v.label.includes("#4"))
      if (!hasV4) {
        variants = [
          ...variants,
          {
            id: "v4-" + p.id,
            label: "#4 - 100cm",
            price: 150000,
            wholesalePrice: 85000,
            stock: 5,
          },
        ]
      }
    }

    const variantsFinal = variants
      .filter((v: any) => v.is_active !== false)
      .map((v: any) => {
        const mapped = mapVariant(v)
        if ((p.category || "").toLowerCase() === "cojines") {
          if (/^Peque/i.test(mapped.label)) mapped.label = "Mediano - 25cm"
          if (!/^(Mediano|Grande)/i.test(mapped.label)) return null
        }
        return mapped
      })
      .filter(Boolean)

    seenLabels.clear()
    const adultVariants = (p.adult_variants || [])
      .filter((v: any) => {
        if (v.label === "#4 - 90cm") return false
        if ((p.category || "").toLowerCase() === "cojines" && /^Peque/i.test(v.label)) return false
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .filter((v: any) => v.is_active !== false)
      .map((v: any) => {
        const mapped = mapVariant(v)
        if ((p.category || "").toLowerCase() === "cojines") {
          if (/^Peque/i.test(mapped.label)) mapped.label = "Mediano - 25cm"
          if (!/^(Mediano|Grande)/i.test(mapped.label)) return null
        }
        return mapped
      })
      .filter(Boolean)

    seenLabels.clear()
    const childVariants = (p.child_variants || [])
      .filter((v: any) => {
        if (v.label === "#4 - 90cm") return false
        if ((p.category || "").toLowerCase() === "cojines" && /^Peque/i.test(v.label)) return false
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .filter((v: any) => v.is_active !== false)
      .map((v: any) => {
        const mapped = mapVariant(v)
        if ((p.category || "").toLowerCase() === "cojines") {
          if (/^Peque/i.test(mapped.label)) mapped.label = "Mediano - 25cm"
          if (!/^(Mediano|Grande)/i.test(mapped.label)) return null
        }
        return mapped
      })
      .filter(Boolean)

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      images: staticP?.images,
      badge: p.badge,
      badgeColor: p.badge_color,
      variants: variantsFinal.length > 0 ? variantsFinal : undefined,
      rating: p.rating,
      reviews: p.reviews ?? p.rating_count ?? 0,
      category: (p.category || staticP?.category || "").toLowerCase(),
      adultVariants: adultVariants.length > 0 ? adultVariants : undefined,
      childVariants: childVariants.length > 0 ? childVariants : undefined,
      adultImages: p.adultImages,
      childImages: p.childImages,
      features: staticP?.features || FEATURES_FALLBACK,
      stock: p.stock,
      wholesalePrice: p.wholesalePrice,
      isNew: !!p.is_new,
      isSale: !!p.is_sale,
      minWholesale: p.minWholesale ?? 3,
    }
  })
}

export default function HomeProductsClient({ initialProducts, vercelCountry }: { initialProducts: any[]; vercelCountry?: string | null }) {
  const router = useRouter()
  const { addToCart, addToWholesale, purchaseMode, setPurchaseMode } = useCart()
  const [isHydrating, setIsHydrating] = useState(true)
  const products = useMemo(() => mergeProducts(initialProducts), [initialProducts])
  const { isColombia } = useGeolocation(vercelCountry)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [favorites, setFavorites] = useState<number[]>([])
  const [addedProducts, setAddedProducts] = useState<Record<number, boolean>>({})
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({})
  const [variantTypes, setVariantTypes] = useState<Record<number, "adult" | "child">>({})
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")
  const [selectedCatalogCountry, setSelectedCatalogCountry] = useState<"colombia" | "venezuela" | null>(null)

  const catalogFiles: Record<"colombia" | "venezuela", string[]> = {
    colombia: [
      "/catalogo/colombia/Catalogo-Cojines-2026.pdf",
      "/catalogos/colombia/Catalogo-Peluches-2026.pdf",
    ],
    venezuela: [
      "/catalogos/venezuela/Catalogo-Cojines-2026.pdf",
      "/catalogos/venezuela/Catalogo-Peluches-2026.pdf",
    ],
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsHydrating(false), 120)
    return () => clearTimeout(timer)
  }, [])

  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c)))]

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(p => (p.category || "").toLowerCase() === selectedCategory.toLowerCase())
    }

    return filtered
  }, [products, searchQuery, selectedCategory])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const getQuantity = (productId: number) => quantities[productId] || 3

  const updateQuantity = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 3
      const next = Math.max(3, current + delta)
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

  const getProductPrice = (product: ProductType): number => {
    const variant = getSelectedVariant(product)
    const basePrice = product.price

    if ((product.category || "").toLowerCase() === "ropa") {
      const currentType = variantTypes[product.id] || null
      const activeVariants = currentType === "child"
        ? product.childVariants
        : currentType === "adult"
          ? product.adultVariants
          : null

      if (!variant && activeVariants && activeVariants.length > 0) {
        if (purchaseMode === "wholesale") {
          const firstLabel = activeVariants[0].label.toLowerCase()
          if (/^\d+$/.test(firstLabel)) return 40000
          return 60000
        }
        return activeVariants[0].price
      }

      if (variant) {
        if (purchaseMode === "retail") {
          const label = variant.label.toLowerCase()
          if (/^\d+$/.test(label)) return 60000
          if (/^(S|M|L|XL)$/i.test(label)) return 90000
          return variant.price || basePrice
        }

        const label = variant.label.toLowerCase()
        if (/^\d+$/.test(label)) return 40000
        if (/^(S|M|L|XL)$/i.test(label)) return 60000
      }
    }

    if (variant) {
      if (purchaseMode === "retail") {
        return variant.price || basePrice
      }
      return variant.wholesalePrice || Math.round(basePrice * 0.7)
    }

    return purchaseMode === "wholesale" ? (product.wholesalePrice || Math.round(basePrice * 0.7)) : basePrice
  }

  const handleAddToCart = (product: ProductType) => {
    const variant = getSelectedVariant(product)
    const price = getProductPrice(product)
    const variantLabel = variant ? ` - ${variant.label}` : ""
    const currentType = variantTypes[product.id] || null
    const cartImage = currentType === "child"
      ? (product.childImages?.[0] || product.image)
      : (product.adultImages?.[0] || product.images?.[0] || product.image)

    if (purchaseMode === "wholesale") {
      const qty = getQuantity(product.id)
      const maxStock = variant?.stock ?? Infinity
      const finalQty = maxStock !== Infinity ? Math.min(qty, maxStock) : qty
      addToWholesale({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: (product.category || "").toLowerCase()
      }, finalQty)
    } else {
      addToCart({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: (product.category || "").toLowerCase()
      })
    }

    setAddedProducts(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedProducts(prev => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  return (
    <div>
      <section id="productos" className="py-12">
        <div className="container mx-auto px-4">
          {isHydrating || products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                  Nuestra Tienda
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  Todos Nuestros Productos
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                  Explora nuestra colección completa de peluches, cojines, cervicales, llaveros y más.
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    ¿Quieres descargar todo el catálogo en PDF al por mayor?
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedCatalogCountry("colombia")}
                    >
                      <Download className="h-4 w-4" />
                      Colombia
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSelectedCatalogCountry("venezuela")}
                    >
                      <Download className="h-4 w-4" />
                      Venezuela
                    </Button>
                  </div>
                </div>
              </div>

              {selectedCatalogCountry && (
                <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
                  <p className="mb-3 text-center text-sm font-semibold text-foreground">
                    Catálogo {selectedCatalogCountry === "colombia" ? "Colombia" : "Venezuela"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {catalogFiles[selectedCatalogCountry].map((file, idx) => (
                      <a
                        key={file}
                        href={file}
                        download
                        className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
                      >
                        <span className="truncate pr-4">
                          {selectedCatalogCountry === "colombia"
                            ? idx === 0
                              ? "Cojines"
                              : "Peluches"
                            : idx === 0
                              ? "Cojines"
                              : "Peluches"}
                        </span>
                        <Download className="h-4 w-4 shrink-0 text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 p-1.5 bg-muted rounded-full">
                    <button
                      onClick={() => setPurchaseMode("retail")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${purchaseMode === "retail"
                        ? "bg-primary text-white shadow-sm"
                        : "text-foreground hover:bg-muted/80"
                        }`}
                    >
                      Al Detal
                    </button>
                    <button
                      onClick={() => setPurchaseMode("wholesale")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${purchaseMode === "wholesale"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-foreground hover:bg-muted/80"
                        }`}
                    >
                      Al Mayor
                    </button>
                  </div>

                  {purchaseMode === "wholesale" && (
                    <span className="hidden md:inline text-xs text-green-600 font-medium">
                      Mínimo 3 unidades
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize",
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedCategory !== "Todos") && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">
                    Filtros activos:
                  </span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 text-xs bg-muted px-3 py-1 rounded-full">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== "Todos" && (
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full capitalize">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory("Todos")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("Todos") }}
                    className="text-xs text-muted-foreground hover:text-primary underline ml-2"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No encontramos productos</h3>
                  <p className="text-muted-foreground mb-4">
                    Intenta cambiar los filtros o buscar algo diferente
                  </p>
                  <Button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("Todos") }}
                  >
                    Ver todos los productos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                  {filteredProducts.map((product) => {
                    const currentPrice = getProductPrice(product)
                    const selectedVariant = getSelectedVariant(product)
                    const productSlug = buildProductSlug(product.name)
                    const productHref = `/${(product.category || "peluches").toLowerCase()}/${productSlug}`
                    const showVariantSelect = product.adultVariants && product.childVariants && variantTypes[product.id]
                      ? getCurrentVariants(product).length > 0
                      : product.variants && product.variants.length > 0
                    const variantOptions = product.adultVariants && product.childVariants && variantTypes[product.id]
                      ? getCurrentVariants(product)
                      : product.variants || []

                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border cursor-pointer"
                        onClick={() => router.push(productHref)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-t-xl">
                          {(() => {
                            const currentType = variantTypes[product.id] || null
                            const displayImage = currentType === "child"
                              ? (product.childImages?.[0] || product.image)
                              : (product.adultImages?.[0] || product.images?.[0] || product.image)
                            return (
                              <Image
                                src={displayImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )
                          })()}

                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.isNew && (
                              <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                NUEVO
                              </span>
                            )}
                            {product.isSale && product.originalPrice && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
                            className={cn(
                              "absolute top-2 right-2 p-1.5 rounded-full transition-all opacity-80 hover:opacity-100",
                              favorites.includes(product.id)
                                ? "bg-primary text-white"
                                : "bg-white/80 hover:bg-white text-gray-600"
                            )}
                          >
                            <Heart
                              className={cn(
                                "h-3.5 w-3.5",
                                favorites.includes(product.id) && "fill-current"
                              )}
                            />
                          </button>

                          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-1">
                              <Button
                                className={cn(
                                  "shrink-0 h-8 w-8 md:h-8 md:w-auto md:px-3 md:text-xs transition-all",
                                  addedProducts[product.id]
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-white text-black hover:bg-white/90'
                                )}
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }}
                              >
                                {addedProducts[product.id] ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <ShoppingCart className="h-4 w-4" />
                                )}
                                <span className="hidden md:inline ml-1 text-xs">
                                  {addedProducts[product.id] ? 'Agregado' : 'Agregar'}
                                </span>
                              </Button>
                              <Button
                                className="h-8 md:h-9 px-3 md:px-4 text-white bg-green-600 hover:bg-green-700 transition-all text-[11px] md:text-sm shrink-0"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setWhatsAppMessage(buildWhatsAppMessage(product, selectedVariant, currentPrice, purchaseMode, getQuantity(product.id), isColombia))
                                  setIsWhatsAppOpen(true)
                                }}
                              >
                                <MessageCircle className="h-4 w-4 md:mr-1.5" />
                                <span className="truncate">WhatsApp</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5">
                          <span className="text-[10px] text-primary font-medium uppercase tracking-wide">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-sm mt-0.5 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>

                          <div className="mt-1">
                            <RatingSection productId={product.id} />
                          </div>

                          {product.adultVariants && product.childVariants && (
                            <div className="mt-1.5">
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setVariantTypes(prev => ({ ...prev, [product.id]: "adult" }))}}
                                  className={cn(
                                    "px-2 py-0.5 text-[10px] rounded border transition-all",
                                    variantTypes[product.id] !== "child"
                                      ? purchaseMode === "wholesale"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-primary bg-primary/10 text-primary"
                                      : "border-border"
                                  )}
                                >
                                  Adulto
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setVariantTypes(prev => ({ ...prev, [product.id]: "child" }))}}
                                  className={cn(
                                    "px-2 py-0.5 text-[10px] rounded border transition-all",
                                    variantTypes[product.id] === "child"
                                      ? purchaseMode === "wholesale"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-primary bg-primary/10 text-primary"
                                      : "border-border"
                                  )}
                                >
                                  Niño
                                </button>
                              </div>
                            </div>
                           )}

                           {showVariantSelect && (
                             <div className="mt-1.5">
                               <p className="text-[10px] text-muted-foreground mb-0.5">Tamaño:</p>
                               <select
                                 value={selectedVariant?.id || variantOptions[0]?.id || ""}
                                 onChange={(e) => { e.stopPropagation(); setSelectedVariants(prev => ({ ...prev, [product.id]: e.target.value }))}}
                                 className="w-full text-[10px] border border-border rounded bg-white px-1.5 py-1"
                               >
                                 {Array.from(new Map(variantOptions.map(v => [v.label, v])).values()).map((variant) => (
                                   <option key={variant.id} value={variant.id}>{variant.label}</option>
                                 ))}
                               </select>
                             </div>
                           )}

                          <div className="flex items-center justify-between gap-1 mt-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-base font-bold",
                                purchaseMode === "wholesale" ? "text-green-600" : "text-primary"
                              )}>
                                {formatPriceCurrency(currentPrice, isColombia)}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPriceCurrency(Math.round(currentPrice * 1.4), isColombia)}
                              </span>
                            </div>
                            {purchaseMode === "wholesale" && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                Mayorista
                              </span>
                            )}
                          </div>

                          {purchaseMode === "wholesale" && (
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -6)}}
                                disabled={getQuantity(product.id) <= 3}
                              >
                                <span className="text-xs">-</span>
                              </Button>
                              <span className="w-10 text-center font-medium text-xs">
                                {getQuantity(product.id)} uds
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 6)}}
                              >
                                <span className="text-xs">+</span>
                              </Button>
                            </div>
                          )}
                        </div>
                        </div>
                      )
                    })}
                </div>
              )}

              <div className="text-center mt-10">
                <span className="text-sm text-muted-foreground">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </span>
              </div>
            </>
          )}
        </div>
      </section>
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} message={whatsAppMessage} />
    </div>
  )
}
