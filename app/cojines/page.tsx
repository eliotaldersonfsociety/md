import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]

const products = [
  {
    id: 201,
    name: "Cojin Corazon Lo Lograstes",
    price: 35000,
    originalPrice: 42000,
    image: "/images/cojines/1.webp",
    rating: 4.6,
    reviews: 65,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "peq", label: "Pequeno - 25cm", price: 15000, wholesalePrice: 8000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 22000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 202,
    name: "Cojin Corazon Felicitaciones",
    price: 38000,
    image: "/images/cojines/2.webp",
    rating: 4.5,
    reviews: 58,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 28,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 19000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 24000 },
    ]
  },
  {
    id: 203,
    name: "Cojin Corazon Feliz Dia Mama",
    price: 32000,
    image: "/images/cojines/3.webp",
    rating: 4.7,
    reviews: 91,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    features: FEATURES,
    stock: 35,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 16000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 20000 },
    ]
  },
  {
    id: 204,
    name: "Cojin Corazon Me Gustas",
    price: 45000,
    image: "/images/cojines/4.webp",
    rating: 4.6,
    reviews: 74,
    features: FEATURES,
    stock: 26,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 22000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 28000 },
    ]
  },
  {
    id: 205,
    name: "Cojin Corazon Me Gustas",
    price: 42000,
    originalPrice: 50000,
    image: "/images/cojines/5.webp",
    rating: 4.5,
    reviews: 62,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    stock: 22,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 21000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 26000 },
    ]
  },
  {
    id: 206,
    name: "Cojin Corazon Te Amo",
    price: 48000,
    image: "/images/cojines/6.webp",
    rating: 4.7,
    reviews: 78,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 18,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 207,
    name: "Cojin Corazon Te Quiero",
    price: 48000,
    image: "/images/cojines/7.webp",
    rating: 4.6,
    reviews: 69,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 24,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 208,
    name: "Cojin Corazon Feliz Dia",
    price: 48000,
    image: "/images/cojines/8.webp",
    rating: 4.5,
    reviews: 55,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 19,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 209,
    name: "Cojin Corazon TQM",
    price: 48000,
    image: "/images/cojines/9.webp",
    rating: 4.6,
    reviews: 66,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 17,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 210,
    name: "Cojin Corazon Eres Especial",
    price: 48000,
    image: "/images/cojines/10.webp",
    rating: 4.5,
    reviews: 53,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 21,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 211,
    name: "Cojin Corazon Feliz Cumpleaños",
    price: 48000,
    image: "/images/cojines/11.webp",
    rating: 4.6,
    reviews: 67,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 15,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 212,
    name: "Cojin Corazon Te Extraño",
    price: 48000,
    image: "/images/cojines/12.webp",
    rating: 4.5,
    reviews: 59,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 13,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 2120,
    name: "Cojin Corazon Eres Tu",
    price: 48000,
    image: "/images/cojines/17.webp",
    rating: 4.4,
    reviews: 47,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 10,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 2121,
    name: "Cojin Corazon Eres mi Felicidad",
    price: 48000,
    image: "/images/cojines/18.webp",
    rating: 4.5,
    reviews: 56,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 14,
    variants: [
      { id: "peq", label: "Pequeño - 25cm", price: 10000, wholesalePrice: 24000 },
      { id: "gra", label: "Grande - 35cm", price: 15000, wholesalePrice: 30000 },
    ]
  },
  {
    id: 213,
    name: "Cojin Cuadrado Portugal",
    price: 48000,
    image: "/images/cojines/13.webp",
    rating: 4.4,
    reviews: 42,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 25,
    variants: [
      { id: "gra", label: "Grande - 35cm", price: 22000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 214,
    name: "Cojin Cuadrado Argentina",
    price: 48000,
    image: "/images/cojines/14.webp",
    rating: 4.3,
    reviews: 38,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 28,
    variants: [
      { id: "gra", label: "Grande - 35cm", price: 22000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 215,
    name: "Cojin Cuadrado Colombia",
    price: 48000,
    image: "/images/cojines/15.webp",
    rating: 4.4,
    reviews: 45,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 22,
    variants: [
      { id: "gra", label: "Grande - 35cm", price: 22000, wholesalePrice: 15000 },
    ]
  },
  {
    id: 216,
    name: "Cojin Cuadrado Brasil",
    price: 48000,
    image: "/images/cojines/16.webp",
    rating: 4.5,
    reviews: 51,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 30,
    variants: [
      { id: "gra", label: "Grande - 35cm", price: 22000, wholesalePrice: 15000 },
    ]
  },
]

export default async function CojinesPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 3) {
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
        stock: variants ? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0) : (stockMap.get(p.id) ?? p.stock ?? 0),
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
        title="Cojines"
        description="Cojines decorativos y comodos para tu hogar. Diseños unicos que llenan de vida cualquier espacio."
        products={productsWithStock}
        category="cojines"
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
        title="Cojines"
        description="Cojines decorativos y comodos para tu hogar. Diseños unicos que llenan de vida cualquier espacio."
        products={productsWithStock}
        category="cojines"
        variantLabel="Tamaño"
        stockPerVariant
      />
    )
  }
}