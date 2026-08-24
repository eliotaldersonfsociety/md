import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getProductBySlug, getProductsWithVariantsFromDB } from "@/db/actions"
import { allProducts, type Product } from "@/lib/products-data"
import ProductPageClient from "@/components/product-page-client"

function buildProductSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const productByCategoryAndSlug = new Map<string, Map<string, Product>>()

for (const product of allProducts) {
  const category = product.category?.toLowerCase() || ""
  const name = typeof product.name === "string" ? product.name : ""

  if (!category || !name) continue

  const slug = buildProductSlug(name)

  if (!productByCategoryAndSlug.has(category)) {
    productByCategoryAndSlug.set(category, new Map())
  }
  productByCategoryAndSlug.get(category)!.set(slug, product)
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = []

  for (const [category, products] of productByCategoryAndSlug) {
    for (const [slug, product] of products) {
      params.push({ category, slug })
    }
  }

  return params
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params
  const normalizedCategory = category.toLowerCase()
  const product = await getProductBySlug(normalizedCategory, slug)

  if (!product) {
    return {
      title: "Producto no encontrado | Fábrica de Peluches Mundo Disney",
    }
  }

  const categoryName = normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)
  const price = product.variants?.[0]?.price || product.price

  return {
    title: `${product.name} | ${categoryName} | Fábrica de Peluches Mundo Disney`,
    description: `${product.name} - ${categoryName} original de Fábrica de Peluches Mundo Disney. Precio desde ${formatPriceCurrency(price, true)}. Envíos a Colombia y Venezuela.`,
    canonical: `/${normalizedCategory}/${slug}`,
    openGraph: {
      title: `${product.name} | Fábrica de Peluches Mundo Disney`,
      description: `${product.name} - ${categoryName} original. Precio desde ${formatPriceCurrency(price, true)}.`,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
    },
  }
}

function formatPriceCurrency(price: number, isColombia: boolean): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: isColombia ? "COP" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default async function ProductPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const categoryLower = category.toLowerCase()

  if (categoryLower === "undefined") {
    const found = allProducts.find(p => buildProductSlug(p.name) === slug)
    if (found?.category) {
      const targetCategory = found.category.toLowerCase()
      const targetSlug = buildProductSlug(found.name)
      const targetHref = `/${targetCategory}/${targetSlug}`
      redirect(targetHref)
    }
  }

  const categoryProducts = productByCategoryAndSlug.get(categoryLower)
  const product = categoryProducts?.get(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = allProducts
    .filter((p) => p.category?.toLowerCase() === categoryLower && p.name !== product.name)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.variants?.[0]?.price || p.price,
      image: p.image,
      category: p.category || categoryLower,
    }))

  return <ProductPageClient product={product as any} relatedProducts={relatedProducts} productSlug={slug} />
}
