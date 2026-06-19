import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado", "Arreglo GRATIS"]

const products = [
  {
    id: 419,
    name: "Cervical Eres Tu",
    price: 18000,
    image: "/images/cervicales/20.webp",
    images: ["/images/cervicales/20.webp", "/images/cervicales/1.webp"],
    rating: 4.5,
    reviews: 65,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 48,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 420,
    name: "Cervical Mi Felicidad",
    price: 18000,
    image: "/images/cervicales/19.jpeg",
    images: ["/images/cervicales/19.jpeg", "/images/cervicales/20.webp"],
    rating: 4.7,
    reviews: 82,
    features: FEATURES,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    stock: 55,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 406,
    name: "Cervical Te Quiero",
    price: 18000,
    image: "/images/cervicales/6.webp",
    images: ["/images/cervicales/6.webp", "/images/cervicales/7.webp"],
    rating: 4.6,
    reviews: 72,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 50,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 407,
    name: "Cervical Feliz Dia Mama",
    price: 18000,
    image: "/images/cervicales/7.webp",
    images: ["/images/cervicales/7.webp", "/images/cervicales/8.webp"],
    rating: 4.5,
    reviews: 84,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 45,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 408,
    name: "Cervical TQM",
    price: 18000,
    image: "/images/cervicales/8.webp",
    images: ["/images/cervicales/8.webp", "/images/cervicales/9.webp"],
    rating: 4.7,
    reviews: 91,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-primary",
    stock: 60,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 409,
    name: "Cervical Eres Especial",
    price: 18000,
    image: "/images/cervicales/9.webp",
    images: ["/images/cervicales/9.webp", "/images/cervicales/10.webp"],
    rating: 4.5,
    reviews: 68,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 40,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 410,
    name: "Cervical Eres Especial",
    price: 18000,
    image: "/images/cervicales/10.webp",
    images: ["/images/cervicales/10.webp", "/images/cervicales/11.webp"],
    rating: 4.4,
    reviews: 52,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 35,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 411,
    name: "Cervical Lo Lograstes",
    price: 18000,
    image: "/images/cervicales/11.webp",
    images: ["/images/cervicales/11.webp", "/images/cervicales/12.webp"],
    rating: 4.6,
    reviews: 71,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 48,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 412,
    name: "Cervical Felicitaciones",
    price: 18000,
    image: "/images/cervicales/12.webp",
    images: ["/images/cervicales/12.webp", "/images/cervicales/13.webp"],
    rating: 4.5,
    reviews: 63,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 38,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 413,
    name: "Cervical Feliz Dia",
    price: 18000,
    image: "/images/cervicales/13.webp",
    images: ["/images/cervicales/13.webp", "/images/cervicales/14.webp"],
    rating: 4.4,
    reviews: 48,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 42,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 414,
    name: "Cervical Bienvenido a la Familia",
    price: 18000,
    image: "/images/cervicales/14.webp",
    images: ["/images/cervicales/14.webp", "/images/cervicales/15.webp"],
    rating: 4.5,
    reviews: 55,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 44,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 415,
    name: "Cervical Me Gustas",
    price: 18000,
    image: "/images/cervicales/15.webp",
    images: ["/images/cervicales/15.webp", "/images/cervicales/16.webp"],
    rating: 4.6,
    reviews: 67,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 52,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 416,
    name: "Cervical Feliz Cumple Años",
    price: 18000,
    image: "/images/cervicales/16.webp",
    images: ["/images/cervicales/16.webp", "/images/cervicales/17.webp"],
    rating: 4.4,
    reviews: 42,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 36,
    variants: [
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 417,
    name: "Cervical Te Amo",
    price: 18000,
    image: "/images/cervicales/17.webp",
    images: ["/images/cervicales/17.webp", "/images/cervicales/18.webp"],
    rating: 4.7,
    reviews: 88,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 46,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
  {
    id: 401,
    name: "Cervical Futbol Brasil",
    price: 15000,
    originalPrice: 20000,
    image: "/images/cervicales/1.webp",
    images: ["/images/cervicales/1.webp", "/images/cervicales/2.webp"],
    rating: 4.5,
    reviews: 76,
    features: FEATURES,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    stock: 45,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 402,
    name: "Cervical Futbol Colombia",
    price: 15000,
    image: "/images/cervicales/2.webp",
    images: ["/images/cervicales/2.webp", "/images/cervicales/3.webp"],
    rating: 4.4,
    reviews: 59,
    features: FEATURES,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    stock: 55,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 403,
    name: "Cervical Futbol Argentina",
    price: 50000,
    originalPrice: 15000,
    image: "/images/cervicales/3.webp",
    images: ["/images/cervicales/3.webp", "/images/cervicales/4.webp"],
    rating: 4.3,
    reviews: 45,
    features: FEATURES,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    stock: 32,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 405,
    name: "Cervical Futbol Portugal",
    price: 15000,
    originalPrice: 58000,
    image: "/images/cervicales/5.webp",
    images: ["/images/cervicales/5.webp", "/images/cervicales/6.webp"],
    rating: 4.5,
    reviews: 64,
    features: FEATURES,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    stock: 38,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 418,
    name: "Cervical Futbol Barcelona",
    price: 15000,
    originalPrice: 58000,
    image: "/images/cervicales/18.webp",
    images: ["/images/cervicales/18.webp", "/images/cervicales/19.jpeg"],
    rating: 4.4,
    reviews: 51,
    features: FEATURES,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    stock: 28,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 404,
    name: "Cervical Futbol Real Madrid",
    price: 15000,
    image: "/images/cervicales/4.webp",
    images: ["/images/cervicales/4.webp", "/images/cervicales/5.webp"],
    rating: 4.6,
    reviews: 73,
    features: FEATURES,
    stock: 40,
    variants: [
      { id: "sin", label: "Sin Antifaz", price: 25000, wholesalePrice: 15000 },
      { id: "con", label: "Con Antifaz", price: 30000, wholesalePrice: 18000 },
    ]
  },
]

export default async function CervicalesPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 5) {
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
          stock: (storedVariantStock ?? ((v as any).stock) ?? fallbackStock)
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
        title="Cervicales"
        description="Almohadas cervicales para viajes y descanso. Diseños tiernos que te acompañan a donde vayas."
        products={productsWithStock}
        category="cervicales"
        variantLabel="Tipo"
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
        title="Cervicales"
        description="Almohadas cervicales para viajes y descanso. Diseños tiernos que te acompañan a donde vayas."
        products={productsWithStock}
        category="cervicales"
        variantLabel="Tipo"
        stockPerVariant
      />
    )
  }
}