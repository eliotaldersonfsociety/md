import type { Metadata } from "next"
import { HeroSection } from "@/components/port";
import { ProcessSection } from "@/components/process-section";
import { ProductsComparison } from "@/components/ComparadorProductos";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Empresas | Fábrica de Peluches Mundo Disney",
  description: "Desarrollos corporativos y regalos empresariales personalizados. Pedidos desde 100 unidades para empresas en Colombia y Venezuela.",
  canonical: "/empresas",
}

export default function Empresas() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProcessSection />
        <ProductsComparison />
      <Footer />
    </main>
  )
}