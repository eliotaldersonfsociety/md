"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { useCart } from "@/context/cart-context"
import { useGeolocation, formatPriceCurrency } from "@/lib/geolocation"
import { RatingSection } from "@/components/rating-section"
import { WhatsAppModal } from "@/components/whatsapp-modal"
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/json-ld"
import { buildProductSlug } from "@/lib/slugify"
import { ChevronRight, ShoppingCart, MessageCircle, Check, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductPageClientProps {
  product: {
    id: number
    name: string
    price: number
    wholesalePrice?: number
    originalPrice?: number
    image: string
    category: string
    stock: number
    badge?: string
    badgeColor?: string
    isNew?: boolean
    isSale?: boolean
    variants?: Array<{
      id: string
      label: string
      price: number
      wholesalePrice: number
      stock: number
    }>
    adultVariants?: Array<{
      id: string
      label: string
      price: number
      wholesalePrice: number
      stock: number
    }>
    childVariants?: Array<{
      id: string
      label: string
      price: number
      wholesalePrice: number
      stock: number
    }>
  }
  relatedProducts: Array<{
    id: number
    name: string
    price: number
    image: string
    category: string
  }>
  productSlug: string
}

export default function ProductPageClient({ product, relatedProducts, productSlug }: ProductPageClientProps) {
  const { addToCart } = useCart()
  const { isColombia } = useGeolocation()
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [variantType, setVariantType] = useState<"adult" | "child" | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")

  const currentVariants = variantType === "child"
    ? product.childVariants
    : variantType === "adult"
      ? product.adultVariants
      : product.variants

  const activeVariant = currentVariants?.find(v => v.id === selectedVariant) || currentVariants?.[0]
  const displayPrice = activeVariant?.price || product.price
  const displayStock = activeVariant?.stock ?? product.stock ?? 0

  useEffect(() => {
    if (currentVariants && currentVariants.length > 0 && !selectedVariant) {
      setSelectedVariant(currentVariants[0].id)
    }
  }, [currentVariants, selectedVariant])

  const handleAddToCart = () => {
    const finalPrice = activeVariant?.price || product.price
    addToCart({
      id: activeVariant ? parseInt(`${product.id}${activeVariant.id.replace(/\D/g, '')}`) : product.id,
      name: activeVariant ? `${product.name} - ${activeVariant.label}` : product.name,
      price: finalPrice,
      wholesalePrice: finalPrice,
      image: product.image,
      category: product.category,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWhatsApp = () => {
    const finalPrice = activeVariant?.price || product.price
    const variantLabel = activeVariant ? ` - ${activeVariant.label}` : ""
    const message = `Hola, quiero pedir: ${product.name}${variantLabel}\nPrecio: ${formatPriceCurrency(finalPrice, isColombia)}\nCantidad: ${quantity}`
    setWhatsAppMessage(encodeURIComponent(message))
    setIsWhatsAppOpen(true)
  }

  const formatPrice = (price: number) => formatPriceCurrency(price, isColombia)

  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
    { name: product.name, href: `/${product.category}/${productSlug}` },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <JsonLd
        data={productSchema({
          name: product.name,
          image: product.image,
          description: `${product.name} - ${product.category} original de Fábrica de Peluches Mundo Disney.`,
          price: activeVariant?.price || product.price,
          currency: "COP",
          availability: displayStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          brand: "Fábrica de Peluches Mundo Disney",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", item: "https://fabricadepeluchesmundodisney.com/" },
          { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), item: `https://fabricadepeluchesmundodisney.com/${product.category}` },
          { name: product.name, item: `https://fabricadepeluchesmundodisney.com/${product.category}/${product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}` },
        ])}
      />

      <section className="py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className={cn("text-white text-xs font-bold px-3 py-1 rounded-full", product.badgeColor || "bg-accent")}>
                    {product.badge.toUpperCase()}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-primary font-medium uppercase tracking-wide">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{product.name}</h1>

              <div className="mb-4">
                <RatingSection productId={product.id} initialRating={4.5} initialReviews={0} />
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">{formatPrice(displayPrice)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                Producto original de Fábrica de Peluches Mundo Disney. Ideal para regalar en cumpleaños, aniversarios y ocasiones especiales.
              </p>

              {product.variants && product.variants.length > 0 && !product.adultVariants && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Tamaño / Opción</label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full max-w-xs border border-border rounded-lg bg-white px-4 py-2.5 text-sm"
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.label} - {formatPrice(variant.price)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(product.adultVariants || product.childVariants) && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Tipo</label>
                  <div className="flex gap-2 mb-3">
                    {product.adultVariants && (
                      <button
                        onClick={() => setVariantType(variantType === "adult" ? null : "adult")}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          variantType === "adult"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        Adulto
                      </button>
                    )}
                    {product.childVariants && (
                      <button
                        onClick={() => setVariantType(variantType === "child" ? null : "child")}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          variantType === "child"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        Niño
                      </button>
                    )}
                  </div>

                  {(variantType === "adult" ? product.adultVariants : product.childVariants) && (
                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full max-w-xs border border-border rounded-lg bg-white px-4 py-2.5 text-sm"
                    >
                      {(variantType === "adult" ? product.adultVariants : product.childVariants)?.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.label} - {formatPrice(variant.price)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-muted-foreground">
                  {displayStock > 0 ? (
                    <span className="text-green-600 font-medium">Disponible: {displayStock} unidades</span>
                  ) : (
                    <span className="text-red-500 font-medium">Agotado</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button
                  size="lg"
                  className={cn("flex-1 gap-2", added ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90")}
                  onClick={handleAddToCart}
                  disabled={displayStock === 0}
                >
                  {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  {added ? "Agregado" : "Agregar al Carrito"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2 border-green-500 text-green-600 hover:bg-green-50"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </Button>
                <Button
                  size="lg"
                  className="flex-1 gap-1 bg-[#FFE600] text-black hover:bg-[#FFE600]/90"
                  onClick={() => {
                    const url = product.mercadolibre_url || `https://www.mercadolibre.com.co/jm/search?as_word=${encodeURIComponent(product.name)}`
                    window.open(url, '_blank')
                  }}
                >
                  MercadoLibre
                </Button>
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-medium text-foreground">Categoría:</span>
                  <Link href={`/${product.category}`} className="text-primary hover:underline">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </Link>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-medium text-foreground">Envíos:</span>
                  <span className="text-muted-foreground">A todo Colombia y Venezuela</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((related) => (
                <Link
                  key={related.id}
                  href={`/${related.category}/${buildProductSlug(related.name)}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-primary font-medium uppercase tracking-wide">{related.category}</span>
                    <h3 className="font-semibold text-sm mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {related.name}
                    </h3>
                    <p className="text-sm font-bold text-primary mt-2">{formatPrice(related.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-primary to-pink-400 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Buscas un producto personalizado?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Creamos productos únicos para tu marca o evento especial.</p>
          <Link href="/contacto"><Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">Solicitar cotización</Button></Link>
        </div>
      </section>

      <Footer />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} message={whatsAppMessage} />
    </main>
  )
}
