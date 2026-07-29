import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]

const products = [
  {
    id: 701,
    name: "Hoodie Dragona",
    price: 99000,
    originalPrice: 99000,
    image: "/images/ropa/1.webp",
    rating: 4.7,
    reviews: 85,
    adultImages: [
      "/images/ropa/1.webp",
      "/images/ropa/2.webp",
      "/images/ropa/3.webp",
      "/images/ropa/4.webp",
      "/images/ropa/5.webp",
    ],
    childImages: [
      "/images/ropa/6.webp",
      "/images/ropa/7.webp",
      "/images/ropa/4.webp",
      "/images/ropa/5.webp",
    ],
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    stock: 90,
    adultVariants: [
      { id: "a-s", label: "S", price: 90000, wholesalePrice: 60000 },
      { id: "a-m", label: "M", price: 90000, wholesalePrice: 60000 },
      { id: "a-l", label: "L", price: 90000, wholesalePrice: 60000 },
      { id: "a-xl", label: "XL", price: 90000, wholesalePrice: 60000 },
    ],
    childVariants: [
      { id: "n-4", label: "4", price: 60000, wholesalePrice: 40000 },
      { id: "n-6", label: "6", price: 60000, wholesalePrice: 40000 },
      { id: "n-8", label: "8", price: 60000, wholesalePrice: 40000 },
      { id: "n-10", label: "10", price: 60000, wholesalePrice: 40000 },
      { id: "n-12", label: "12", price: 60000, wholesalePrice: 40000 },
    ]
  }
]

export default async function RopaPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 6) {
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
      const variantCount = (p.adultVariants?.length || 0) + (p.childVariants?.length || 0)
      const adultVariants = p.adultVariants ? p.adultVariants.map(v => {
        const stored = variantStocksMap.get(p.id)?.get(v.label)
        const fallback = variantCount > 0 ? Math.floor((stockMap.get(p.id) ?? 0) / variantCount) : 0
        return { ...v, stock: (stored ?? fallback) }
      }) : p.adultVariants

      const childVariants = p.childVariants ? p.childVariants.map(v => {
        const stored = variantStocksMap.get(p.id)?.get(v.label)
        const fallback = variantCount > 0 ? Math.floor((stockMap.get(p.id) ?? 0) / variantCount) : 0
        return { ...v, stock: (stored ?? fallback) }
      }) : p.childVariants

      const totalStock = [...(adultVariants || []), ...(childVariants || [])].reduce((sum, v) => sum + (v.stock ?? 0), 0)

      return { ...p, stock: totalStock, adultVariants, childVariants }
    })

    return (
      <CategoryPage
        title="Ropa"
        description="Descubre nuestra coleccion de hoodies tiernos y suaves. Perfectos para regalar o para consentirte."
        products={productsWithStock}
        category="ropa"
        variantLabel="Tamaño"
        stockPerVariant
      />
    )
  } catch {
    return (
      <CategoryPage
        title="Ropa"
        description="Descubre nuestra coleccion de hoodies tiernos y suaves. Perfectos para regalar o para consentirte."
        products={[]}
        category="ropa"
        variantLabel="Tamaño"
        stockPerVariant
      />
    )
  }
}
