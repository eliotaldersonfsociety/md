import type { Metadata } from "next"
import { getProductsWithVariantsFromDB } from "@/db/actions"
import { allProducts } from "@/lib/products-data"
import TiendaClient from "./tienda-client"

export const metadata: Metadata = {
  title: "Tienda | Fábrica de Peluches Mundo Disney",
  description: "Tienda online de peluches, cojines, cervicales, llaveros y regalos personalizados. Venta al por mayor y menor. Envíos a Colombia y Venezuela.",
  canonical: "/tienda",
}

function toDbProductsShape(products: typeof allProducts) {
  return products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    wholesale_price: p.wholesalePrice ?? p.price,
    original_price: p.originalPrice,
    image: p.image,
    category: p.category,
    is_new: !!p.badge,
    is_sale: false,
    stock: p.stock ?? 0,
    badge: p.badge,
    badge_color: p.badgeColor,
    rating: p.rating,
    reviews: p.reviews,
    min_wholesale: 3,
    variants: (p.variants || []).map((v: any) => ({
      id: String(v.id),
      label: v.label,
      price: v.price,
      wholesale_price: v.wholesalePrice,
      stock: v.stock ?? 0,
    })),
    adult_variants: (p.adultVariants || []).map((v: any) => ({
      id: String(v.id),
      label: v.label,
      price: v.price,
      wholesale_price: v.wholesalePrice,
      stock: v.stock ?? 0,
    })),
    child_variants: (p.childVariants || []).map((v: any) => ({
      id: String(v.id),
      label: v.label,
      price: v.price,
      wholesale_price: v.wholesalePrice,
      stock: v.stock ?? 0,
    })),
    adult_images: p.adultImages,
    child_images: p.childImages,
  }))
}

export default async function TiendaPage() {
  let dbProducts: any[] = []

  try {
    dbProducts = await getProductsWithVariantsFromDB()
  } catch {
    dbProducts = []
  }

  const hasCategories = Array.isArray(dbProducts) && dbProducts.some((p) => p.category)

  if (!dbProducts || dbProducts.length === 0 || !hasCategories) {
    dbProducts = toDbProductsShape(allProducts)
  }

  return <TiendaClient initialProducts={dbProducts} />
}
