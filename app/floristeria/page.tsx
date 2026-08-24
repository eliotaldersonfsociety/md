import type { Metadata } from "next"
import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

export const metadata: Metadata = {
  title: "Floristería | Fábrica de Peluches Mundo Disney",
  description: "Arreglos florales frescos y elegantes para cada ocasión. Envíos a Cúcuta, Rubio, San Antonio del Táchira y más.",
  canonical: "/floristeria",
}

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]

const products = [
  {
    id: 601,
    name: "Arreglo Milo Gato",
    price: 35000,
    image: "/images/arreglos/peluches/1.webp",
    rating: 4.6,
    reviews: 32,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 602,
    name: "Arreglo Mimi Gata",
    price: 42000,
    originalPrice: 52000,
    image: "/images/arreglos/peluches/2.webp",
    rating: 4.7,
    reviews: 28,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 603,
    name: "Arreglo Bubu Mono",
    price: 38000,
    image: "/images/arreglos/peluches/3.webp",
    rating: 4.5,
    reviews: 22,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 604,
    name: "Arreglo Lala Mona",
    price: 36000,
    originalPrice: 46000,
    image: "/images/arreglos/peluches/4.webp",
    rating: 4.6,
    reviews: 19,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 605,
    name: "Arreglo Dodo Conejo",
    price: 34000,
    image: "/images/arreglos/peluches/5.webp",
    rating: 4.5,
    reviews: 25,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 606,
    name: "Arreglo Buny Coneja",
    price: 33000,
    originalPrice: 42000,
    image: "/images/arreglos/peluches/6.webp",
    rating: 4.4,
    reviews: 18,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 607,
    name: "Arreglo Max Perro",
    price: 37000,
    image: "/images/arreglos/peluches/7.webp",
    rating: 4.5,
    reviews: 20,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 608,
    name: "Arreglo Kira Perra",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/8.webp",
    rating: 4.4,
    reviews: 16,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 609,
    name: "Arreglo Roco Toro",
    price: 39000,
    image: "/images/arreglos/peluches/9.webp",
    rating: 4.6,
    reviews: 21,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 610,
    name: "Arreglo Mura Vaca",
    price: 32000,
    originalPrice: 40000,
    image: "/images/arreglos/peluches/10.webp",
    rating: 4.5,
    reviews: 17,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 611,
    name: "Arreglo Nube Oveja",
    price: 36000,
    image: "/images/arreglos/peluches/11.webp",
    rating: 4.6,
    reviews: 23,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 612,
    name: "Arreglo Kimi Oveja",
    price: 34000,
    originalPrice: 43000,
    image: "/images/arreglos/peluches/12.webp",
    rating: 4.4,
    reviews: 15,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 613,
    name: "Arreglo Gino Jirafa",
    price: 38000,
    image: "/images/arreglos/peluches/13.webp",
    rating: 4.5,
    reviews: 19,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 614,
    name: "Arreglo Jira Jirafa",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/14.webp",
    rating: 4.4,
    reviews: 14,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 615,
    name: "Arreglo Drako Dragon",
    price: 40000,
    image: "/images/arreglos/peluches/15.webp",
    rating: 4.6,
    reviews: 24,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 616,
    name: "Arreglo Drini Dragon",
    price: 42000,
    originalPrice: 52000,
    image: "/images/arreglos/peluches/16.webp",
    rating: 4.7,
    reviews: 27,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 617,
    name: "Arreglo Orejon Conejo Nino",
    price: 36000,
    image: "/images/arreglos/peluches/17.webp",
    rating: 4.5,
    reviews: 20,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 618,
    name: "Arreglo Orejon Coneja Nina",
    price: 34000,
    originalPrice: 43000,
    image: "/images/arreglos/peluches/18.webp",
    rating: 4.4,
    reviews: 16,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 619,
    name: "Arreglo Orejon Perro Nino",
    price: 37000,
    image: "/images/arreglos/peluches/19.webp",
    rating: 4.5,
    reviews: 22,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 620,
    name: "Arreglo Orejon Perra Nina",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/20.webp",
    rating: 4.4,
    reviews: 17,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 621,
    name: "Arreglo Mia la Osa",
    price: 45000,
    image: "/images/arreglos/peluches/21.webp",
    rating: 4.9,
    reviews: 30,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 622,
    name: "Arreglo Sam el Oso",
    price: 44000,
    originalPrice: 54000,
    image: "/images/arreglos/peluches/22.webp",
    rating: 4.9,
    reviews: 29,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
]

export default async function FloristeriaPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 7) {
        stockMap.set(p.id, p.stock)
      }
      const variantRows = await getVariantsByProductId(p.id)
      if (variantRows.length > 0) {
        const variantMap = new Map<string, number>()
        for (const v of variantRows) {
          variantMap.set(v.label.trim(), v.stock)
        }
        variantStocksMap.set(p.id, variantMap)
      }
    }

    const productsWithStock = products.map(p => {
      const variants = p.variants ? p.variants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label.trim())
        const productStock = stockMap.get(p.id) ?? 0
        const fallbackStock = p.variants!.length > 0 ? Math.floor(productStock / p.variants!.length) : 0
        return {
          ...v,
          stock: (storedVariantStock ?? (v as any).stock ?? fallbackStock)
        } as typeof v & { stock: number }
      }) : p.variants

      return {
        ...p,
        stock: variants ? variants.reduce((sum, v) => sum + ((v as any).stock ?? 0), 0) : (stockMap.get(p.id) ?? 0),
        variants
      }
    })

    await Promise.all(
      productsWithStock
        .filter(p => p.variants && p.variants.length > 0)
        .map(p => upsertProductVariants(p.id, p.variants!.map(v => ({
          label: v.label,
          price: v.price,
          wholesalePrice: (v as any).wholesalePrice,
          stock: (v as any).stock ?? 0
        }))))
    )

    return (
      <CategoryPage
        title="Floristeria"
        description="Arreglos florales frescos y elegantes para cada ocasion. Envios a todo el pais."
        products={productsWithStock}
        category="floristeria"
      />
    )
  } catch {
    return (
      <CategoryPage
        title="Floristeria"
        description="Arreglos florales frescos y elegantes para cada ocasion. Envios a todo el pais."
        products={products}
        category="floristeria"
      />
    )
  }
}







