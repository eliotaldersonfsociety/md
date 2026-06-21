"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Check, Package, Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { allProducts } from "@/lib/products-data"
import { RatingSection } from "@/components/rating-section"
import { useUSDPrice } from "@/lib/exchange-rate"

const categoryProducts = allProducts.reduce((acc, product) => {
  if (!acc.find(p => p.category === product.category)) {
    acc.push(product)
  }
  return acc
}, [] as typeof allProducts)

function ProductCard({ product }: { product: typeof allProducts[0] }) {
  const { purchaseMode, addToCart, addToWholesale } = useCart()
  const { formatUSD } = useUSDPrice()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(3)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    const initialVariants = product.adultVariants?.length 
      ? product.adultVariants 
      : product.childVariants?.length 
        ? product.childVariants 
        : product.variants;
    return initialVariants && initialVariants.length > 0 ? initialVariants[0].id : null;
  })
  const [variantType, setVariantType] = useState<"adult" | "child" | null>(null)

  const getCurrentVariants = (): typeof allProducts[0]["variants"] => {
    if (variantType === "child") return product.childVariants || []
    if (variantType === "adult") return product.adultVariants || []
    return product.variants || []
  }

  const selectedVariant = getCurrentVariants()?.find(v => v.id === selectedVariantId) || null

  const handleAddToCart = () => {
    const variant = selectedVariant || null
    const variantLabel = variant ? variant.label : ""
    const baseId = product.id
    const finalPrice = variant ? variant.price : product.price
    const finalWholesalePrice = variant ? variant.wholesalePrice : (product.wholesalePrice ?? Math.round(product.price * 0.7))
    const productImage = product.image || "/images/placeholder.webp"

    const variantProduct = {
      ...product,
      productId: product.id,
      id: variant ? (parseInt(variant.id.replace(/\D/g, '') || '0') ? parseInt(variant.id.replace(/\D/g, '') || '0') + baseId : baseId) : baseId,
      name: `${product.name}${variantLabel ? ` - ${variantLabel}` : ''}`,
      price: finalPrice,
      wholesalePrice: finalWholesalePrice,
      category: product.category || '',
      image: productImage,
    }
    if (purchaseMode === "retail") {
      addToCart(variantProduct)
    } else {
      addToWholesale(variantProduct, quantity)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const isWholesale = purchaseMode === "wholesale"
  const displayPrice = selectedVariant
    ? (isWholesale ? selectedVariant.wholesalePrice : selectedVariant.price)
    : (isWholesale ? (product.wholesalePrice ?? Math.round(product.price * 0.7)) : product.price)

  const showDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = showDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
        <Image
          src={product.image || "/images/logo.webp"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4">
        <span className="text-xs text-primary font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
<div className="mt-2">
          <RatingSection productId={product.id} />
        </div>
         
        {product.features && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.features.filter(feature => purchaseMode === "retail" || feature !== "Arreglo GRATIS").map((feature, idx) => (
              <span key={idx} className={`text-xs px-2 py-0.5 rounded ${feature === "Arreglo GRATIS" ? "bg-green-100 text-green-700 font-bold" : "bg-muted/50 text-muted-foreground"}`}>{feature}</span>
            ))}
          </div>
        )}
         
{/* Variant Type Selector (Adulto/Niño) */}
         {product.adultVariants && product.childVariants && (
           <div className="mt-2">
             <p className="text-xs text-muted-foreground mb-1">Tipo:</p>
             <div className="flex gap-1">
               <button
                 onClick={() => setVariantType("adult")}
                 className={`px-3 py-1 text-xs rounded-md border transition-all ${
                   variantType !== "child"
                     ? isWholesale
                       ? "border-green-500 bg-green-50 text-green-700"
                       : "border-primary bg-primary/10 text-primary"
                     : "border-border hover:border-primary/50"
                 }`}
               >
                 Adulto
               </button>
               <button
                 onClick={() => setVariantType("child")}
                 className={`px-3 py-1 text-xs rounded-md border transition-all ${
                   variantType === "child"
                     ? isWholesale
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

{/* Variant Selector - show after type selection for ropa, or directly for other products */}
          {product.adultVariants && product.childVariants && variantType !== null
            ? (getCurrentVariants() || []).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Tamaño:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Map((getCurrentVariants() || []).map(v => [v.label, v])).values()).map((variant) => (
                     <button
                       key={variant.id}
                       onClick={() => setSelectedVariantId(variant.id)}
                       className={`px-2 py-1 text-xs rounded-md border transition-all ${
                         selectedVariant?.id === variant.id
                           ? isWholesale
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
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Tamaño:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Map(product.variants.map(v => [v.label, v])).values()).map((variant) => (
                     <button
                       key={variant.id}
                       onClick={() => setSelectedVariantId(variant.id)}
                       className={`px-2 py-1 text-xs rounded-md border transition-all ${
                         selectedVariant?.id === variant.id
                           ? isWholesale
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

        {/* Quantity selector for wholesale */}
        {isWholesale && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setQuantity(q => Math.max(3, q - 1))}
              disabled={quantity <= 3}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center font-medium text-sm">
              {quantity} uds
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setQuantity(q => q + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {/* Stock indicator */}
        {product.stock !== undefined && !selectedVariant && (
          <div className="text-xs text-muted-foreground mt-2">
            {product.stock > 0 
              ? `Disponible: ${product.stock} unidades` 
              : 'Agotado'}
          </div>
        )}
        {selectedVariant && (
          <div className="text-xs text-muted-foreground mt-2">
            {selectedVariant.stock !== undefined && selectedVariant.stock > 0
              ? `Disponible: ${selectedVariant.stock} uds. (${selectedVariant.label})`
              : `Agotado (${selectedVariant.label})`}
          </div>
        )}

         <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
           <div className="flex items-center gap-2 flex-wrap">
             <span className={`text-xl font-bold ${isWholesale ? "text-green-600" : "text-primary"}`}>
               {formatPrice(displayPrice)}
             </span>
             <span className="text-xs text-muted-foreground">
               {formatUSD(displayPrice)}
             </span>
             {showDiscount && !isWholesale && (
               <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground line-through">
                   {formatPrice(product.originalPrice!)}
                 </span>
                 <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
                   -{discountPercent}%
                 </span>
               </div>
             )}
           </div>
          {isWholesale && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Mayorista
            </span>
          )}
          {!isWholesale && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Al Detal
            </span>
          )}
        </div>

        <Button 
          className={`w-full mt-3 transition-all ${added ? 'bg-green-500' : isWholesale ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white`}
          onClick={handleAddToCart}
        >
          {added ? <><Check className="h-4 w-4 mr-1" /> Agregado</> : isWholesale ? 'Agregar al pedido' : 'Agregar'}
        </Button>
      </div>
    </div>
  )
}

export function ProductsSection({ products }: { products?: typeof allProducts[0][] }) {
  const displayProducts = products || categoryProducts
  const { purchaseMode, setPurchaseMode } = useCart()
  return (
    <section id="productos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nuestros Productos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Categorias Destacadas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un producto representativo de cada categoria
          </p>
        </div>

        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex items-center bg-muted/50 rounded-full p-1 border border-border">
            <button
              onClick={() => setPurchaseMode("retail")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                purchaseMode === "retail"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Al Detal
            </button>
            <button
              onClick={() => setPurchaseMode("wholesale")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                purchaseMode === "wholesale"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Al Mayor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tienda">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white">
              Ver Todos los Productos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
