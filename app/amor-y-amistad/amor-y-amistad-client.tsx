"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Gift, Users, Sparkles, Truck, MessageCircle, Star, ArrowRight } from "lucide-react"
import { allProducts } from "@/lib/products-data"
import { useState } from "react"
import { buildProductSlug } from "@/lib/slugify"
import { WhatsAppModal } from "@/components/whatsapp-modal"

const amorYAmistadProducts = allProducts
  .filter(p => p.category === "peluches" || p.category === "floristeria")
  .slice(0, 8)

const parejaProducts = amorYAmistadProducts.filter(p =>
  p.name.toLowerCase().includes("milo") ||
  p.name.toLowerCase().includes("mimi") ||
  p.name.toLowerCase().includes("lala") ||
  p.name.toLowerCase().includes("dodo") ||
  p.name.toLowerCase().includes("mia") ||
  p.name.toLowerCase().includes("sam")
).slice(0, 4)

const amigosProducts = amorYAmistadProducts.filter(p =>
  p.name.toLowerCase().includes("bubu") ||
  p.name.toLowerCase().includes("max") ||
  p.name.toLowerCase().includes("kira") ||
  p.name.toLowerCase().includes("roco") ||
  p.name.toLowerCase().includes("nube") ||
  p.name.toLowerCase().includes("kimi")
).slice(0, 4)

