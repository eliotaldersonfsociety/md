import type { Metadata } from "next"
import { headers } from "next/headers"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { getProductsWithVariantsFromDB } from "@/db/actions"
import HomeProductsClient from "./home-products-client"
import { CojinesCervicalesSection } from "@/components/cojines-cervicales-section"
import { CorporateSection } from "@/components/corporate-section"
import { WholesaleSection } from "@/components/wholesale-section"
import { ShippingSection } from "@/components/shipping-section"
import { FaqSection } from "@/components/faq-section"
import { ContactSection } from "@/components/contact-section"

export const metadata: Metadata = {
  title: "Fábrica de Peluches en Colombia y Venezuela | Mundo Disney",
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
      <CojinesCervicalesSection />
      <CorporateSection />
      <WholesaleSection />
      <ShippingSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
