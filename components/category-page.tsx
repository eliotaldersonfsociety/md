"use client"

export interface ProductVariant {
  id: string
  label: string
  price: number
  wholesalePrice: number
  stock?: number
  badge?: string
  badgeColor?: string
  originalPrice?: number
  ofActive?: number
  ofPrice?: number
  ofWholesalePrice?: number
  ofOriginalPrice?: number
  ofBadge?: string
  ofBadgeColor?: string
  ofStock?: number
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  badge?: string
  badgeColor?: string
  variants?: ProductVariant[]
  rating?: number
  reviews?: number
  category?: string
  variantType?: "adult" | "child"
  adultVariants?: ProductVariant[]
  childVariants?: ProductVariant[]
  adultImages?: string[]
  childImages?: string[]
  features?: string[]
  stock?: number
  wholesalePrice?: number
  isNew?: boolean
  isSale?: boolean
  minWholesale?: number
}

interface CategoryPageProps {
  title: string
  description: string
  products: Product[]
  category: string
  variantLabel?: string
  stockPerVariant?: boolean
}

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Check, Minus, Plus, Search, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"
import { formatPriceCurrency, useGeolocation } from "@/lib/geolocation"
import { RatingSection } from "@/components/rating-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppModal } from "@/components/whatsapp-modal"

function ProductImages({ product, variantType }: { product: Product; variantType: "adult" | "child" | null }) {
  const getImages = () => {
    if (variantType === "child" && product.childImages && product.childImages.length > 0) {
      return product.childImages.slice(0, 4)
    }
    if (variantType === "adult" && product.adultImages && product.adultImages.length > 0) {
      return product.adultImages.slice(0, 4)
    }
    return product.images && product.images.length > 0 ? product.images.slice(0, 4) : [product.image]
  }

  const images = getImages()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (images.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [images.length, isPaused])

  const goToImage = (index: number) => setCurrentIndex(index)
  const goPrev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length) }
  const goNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length) }

  return (
    <div className="relative w-full h-full group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {images.map((imgSrc, index) => (
        <Image key={index} src={imgSrc} alt={`${product.name} - vista ${index + 1}`} fill className={`object-contain transition-all duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`} />
      ))}
      {images.length > 1 && (
        <>
          <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Imagen anterior">
            <ChevronLeft className="h-4 w-4 mx-auto" />
          </button>
          <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Imagen siguiente">
            <ChevronRight className="h-4 w-4 mx-auto" />
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <button key={idx} onClick={() => goToImage(idx)} className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-white' : 'w-2 bg-white/60'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryPage({ title, description, products, category, variantLabel = "Tamaño", stockPerVariant }: CategoryPageProps) {
  const { addToCart } = useCart()
  const { isColombia } = useGeolocation()
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
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>({})
  const [variantTypes, setVariantTypes] = useState<Record<number, "adult" | "child">>(() => {
    const initial: Record<number, "adult" | "child"> = {}
    products.forEach(p => {
      if (p.adultVariants && p.childVariants) {
        initial[p.id] = "child"
      }
    })
    return initial
  })
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")

  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  const sortOptions = [
    { value: "featured", label: "Destacados" },
    { value: "newest", label: "Más nuevos" },
    { value: "price-asc", label: "Precio: menor a mayor" },
    { value: "price-desc", label: "Precio: mayor a menor" },
    { value: "rating", label: "Mejor valorados" },
  ]

  const filteredProducts = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedCategory !== "Todos" && p.category !== selectedCategory) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    if (showOnlyNew && !p.isNew) return false
    if (showOnlySale && !p.isSale) return false
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
  }

  const getSelectedVariant = (product: Product): ProductVariant | null => {
    const variants = getCurrentVariants(product)
    if (!variants || variants.length === 0) return null
    const selectedId = selectedVariants[product.id]
    return variants.find(v => v.id === selectedId) || variants[0]
  }

  const getCurrentVariants = (product: Product): ProductVariant[] => {
    const currentType = variantTypes[product.id] || null
    if (currentType === "child") return product.childVariants || []
    if (currentType === "adult") return product.adultVariants || []
    return product.variants || []
  }

  const getProductPrice = (product: Product): number => {
    const variant = getSelectedVariant(product)
    if (!variant) {
      if ((product.category || "").toLowerCase() === "ropa") {
        if (product.childVariants && product.childVariants.length > 0) {
          const label = product.childVariants[0].label.toLowerCase()
          if (/^\d+$/.test(label)) return product.childVariants[0].price
        }
        if (product.adultVariants && product.adultVariants.length > 0) {
          return product.adultVariants[0].price
        }
      }
      return product.price
    }
    return variant.price || product.price
  }

