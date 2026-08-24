import type { Metadata } from "next"
import { headers } from "next/headers"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { getProductsWithVariantsFromDB } from "@/db/actions"
import HomeProductsClient from "./home-products-client"

export const metadata: Metadata = {
  title: "Inicio | Fábrica de Peluches Mundo Disney",
  description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados. Envíos a todo Colombia y Venezuela. Pedidos al por mayor y detal.",
  canonical: "/",
}

export default async function HomePage() {
  const dbProducts = await getProductsWithVariantsFromDB()
  const headerList = await headers()
  const vercelCountry = headerList.get("x-vercel-ip-country")

  return (
    <main className="min-h-screen bg-background pt-0 pb-16 md:pt-0 lg:pb-0">
      <Header />
      <HeroSection />
      <HomeProductsClient initialProducts={dbProducts} vercelCountry={vercelCountry} />
      <Footer />
    </main>
  )
}
