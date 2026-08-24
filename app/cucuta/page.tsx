import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, MessageCircle, Package, Truck, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Peluches en Cúcuta | Fábrica de Peluches Mundo Disney",
  description: "Fábrica de peluches y regalos personalizados en Cúcuta, Colombia. Cojines, cervicales, llaveros y más. Envíos locales y nacionales. WhatsApp disponible.",
  canonical: "/cucuta",
}

export default function CucutaPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/fondo/1.webp"
          alt="Peluches en Cúcuta"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Peluches y Regalos en <span className="text-yellow-300">Cúcuta</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Fábrica de peluches, cojines, cervicales y regalos personalizados. Envíos a toda la ciudad y departamento.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Envíos en Cúcuta</h3>
              <p className="text-muted-foreground text-sm">Entrega en 2-3 días hábiles en toda la ciudad.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pedidos Personalizados</h3>
              <p className="text-muted-foreground text-sm">Cumpleaños, eventos y fechas especiales.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Calidad Garantizada</h3>
              <p className="text-muted-foreground text-sm">Más de 15 años de experiencia en peluches y regalos.</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Productos Disponibles para Envío en Cúcuta
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Peluches", href: "/peluches", image: "/images/categorias/1.webp" },
                { name: "Cojines", href: "/cojines", image: "/images/categorias/2.webp" },
                { name: "Cervicales", href: "/cervicales", image: "/images/categorias/4.webp" },
                { name: "Llaveros", href: "/llaveros", image: "/images/categorias/5.webp" },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image src={cat.image} alt={cat.name} fill className="object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-pink-400 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Pedir por WhatsApp en Cúcuta?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Escríbenos para cotizar peluches, cojines y regalos personalizados. Entregas locales y envíos nacionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/573112814787" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Cúcuta
                </Button>
              </a>
              <Link href="/contacto">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                  Formulario de Contacto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