const handleAddToCart = (product: Product) => {
      const variant = getSelectedVariant(product)
      const price = getProductPrice(product)
      const variantLabel = variant ? ` - ${variant.label}` : ""
      const currentType = variantTypes[product.id] || null
      const cartImage = currentType === "child"
        ? (product.childImages?.[0] || product.image)
        : (product.adultImages?.[0] || product.images?.[0] || product.image)

      addToCart({
        id: variant ? generateVariantId(product.id, variant.id) : product.id,
        name: `${product.name}${variantLabel}`,
        price: price,
        wholesalePrice: price,
        image: cartImage,
        category: product.category!
      })

      setAddedProducts(prev => ({ ...prev, [product.id]: true }))
      setTimeout(() => {
        setAddedProducts(prev => ({ ...prev, [product.id]: false }))
      }, 2000)
    }

    const generateVariantId = (productId: number, variantId: string): number => {
      let hash = 0
      for (let i = 0; i < variantId.length; i++) {
        hash = variantId.charCodeAt(i) + ((hash << 5) - hash)
      }
      return Math.abs((productId * 1000) + hash)
    }

    const formatPrice = (price: number) => formatPriceCurrency(price, isColombia)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="relative bg-gradient-to-r from-primary to-pink-400 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">{description}</p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {categories.map((cat) => (
                <button key={cat} onClick={() => cat && setSelectedCategory(cat)} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors", selectedCategory === cat ? "bg-primary text-white" : "bg-muted hover:bg-muted/80 text-foreground")}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2"><SlidersHorizontal className="h-4 w-4" /> Filtros</Button>
              <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                <button onClick={() => setGridCols(3)} className={cn("p-1.5 rounded", gridCols === 3 ? "bg-primary text-white" : "hover:bg-muted")}><Grid3X3 className="h-4 w-4" /></button>
                <button onClick={() => setGridCols(4)} className={cn("p-1.5 rounded", gridCols === 4 ? "bg-primary text-white" : "hover:bg-muted")}><LayoutGrid className="h-4 w-4" /></button>
              </div>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                  {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
          {showFilters && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Precio:</span>
                <Input type="number" placeholder="Min" value={priceRange[0] || ""} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-24 h-9" />
                <span>-</span>
                <Input type="number" placeholder="Max" value={priceRange[1] || ""} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-24 h-9" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showOnlyNew} onChange={(e) => setShowOnlyNew(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" /><span className="text-sm">Solo nuevos</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showOnlySale} onChange={(e) => setShowOnlySale(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" /><span className="text-sm">En oferta</span></label>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); setPriceRange([0, 100000]); setShowOnlyNew(false); setShowOnlySale(false); }} className="text-primary"><X className="h-4 w-4 mr-1" /> Limpiar</Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">Mostrando {filteredProducts.length} de {products.length} productos</p>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No encontramos productos</h3>
              <p className="text-muted-foreground mb-4">Intenta cambiar los filtros o buscar algo diferente</p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); setPriceRange([0, 100000]); setShowOnlyNew(false); setShowOnlySale(false); }}>Ver todos los productos</Button>
            </div>
          ) : (
            <div className={cn("grid gap-6", gridCols === 3 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
              {filteredProducts.map((product) => {
                const currentPrice = getProductPrice(product)
                const selectedVariant = getSelectedVariant(product)
                
                // CORRECCIÓN: Calcular el stock activo (Variante seleccionada -> Stock Global -> 0)
                const activeStock = selectedVariant?.stock ?? product.stock ?? 0

                return (
                  <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <ProductImages product={product} variantType={variantTypes[product.id] || null} />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.badge && <span className={cn("text-white text-xs font-bold px-3 py-1 rounded-full", product.badgeColor || "bg-accent")}>{product.badge.toUpperCase()}</span>}
                        {product.originalPrice && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>}
                      </div>
                      <button onClick={() => toggleFavorite(product.id)} className={cn("absolute top-3 right-3 p-2 rounded-full transition-all", favorites.includes(product.id) ? "bg-primary text-white" : "bg-white/80 hover:bg-white text-gray-600")}>
                        <Heart className={cn("h-5 w-5", favorites.includes(product.id) && "fill-current")} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                           <Button className={`shrink-0 h-8 w-8 md:h-8 md:w-auto md:px-3 md:text-xs transition-all ${addedProducts[product.id] ? 'bg-green-500 hover:bg-green-600' : 'bg-white hover:bg-white/90 text-primary'}`} size="icon" onClick={() => handleAddToCart(product)}>
                             {addedProducts[product.id] ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                             <span className="hidden md:inline ml-1 text-xs">Agregar</span>
                            </Button>
                            <Button
                              className="h-8 md:h-9 px-3 md:px-4 text-white bg-green-600 hover:bg-green-700 transition-all text-[11px] md:text-sm shrink-0"
                              size="sm"
                              onClick={() => {
                                setWhatsAppMessage(encodeURIComponent(`Hola, quiero pedir: ${product.name}${selectedVariant?.label ? ` - ${selectedVariant.label}` : ""}\nPrecio: ${formatPrice(currentPrice)}`))
                                setIsWhatsAppOpen(true)
                              }}
                           >
                             <MessageCircle className="h-4 w-4 md:mr-1.5" />
                             <span className="truncate">WhatsApp</span>
                           </Button>
                         </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium uppercase tracking-wide">{product.category}</span>
                      <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-2"><RatingSection productId={product.id} initialRating={product.rating} initialReviews={product.reviews} /></div>
                      {product.features && <div className="flex flex-wrap gap-1 mt-2">{product.features.map((feature, idx) => <span key={idx} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded">{feature}</span>)}</div>}
                      
                      {/* CORRECCIÓN: Renderizar el stock de la variante activa dinámicamente */}
                      {(selectedVariant?.stock !== undefined || product.stock !== undefined) && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {activeStock > 0 ? `Disponible: ${activeStock} unidades` : 'Agotado'}
                        </div>
                      )}

                      {product.adultVariants && product.childVariants && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1.5">Tipo:</p>
                          <div className="flex gap-1">
                            <button onClick={() => setVariantTypes(prev => ({ ...prev, [product.id]: "adult" }))} className={`px-3 py-1 text-xs rounded-md border transition-all ${variantTypes[product.id] !== "child" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>Adulto</button>
                            <button onClick={() => setVariantTypes(prev => ({ ...prev, [product.id]: "child" }))} className={`px-3 py-1 text-xs rounded-md border transition-all ${variantTypes[product.id] === "child" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>Niño</button>
                          </div>
                        </div>
                      )}
                       {product.adultVariants && product.childVariants && variantTypes[product.id]
                         ? getCurrentVariants(product).length > 0 && (
                             <div className="mb-3">
                               <p className="text-xs text-muted-foreground mb-1.5">Tamaño:</p>
                               <select
                                 value={selectedVariant?.id || getCurrentVariants(product)[0]?.id || ""}
                                 onChange={(e) => setSelectedVariants(prev => ({ ...prev, [product.id]: e.target.value }))}
                                 className="w-full text-xs border border-border rounded bg-white px-2 py-1.5"
                               >
                                 {Array.from(new Map(getCurrentVariants(product).map(v => [v.label, v])).values()).map((variant) => (
                                   <option key={variant.id} value={variant.id}>{variant.label}</option>
                                 ))}
                               </select>
                             </div>
                           )
                         : product.variants && product.variants.length > 0 && (
                             <div className="mb-3">
                               <p className="text-xs text-muted-foreground mb-1.5">Opción:</p>
                               <select
                                 value={selectedVariant?.id || product.variants![0]?.id || ""}
                                 onChange={(e) => setSelectedVariants(prev => ({ ...prev, [product.id]: e.target.value }))}
                                 className="w-full text-xs border border-border rounded bg-white px-2 py-1.5"
                               >
                                 {Array.from(new Map(product.variants.map(v => [v.label, v])).values()).map((variant) => (
                                   <option key={variant.id} value={variant.id}>{variant.label}</option>
                                 ))}
                               </select>
                             </div>
                           )}
                       <div className="flex items-center gap-2 mb-3 flex-wrap">
                         <div className="flex items-center gap-2">
                           <span className="text-xl font-bold text-primary">{formatPrice(currentPrice)}</span>
                           <span className="text-sm text-muted-foreground line-through">{formatPrice(Math.round(currentPrice * 1.4))}</span>
                         </div>
                       </div>
                      
                      {/* CORRECCIÓN: Validar el stock dinámico para el mensaje de urgencia */}
                      {stockPerVariant && activeStock !== undefined && activeStock > 0 && activeStock < 10 && (
                        <p className="text-xs text-orange-600 mt-1">Quedan pocas unidades de esta opción</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {category !== "floristeria" && filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="gap-2">Cargar más productos</Button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-pink-400 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Buscas un producto personalizado?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Creamos productos únicos para tu marca o evento especial. Desde 50 unidades con tu design exclusivo.</p>
          <Link href="/contacto"><Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">Solicitar cotización</Button></Link>
        </div>
      </section>

      <Footer />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} message={whatsAppMessage} />
    </main>
  )
}