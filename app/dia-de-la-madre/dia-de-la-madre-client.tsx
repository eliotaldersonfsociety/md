"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Gift, Sparkles, Truck, MessageCircle, Star, ArrowRight } from "lucide-react"
import { allProducts } from "@/lib/products-data"
import { useState } from "react"
import { buildProductSlug } from "@/lib/slugify"
import { WhatsAppModal } from "@/components/whatsapp-modal"

const madreProducts = allProducts
  .filter(p => p.category === "peluches" || p.category === "floristeria" || p.category === "cojines")
  .slice(0, 8)

export default function DiaDeLaMadreClient() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")

  const openWhatsApp = (productName: string) => {
    setWhatsAppMessage(
      encodeURIComponent(
        `Hola, me interesa el producto "${productName}" para el Día de la Madre. ¿Tienen disponibilidad y cuál es el tiempo de entrega?`
      )
    )
    setIsWhatsAppOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">💝</div>
          <div className="absolute top-20 right-20 text-4xl">🌹</div>
          <div className="absolute bottom-20 left-1/4 text-5xl">💖</div>
          <div className="absolute bottom-10 right-1/3 text-4xl">👩‍👧‍👦</div>
        </div>
        <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
            ✨ Segundo Domingo de Mayo
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
            Regalos para el <span className="text-pink-300">Día de la Madre</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sorprende a mamá con peluches personalizados, cojines únicos y detalles llenos de amor. Envíos a Colombia y Venezuela.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-semibold">
              <Link href="#productos">Ver Regalos <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10 font-semibold">
              <Link href="/contacto">Cotizar Personalizado</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="productos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Nuestros Productos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Peluches y Regalos para Mamá</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Los regalos más tiernos para celebrar el Día de la Madre.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {madreProducts.map((product) => {
              const productSlug = buildProductSlug(product.name)
              const productHref = `/${(product.category || "peluches").toLowerCase()}/${productSlug}`
              return (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border">
                  <Link href={productHref} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <Button className="w-full bg-white text-primary hover:bg-white/90" size="sm" onClick={(e) => { e.preventDefault(); openWhatsApp(product.name) }}>
                        <MessageCircle className="h-4 w-4 mr-2" /> Consultar
                      </Button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <span className="text-xs text-primary font-medium uppercase tracking-wide">{product.category === "peluches" ? "Peluche" : product.category === "cojines" ? "Cojín" : "Arreglo"}</span>
                    <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xl font-bold text-primary">${product.price.toLocaleString("es-CO")}</span>
                        {product.originalPrice && <span className="text-sm text-muted-foreground line-through ml-2">${product.originalPrice.toLocaleString("es-CO")}</span>}
                      </div>
                    </div>
                    <Button className="w-full mt-3 rounded-full bg-primary hover:bg-primary/90" onClick={() => openWhatsApp(product.name)}>
                      <MessageCircle className="h-4 w-4 mr-2" /> Pedir por WhatsApp
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
              <Link href="/peluches">Ver Todos los Peluches <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Ideas Creativas</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ideas de Regalos para Mamá</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Inspírate con nuestras ideas para sorprender a mamá.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Heart className="h-7 w-7 text-primary" /></div>
              <h3 className="text-xl font-bold text-foreground mb-3">Peluches Personalizados</h3>
              <p className="text-muted-foreground mb-4">Agrega nombres, fechas o mensajes especiales. Un regalo único y memorable para mamá.</p>
              <Link href="/contacto" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">Personalizar ahora <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Gift className="h-7 w-7 text-primary" /></div>
              <h3 className="text-xl font-bold text-foreground mb-3">Cojines con Mensajes</h3>
              <p className="text-muted-foreground mb-4">Mensajes de amor en cojines suaves y personalizados. Perfectos para decorar y expresar sentimientos.</p>
              <Link href="/cojines" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">Ver cojines <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6"><Sparkles className="h-7 w-7 text-primary" /></div>
              <h3 className="text-xl font-bold text-foreground mb-3">Arreglos Especiales</h3>
              <p className="text-muted-foreground mb-4">Combina peluches con flores y detalles para crear el regalo perfecto para mamá.</p>
              <Link href="/contacto" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">Crear arreglo <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para sorprender a mamá?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Contáctanos ahora y te ayudamos a crear el regalo perfecto para el Día de la Madre.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-semibold">
              <Link href="/contacto">Solicitar Cotización <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10 font-semibold" onClick={() => openWhatsApp("Cotización Día de la Madre")}>
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Preguntas Frecuentes</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { question: "¿Cuándo debo hacer mi pedido para el Día de la Madre?", answer: "Te recomendamos hacer tu pedido con al menos 5 días hábiles de anticipación para garantizar la entrega a tiempo." },
              { question: "¿Puedo personalizar el regalo con un mensaje para mamá?", answer: "Sí, todos nuestros peluches y cojines se pueden personalizar con nombres, fechas o mensajes especiales." },
              { question: "¿Qué regalo es más popular para el Día de la Madre?", answer: "Los cojines con mensajes de amor y los peluches personalizados son los más elegidos para esta fecha." },
              { question: "¿Hacen envíos a todo Colombia y Venezuela?", answer: "Sí, realizamos envíos a todas las ciudades. El envío es gratis a partir de $500.000 pesos." },
              { question: "¿Puedo pedir factura para mi regalo?", answer: "Sí, emitimos factura electrónica para todos los pedidos. Solo necesitas proporcionar tus datos fiscales." }
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-xl border border-border overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-foreground hover:bg-muted/30 transition-colors">
                  {faq.question}
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Explora Más Opciones</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/peluches" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors"><Heart className="h-8 w-8 text-primary mx-auto mb-3" /><h3 className="font-semibold text-foreground">Peluches</h3><p className="text-sm text-muted-foreground">Ver todos</p></Link>
            <Link href="/cojines" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors"><Gift className="h-8 w-8 text-primary mx-auto mb-3" /><h3 className="font-semibold text-foreground">Cojines</h3><p className="text-sm text-muted-foreground">Ver todos</p></Link>
            <Link href="/contacto" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors"><MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" /><h3 className="font-semibold text-foreground">Contacto</h3><p className="text-sm text-muted-foreground">Cotizar</p></Link>
            <Link href="/empresas" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors"><Sparkles className="h-8 w-8 text-primary mx-auto mb-3" /><h3 className="font-semibold text-foreground">Empresas</h3><p className="text-sm text-muted-foreground">Regalos corporativos</p></Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} message={whatsAppMessage} />
    </main>
  )
}
