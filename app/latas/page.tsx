import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado", "Arreglo GRATIS"]

const products = [
  {
    id: 301,
    name: "Lata Te Extraño",
    price: 18000,
    image: "/images/lata/2.webp",
    images: ["/images/lata/2.webp", "/images/peluches/arreglos/47.webp"],
    rating: 4.5,
    reviews: 63,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 45,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 302,
    name: "Lata Me Gustas",
    price: 18000,
    originalPrice: 28000,
    image: "/images/lata/4.webp",
    images: ["/images/lata/4.webp", "/images/peluches/arreglos/46.webp"],
    rating: 4.4,
    reviews: 51,
    features: FEATURES,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    stock: 38,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 303,
    name: "Lata TQM",
    price: 18000,
    image: "/images/lata/5.webp",
    images: ["/images/lata/5.webp", "/images/peluches/arreglos/45.webp"],
    rating: 4.6,
    reviews: 72,
    features: FEATURES,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    stock: 52,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 304,
    name: "Lata Te Amo",
    price: 18000,
    image: "/images/lata/7.webp",
    images: ["/images/lata/7.webp", "/images/peluches/arreglos/44.webp"],
    rating: 4.5,
    reviews: 58,
    features: FEATURES,
    stock: 28,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 305,
    name: "Lata Felicitaciones",
    price: 26000,
    originalPrice: 32000,
    image: "/images/lata/6.webp",
    images: ["/images/lata/6.webp", "/images/peluches/arreglos/43.webp"],
    rating: 4.4,
    reviews: 47,
    features: FEATURES,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    stock: 34,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 306,
    name: "Lata Los Simpsons",
    price: 23000,
    image: "/images/lata/3.webp",
    images: ["/images/lata/3.webp", "/images/peluches/arreglos/42.webp"],
    rating: 4.5,
    reviews: 55,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 40,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 16000 }
    ]
  },
  {
    id: 307,
    name: "Lata Futbol Portugal",
    price: 23000,
    image: "/images/lata/8.webp",
    images: ["/images/lata/8.webp", "/images/peluches/arreglos/41.webp"],
    rating: 4.4,
    reviews: 43,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 36,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 16000 }
    ]
  },
  {
    id: 308,
    name: "Lata Futbol Colombia",
    price: 23000,
    image: "/images/lata/1.webp",
    images: ["/images/lata/1.webp", "/images/lata/2.webp"],
    rating: 4.6,
    reviews: 68,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 42,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 16000 }
    ]
  },
  {
    id: 309,
    name: "Lata Futbol Brasil",
    price: 23000,
    image: "/images/lata/9.webp",
    images: ["/images/lata/9.webp", "/images/lata/10.webp"],
    rating: 4.5,
    reviews: 59,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 48,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 16000 }
    ]
  },
  {
    id: 310,
    name: "Lata Futbol Argentina",
    price: 18000,
    image: "/images/lata/10.webp",
    images: ["/images/lata/10.webp", "/images/lata/11.webp"],
    rating: 4.4,
    reviews: 44,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 32,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 311,
    name: "Lata Futbol Barcelona",
    price: 18000,
    image: "/images/lata/11.webp",
    images: ["/images/lata/11.webp", "/images/lata/12.webp"],
    rating: 4.5,
    reviews: 52,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 38,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
  {
    id: 312,
    name: "Lata Futbol Barcelona",
    price: 18000,
    image: "/images/lata/12.webp",
    images: ["/images/lata/12.webp", "/images/lata/1.webp"],
    rating: 4.3,
    reviews: 39,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 26,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 30000, wholesalePrice: 18000 }
    ]
  },
]

export default async function LatasPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 4) {
        stockMap.set(p.id, p.stock)
      }
      const variantRows = await getVariantsByProductId(p.id)
      if (variantRows.length > 0) {
        const variantMap = new Map<string, number>()
        for (const v of variantRows) {
          variantMap.set(v.label, v.stock)
        }
        variantStocksMap.set(p.id, variantMap)
      }
    }

    const productsWithStock = products.map(p => {
      const variants = p.variants ? p.variants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label)
        const productStock = stockMap.get(p.id) ?? 0
        const fallbackStock = p.variants!.length > 0 ? Math.floor(productStock / p.variants!.length) : 0
        return {
          ...v,
          stock: (storedVariantStock ?? (v as any).stock ?? fallbackStock)
        } as typeof v & { stock: number }
      }) : p.variants

      return {
        ...p,
        stock: variants ? variants.reduce((sum, v) => sum + ((v as any).stock ?? 0), 0) : (stockMap.get(p.id) ?? p.stock ?? 0),
        variants
      }
    })

    await Promise.all(
      productsWithStock
        .filter(p => p.variants && p.variants.length > 0)
        .map(p => upsertProductVariants(p.id, p.variants!.map(v => ({
          label: v.label,
          price: v.price,
          wholesalePrice: v.wholesalePrice,
          stock: v.stock ?? 0
        }))))
    )

    return (
      <CategoryPage
        title="Latas"
        description="Latas decorativas con disenos originales. Perfectas para guardar dulces, regalos o como decoracion."
        products={productsWithStock}
        category="latas"
        variantLabel="Tamaño"
        stockPerVariant
      />
    )
  } catch {
    const productsWithStock = products.map(p => {
      const variants = p.variants ? p.variants.map(v => ({
        ...v,
        stock: (v as any).stock ?? 0
      } as typeof v & { stock: number })) : p.variants
      return {
        ...p,
        stock: variants ? variants.reduce((sum, v) => sum + ((v as any).stock ?? 0), 0) : (p.stock ?? 0),
        variants
      }
    })
    return (
      <CategoryPage
        title="Latas"
        description="Latas decorativas con disenos originales. Perfectas para guardar dulces, regalos o como decoracion."
        products={productsWithStock}
        category="latas"
        variantLabel="Tamaño"
        stockPerVariant
      />
    )
  }
}