"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, Heart, ShoppingCart, X, ChevronDown, Store, Building2, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { allProducts } from "@/lib/products-data"
import { Product as ProductType, ProductVariant, ProductImages } from "@/components/category-page"
import { RatingSection } from "@/components/rating-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useUSDPrice } from "@/lib/exchange-rate"

const categories = ["Todos", "llaveros", "peluches", "cojines", "latas", "cervicales", "ropa"]

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Más nuevos" },
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

function normalizeVariantLabel(label: string) {
  return label === "#4 - 90cm" ? "#4 - 100cm" : label
}

function mergeProducts(dbProducts: any[]): ProductType[] {
  const staticMap = new Map(allProducts.map(p => [p.id, p]))

  return dbProducts.map(p => {
    const staticP = staticMap.get(p.id)

    // Deduplicate variants by label to prevent duplicates
    const seenLabels = new Set<string>()
    const variants = (p.variants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .map((v: any) => ({
        id: String(v.id ?? v.label),
        label: normalizeVariantLabel(v.label),
        price: v.price ?? p.price,
        wholesalePrice: v.wholesale_price ?? p.wholesale_price ?? p.price,
        stock: v.stock ?? 0,
      }))

    seenLabels.clear()
    const adultVariants = (p.adult_variants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .map((v: any) => ({
        id: String(v.id ?? v.label),
        label: normalizeVariantLabel(v.label),
        price: v.price ?? p.price,
        wholesalePrice: v.wholesale_price ?? p.wholesale_price ?? p.price,
        stock: v.stock ?? 0,
      }))

    seenLabels.clear()
    const childVariants = (p.child_variants || [])
      .filter((v: any) => {
        if (seenLabels.has(v.label)) return false
        seenLabels.add(v.label)
        return true
      })
      .map((v: any) => ({
        id: String(v.id ?? v.label),
        label: normalizeVariantLabel(v.label),
        price: v.price ?? p.price,
        wholesalePrice: v.wholesale_price ?? p.wholesale_price ?? p.price,
        stock: v.stock ?? 0,
      }))

    const staticVariants = staticP?.variants
      ? new Map(staticP.variants.map((v: any) => [v.label, v]))
      : null
    const staticAdultVariants = staticP?.adultVariants
      ? new Map(staticP.adultVariants.map((v: any) => [v.label, v]))
      : null
    const staticChildVariants = staticP?.childVariants
      ? new Map(staticP.childVariants.map((v: any) => [v.label, v]))
      : null

    const applyStaticPrices = (variantList: any[], staticMap: Map<string, any> | null) => {
      if (!staticMap) return variantList
      return variantList.map(v => {
        const sv = staticMap.get(v.label)
        if (!sv) return v
        return {
          ...v,
          price: sv.price ?? v.price,
          wholesalePrice: sv.wholesalePrice ?? v.wholesalePrice,
        }
      })
    }

    return {
      id: p.id,
      name: p.name,
      price: staticP?.price ?? p.price,
      wholesalePrice: staticP?.wholesalePrice ?? p.wholesale_price ?? p.price,
      originalPrice: p.original_price,
      image: staticP?.image ?? p.image,
      images: staticP?.images,
      badge: p.badge,
      badgeColor: p.badge_color,
      variants: variants.length > 0 ? applyStaticPrices(variants, staticVariants) : undefined,
      rating: p.rating,
      reviews: p.reviews ?? p.rating_count ?? 0,
      category: p.category,
      adultVariants: adultVariants.length > 0 ? applyStaticPrices(adultVariants, staticAdultVariants) : undefined,
      childVariants: childVariants.length > 0 ? applyStaticPrices(childVariants, staticChildVariants) : undefined,
      adultImages: p.adult_images,
      childImages: p.child_images,
      features: staticP?.features || FEATURES_FALLBACK,
      stock: p.stock,
      isNew: !!p.is_new,
      isSale: !!p.is_sale,
      minWholesale: p.min_wholesale ?? 12,
    }
  })
}

export default function TiendaClient({ initialProducts }: { initialProducts: any[] }) {
  const { addToCart, addToWholesale, purchaseMode, setPurchaseMode } = useCart()
  const { formatUSD } = useUSDPrice()
  const products = useMemo(() => mergeProducts(initialProducts), [initialProducts])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [addedProducts, setAddedProducts] = useState<Record<number, boolean>>({})
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({})
  const [variantTypes, setVariantTypes] = useState<Record<number, "adult" | "child">>({})

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

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

    if (showOnlySale) {
      filtered = filtered.filter((p) => p.isSale)
    }

    switch (sortBy) {
      case "newest":
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
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, showOnlyNew, showOnlySale])

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
    return variant.stock ?? Infinity
  }

  const getProductPrice = (product: ProductType): number => {
    const variant = getSelectedVariant(product)
    if (variant) {
      return purchaseMode === "wholesale" ? variant.wholesalePrice : variant.price
    }
    return purchaseMode === "wholesale" ? (product.wholesalePrice || Math.round(product.price * 0.7)) : product.price
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
      const maxStock = getVariantStock(variant)
      const finalQty = maxStock !== Infinity ? Math.min(qty, maxStock) : qty
      addToWholesale({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: product.category!
      }, finalQty)
    } else {
      addToCart({
        id: variant ? parseInt(`${product.id}${variant.id.replace(/\D/g, '')}`) : product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: product.category!
      })
    }

    setAddedProducts(prev => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedProducts(prev => ({ ...prev, [product.id]: false }))
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary to-pink-400 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Nuestra Tienda
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Descubre nuestra colección de llaveros, peluches, cojines, latas y cervicales. Hechos con amor y los mejores materiales.
            </p>

            {/* Purchase Mode Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
              <button
                onClick={() => setPurchaseMode("retail")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  purchaseMode === "retail"
                    ? "bg-white text-primary shadow-md"
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

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlySale}
                  onChange={(e) => setShowOnlySale(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">En oferta</span>
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Todos")
                  setPriceRange([0, 100000])
                  setShowOnlyNew(false)
                  setShowOnlySale(false)
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
            Mostrando {filteredProducts.length} de {products.length} productos
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
                  setShowOnlySale(false)
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

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <ProductImages product={product} variantType={variantTypes[product.id] || null} purchaseMode={purchaseMode} />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                            NUEVO
                          </span>
                        )}
                        {product.isSale && product.originalPrice && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>

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
                        >
                          {addedProducts[product.id] ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Agregado
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {purchaseMode === "wholesale" ? "Agregar al pedido" : "Agregar"}
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
                          {product.features && (
                        <div className="flex flex-col gap-2">
                          {product.features.filter(feature => purchaseMode === "retail" || feature !== "Arreglo GRATIS").map((feature, idx) => (
                            <span key={idx} className={`text-xs px-2 py-0.5 rounded ${feature === "Arreglo GRATIS" ? "bg-green-100 text-green-700 font-bold" : "bg-muted/50 text-muted-foreground"}`}>
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                        </div>
                      )}

                      {/* Stock indicator - show variant stock if selected, otherwise product stock */}
                      {selectedVariant?.stock !== undefined && selectedVariant.stock < 10 ? (
                        <div className="text-xs text-orange-600 mt-2">
                          Quedan pocas unidades de esta opción
                        </div>
                      ) : product.variants && product.variants.length > 0 && selectedVariant ? (
                        <div className="text-xs text-muted-foreground mt-2">
                          {selectedVariant.stock !== undefined && selectedVariant.stock > 0
                            ? `Disponible: ${selectedVariant.stock} unidades`
                            : 'Agotado'}
                        </div>
                      ) : product.stock !== undefined ? (
                        <div className="text-xs text-muted-foreground mt-2">
                          {product.stock > 0
                            ? `Disponible: ${product.stock} unidades`
                            : 'Agotado'}
                        </div>
                      ) : null}

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
                                    className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                      (selectedVariant?.id === variant.id || (!selectedVariants[product.id] && variant === getCurrentVariants(product)[0]))
                                        ? purchaseMode === "wholesale"
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                  >
                                    {variant.label}
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
                                    className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                      (selectedVariant?.id === variant.id || (!selectedVariants[product.id] && variant === product.variants![0]))
                                        ? purchaseMode === "wholesale"
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                  >
                                    {variant.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

<div className="flex items-center gap-2 mb-3">
                         <span className={`text-xl font-bold ${purchaseMode === "wholesale" ? "text-green-600" : "text-primary"}`}>
                           {formatPrice(currentPrice)}
                         </span>
                         <span className="text-sm text-muted-foreground">{formatUSD(currentPrice)}</span>
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
