import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { ProductsSection } from "@/components/products-section"
import { WholesaleSection } from "@/components/wholesale-section"
import { CorporateSection } from "@/components/corporate-section"
import { CharactersSection } from "@/components/characters-section"
import { ContactSection } from "@/components/contact-section"
import { ProductsComparison } from "@/components/ComparadorProductos"
import { Footer } from "@/components/footer"
import { getProductsWithStock, getVariantsByProductId } from "@/db/actions"

export default async function HomePage() {
  let dbProducts: Awaited<ReturnType<typeof getProductsWithStock>> = []
  let stockMap = new Map<number, number>()
  let variantStocksMap = new Map<number, Map<string, number>>()

  try {
    dbProducts = await getProductsWithStock()
    stockMap = new Map<number, number>()
    variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      stockMap.set(p.id, p.stock)
      const variantRows = await getVariantsByProductId(p.id)
      if (variantRows.length > 0) {
        const variantMap = new Map<string, number>()
        for (const v of variantRows) {
          variantMap.set(v.label, v.stock)
        }
        variantStocksMap.set(p.id, variantMap)
      }
    }
  } catch {}

  const { allProducts } = await import("@/lib/products-data")
  const categoryProducts = allProducts.reduce((acc, product) => {
    if (!acc.find(p => p.category === product.category)) {
      acc.push(product)
    }
    return acc
  }, [] as typeof allProducts)

  const productsWithStock = categoryProducts.map(p => {
    const productStock = stockMap.get(p.id) ?? 0

    let updatedVariants
    if (p.variants && p.variants.length > 0) {
      updatedVariants = p.variants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label)
        return { ...v, stock: storedVariantStock ?? v.stock ?? 0 }
      })
    }

    let updatedAdultVariants
    if (p.adultVariants && p.adultVariants.length > 0) {
      updatedAdultVariants = p.adultVariants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label)
        return { ...v, stock: storedVariantStock ?? v.stock ?? 0 }
      })
    }

    let updatedChildVariants
    if (p.childVariants && p.childVariants.length > 0) {
      updatedChildVariants = p.childVariants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label)
        return { ...v, stock: storedVariantStock ?? v.stock ?? 0 }
      })
    }

    const totalStock = updatedVariants
      ? updatedVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
      : updatedAdultVariants && updatedChildVariants
        ? [...updatedAdultVariants, ...updatedChildVariants].reduce((sum, v) => sum + (v.stock ?? 0), 0)
        : productStock

    return {
      ...p,
      stock: totalStock || productStock,
      variants: updatedVariants,
      adultVariants: updatedAdultVariants,
      childVariants: updatedChildVariants,
    }
  })

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <ProductsSection products={productsWithStock} />
      <WholesaleSection />
      <CharactersSection />
      <ProductsComparison />
      <ContactSection />
      <Footer />
    </main>
  )
}
