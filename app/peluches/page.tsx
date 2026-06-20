import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado", "Arreglo GRATIS"]

const products = [
  {
    id: 101,
    name: "Peluche Milo Gato",
    price: 45000,
    image: "/images/peluches/1.webp",
    images: ["/images/peluches/1.webp", "/images/peluches/arreglos/1.webp"],
    rating: 4.8,
    reviews: 128,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 102,
    name: "Peluche Mimi Gata",
    price: 52000,
    image: "/images/peluches/2.webp",
    images: ["/images/peluches/2.webp", "/images/peluches/arreglos/3.webp"],
    rating: 4.7,
    reviews: 95,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 103,
    name: "Peluche Bubu Mono",
    price: 68000,
    image: "/images/peluches/3.webp",
    images: ["/images/peluches/3.webp", "/images/peluches/arreglos/2.webp"],
    rating: 4.6,
    reviews: 82,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 104,
    name: "Peluche Lala Mona",
    price: 55000,
    image: "/images/peluches/4.webp",
    images: ["/images/peluches/4.webp", "/images/peluches/arreglos/4.webp"],
    rating: 4.5,
    reviews: 67,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 105,
    name: "Peluche Dodo Conejo",
    price: 48000,
    image: "/images/peluches/5.webp",
    images: ["/images/peluches/5.webp", "/images/peluches/arreglos/5.webp"],
    rating: 4.6,
    reviews: 73,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 106,
    name: "Peluche Buny Coneja",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/6.webp",
    images: ["/images/peluches/6.webp", "/images/peluches/arreglos/6.webp"],
    rating: 4.4,
    reviews: 58,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 107,
    name: "Peluche Max Perro",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/7.webp",
    images: ["/images/peluches/7.webp", "/images/peluches/arreglos/7.webp"],
    rating: 4.5,
    reviews: 61,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 108,
    name: "Peluche Kira Perra",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/8.webp",
    images: ["/images/peluches/8.webp", "/images/peluches/arreglos/8.webp"],
    rating: 4.5,
    reviews: 55,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 109,
    name: "Peluche Roco Toro",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/9.webp",
    images: ["/images/peluches/9.webp", "/images/peluches/arreglos/9.webp"],
    rating: 4.4,
    reviews: 49,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 110,
    name: "Peluche Mura Vaca",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/10.webp",
    images: ["/images/peluches/10.webp", "/images/peluches/arreglos/10.webp"],
    rating: 4.5,
    reviews: 52,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 111,
    name: "Peluche Nube Oveja",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/11.webp",
    images: ["/images/peluches/11.webp", "/images/peluches/arreglos/12.webp"],
    rating: 4.6,
    reviews: 63,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 112,
    name: "Peluche Kimi Oveja",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/12.webp",
    images: ["/images/peluches/12.webp", "/images/peluches/arreglos/11.webp"],
    rating: 4.4,
    reviews: 47,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 113,
    name: "Peluche Gino Jirafa",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/13.webp",
    images: ["/images/peluches/13.webp", "/images/peluches/arreglos/13.webp"],
    rating: 4.5,
    reviews: 56,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 114,
    name: "Peluche Jira Jirafa",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/14.webp",
    images: ["/images/peluches/14.webp", "/images/peluches/arreglos/14.webp"],
    rating: 4.4,
    reviews: 44,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 115,
    name: "Peluche Drako Dragon",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/15.webp",
    images: ["/images/peluches/15.webp", "/images/peluches/arreglos/15.webp"],
    rating: 4.6,
    reviews: 69,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 116,
    name: "Peluche Drini Dragon",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/16.webp",
    images: ["/images/peluches/16.webp", "/images/peluches/arreglos/16.webp"],
    rating: 4.7,
    reviews: 71,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 20000 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 26000 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 40000 },
    ]
  },
  {
    id: 117,
    name: "Peluche Orejon Conejo Nino",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/17.webp",
    images: ["/images/peluches/17.webp", "/images/peluches/arreglos/17.webp"],
    rating: 4.5,
    reviews: 53,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 118,
    name: "Peluche Orejon Coneja Nina",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/18.webp",
    images: ["/images/peluches/18.webp", "/images/peluches/arreglos/18.webp"],
    rating: 4.4,
    reviews: 48,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 119,
    name: "Peluche Orejon Perro Nino",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/19.webp",
    images: ["/images/peluches/19.webp", "/images/peluches/arreglos/19.webp"],
    rating: 4.5,
    reviews: 51,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 120,
    name: "Peluche Orejon Perra Nina",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/20.webp",
    images: ["/images/peluches/20.webp", "/images/peluches/arreglos/20.webp"],
    rating: 4.4,
    reviews: 46,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 121,
    name: "Peluche Mia la Osa",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/78.webp",
    images: ["/images/peluches/78.webp", "/images/peluches/arreglos/22.webp"],
    rating: 4.4,
    reviews: 46,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
  {
    id: 122,
    name: "Peluche Sam el Oso",
    price: 42000,
    originalPrice: 50000,
    image: "/images/peluches/79.webp",
    images: ["/images/peluches/79.webp", "/images/peluches/arreglos/21.webp"],
    rating: 4.4,
    reviews: 46,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "v2", label: "#2 - 40cm", price: 70000, wholesalePrice: 50000, stock: 20 },
      { id: "v3", label: "#3 - 60cm", price: 130000, wholesalePrice: 98000, stock: 15 },
      { id: "v4", label: "#4 - 100cm", price: 160000, wholesalePrice: 120000, stock: 5 },
    ]
  },
]

export default async function PeluchesPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 2) {
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
        title="Peluches"
        description="Descubre nuestra coleccion de peluches tiernos y suaves. Perfectos para regalar o para consentirte."
        products={productsWithStock}
        category="peluches"
        variantLabel="Tamaño"
        stockPerVariant
        showLoadMore={false}
      />
    )
  } catch {
    return (
      <CategoryPage
        title="Peluches"
        description="Descubre nuestra coleccion de peluches tiernos y suaves. Perfectos para regalar o para consentirte."
        products={products}
        category="peluches"
        variantLabel="Tamaño"
        stockPerVariant
        showLoadMore={false}
      />
    )
  }
}