export default function AmorYAmistadClient() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")

  const openWhatsApp = (productName: string) => {
    setWhatsAppMessage(
      encodeURIComponent(
        `Hola, me interesa el producto "${productName}" para el Día del Amor y la Amistad. ¿Tienen disponibilidad y cuál es el tiempo de entrega en Colombia?`
      )
    )
    setIsWhatsAppOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">💝</div>
          <div className="absolute top-20 right-20 text-4xl">💖</div>
          <div className="absolute bottom-20 left-1/4 text-5xl">🌹</div>
          <div className="absolute bottom-10 right-1/3 text-4xl">💕</div>
        </div>
        <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
            ✨ 19 de Septiembre
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
            Peluches y Regalos para el <span className="text-pink-300">Amor y la Amistad</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Celebra el Día del Amor y la Amistad en Colombia con peluches personalizados, regalos para tu pareja, amigos, familiares y compañeros. Envíos a todo el país.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-semibold">
              <Link href="#productos">
                Ver Regalos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10 font-semibold">
              <Link href="/contacto">
                Cotizar Personalizado
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section id="productos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Nuestros Productos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Regalos para Amor y Amistad
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Los peluches y arreglos más queridos para celebrar el 19 de septiembre en Colombia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {amorYAmistadProducts.map((product) => {
              const productSlug = buildProductSlug(product.name)
              const productHref = `/${(product.category || "peluches").toLowerCase()}/${productSlug}`
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border"
                >
                  <Link href={productHref} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <Button
                        className="w-full bg-white text-primary hover:bg-white/90"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          openWhatsApp(product.name)
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Consultar
                      </Button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <span className="text-xs text-primary font-medium uppercase tracking-wide">
                      {product.category === "peluches" ? "Peluche" : "Arreglo"}
                    </span>
                    <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-xl font-bold text-primary">
                          ${product.price.toLocaleString("es-CO")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ${product.originalPrice.toLocaleString("es-CO")}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 rounded-full bg-primary hover:bg-primary/90"
                      onClick={() => openWhatsApp(product.name)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Pedir por WhatsApp
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
              <Link href="/peluches">
                Ver Todos los Peluches <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ideas por intención */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Ideas por intención
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Regalos para cada relación
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              El Día del Amor y la Amistad es para celebrar a todas las personas especiales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Parejas */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Para mi pareja</h3>
              <p className="text-muted-foreground mb-4">
                Peluches románticos, cojines con mensajes de amor y regalos personalizados para sorprender a esa persona especial.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {parejaProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <p className="text-sm font-bold text-primary">${product.price.toLocaleString("es-CO")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
                <Link href="/peluches">Ver opciones para pareja <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Amigos */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Para mi mejor amigo/a</h3>
              <p className="text-muted-foreground mb-4">
                Detalles divertidos, peluches originales y regalos que representen esa amistad única.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {amigosProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <p className="text-sm font-bold text-primary">${product.price.toLocaleString("es-CO")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
                <Link href="/peluches">Ver opciones para amigos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Familiares */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Para familiares</h3>
              <p className="text-muted-foreground mb-4">
                Regalos cálidos y personalizados para padres, hermanos y seres queridos. Ideales para expresar amor familiar.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {parejaProducts.slice(2, 4).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <p className="text-sm font-bold text-primary">${product.price.toLocaleString("es-CO")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
                <Link href="/cojines">Ver cojines y detalles <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Compañeros */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Para compañeros</h3>
              <p className="text-muted-foreground mb-4">
                Regalos corporativos y detalles para tu equipo de trabajo. Opciones desde 200 unidades personalizadas.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {amigosProducts.slice(2, 4).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <p className="text-sm font-bold text-primary">${product.price.toLocaleString("es-CO")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full rounded-full bg-primary hover:bg-primary/90">
                <Link href="/empresas">Ver opciones empresariales <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Principal */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-primary-foreground text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para celebrar el Amor y la Amistad?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
              Envíos a todo Colombia. Personaliza tu regalo y haz de este 19 de septiembre una fecha inolvidable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="/contacto">
                  Solicitar Cotización <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/30 text-white hover:bg-white/10 font-semibold"
                onClick={() => openWhatsApp("Cotización Amor y Amistad")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Envíos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Envíos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Envíos a todo Colombia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Envío gratis a partir de $500.000 pesos. Llegamos a todas las ciudades y municipios del país.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Envío Nacional</h3>
              <p className="text-sm text-muted-foreground">A toda Colombia</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Personalización</h3>
              <p className="text-sm text-muted-foreground">Nombres y mensajes</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Atención WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Respuesta rápida</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Calidad Premium</h3>
              <p className="text-sm text-muted-foreground">Materiales suaves</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "¿Cuándo debo hacer mi pedido para recibirlo antes del 19 de septiembre?",
                answer: "Te recomendamos hacer tu pedido con al menos 5 días hábiles de anticipación para garantizar la entrega a tiempo en Colombia."
              },
              {
                question: "¿Puedo personalizar el regalo con un mensaje para mi pareja o amigo?",
                answer: "Sí, todos nuestros peluches y cojines se pueden personalizar con nombres, fechas o mensajes especiales."
              },
              {
                question: "¿Qué regalo es más popular para el Día del Amor y la Amistad?",
                answer: "Los peluches personalizados y los cojines con frases románticas son los más elegidos para esta fecha."
              },
              {
                question: "¿Hacen envíos a todo Colombia?",
                answer: "Sí, realizamos envíos a todas las ciudades y municipios de Colombia. El envío es gratis a partir de $500.000 pesos."
              },
              {
                question: "¿Puedo pedir factura para mi regalo?",
                answer: "Sí, emitimos factura electrónica para todos los pedidos. Solo necesitas proporcionar tus datos fiscales."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-foreground hover:bg-muted/30 transition-colors">
                  {faq.question}
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enlaces Internos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Explora Más Opciones
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/peluches" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Peluches</h3>
              <p className="text-sm text-muted-foreground">Ver todos</p>
            </Link>
            <Link href="/cojines" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors">
              <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Cojines</h3>
              <p className="text-sm text-muted-foreground">Ver todos</p>
            </Link>
            <Link href="/contacto" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Contacto</h3>
              <p className="text-sm text-muted-foreground">Cotizar</p>
            </Link>
            <Link href="/empresas" className="bg-white rounded-xl p-6 text-center border border-border hover:border-primary/20 transition-colors">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Empresas</h3>
              <p className="text-sm text-muted-foreground">Regalos corporativos</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} message={whatsAppMessage} />
    </main>
  )
}
