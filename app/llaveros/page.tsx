import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const products = [
  {
    id: 501,
    name: "Llavero Surtidos",
    price: 30000,
    image: "/images/llaveros/1.webp",
    rating: 4.4,
    reviews: 42,
    features: ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado", "Arreglo GRATIS"],
    images: [
      "/images/llaveros/1.webp",
      "/images/llaveros/2.webp",
    ],
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    stock: 100,
    variants: [
      { id: "v20", label: "Paquete 20 unidades", price: 30000, wholesalePrice: 20000, stock: 50 },
      { id: "v40", label: "Paquete 40 unidades", price: 60000, wholesalePrice: 40000, stock: 50 },
    ]
  },
   
]

export default async function LlaverosPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 1) {
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
          stock: (storedVariantStock ?? v.stock ?? fallbackStock)
        }
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
        title="Llaveros"
        description="Mini llaveros para llevar tus personajes favoritos a todas partes. Ideales para mochilas y carteras de 10cm x 10cm."
        products={productsWithStock}
        category="llaveros"
        variantLabel="Presentación"
        stockPerVariant
        showLoadMore={false}
      />
    )
  } catch {
    const productsWithStock = products.map(p => {
      const variants = p.variants ? p.variants.map(v => ({
        ...v,
        stock: v.stock ?? 0
      })) : p.variants
      return {
        ...p,
        stock: variants ? variants.reduce((sum, v) => sum + (v.stock ?? 0), 0) : (p.stock ?? 0),
        variants
      }
    })
    return (
      <CategoryPage
        title="Llaveros"
        description="Mini llaveros para llevar tus personajes favoritos a todas partes. Ideales para mochilas y carteras de 10cm x 10cm."
        products={productsWithStock}
        category="llaveros"
        variantLabel="Presentación"
        stockPerVariant
        showLoadMore={false}
      />
    )
  }
}
