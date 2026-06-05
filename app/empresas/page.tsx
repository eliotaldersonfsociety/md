import { HeroSection } from "@/components/port";
import { ProcessSection } from "@/components/process-section";
import { ProductsComparison } from "@/components/ComparadorProductos";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

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