"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const slides = [
  {
    id: 1,
    badge: "Fabrica de Peluches",
    title: "Tus Tiernos",
    highlight: "Companeros",
    titleEnd: "de Vida",
    description: "Creamos peluches de la mas alta calidad con amor y dedicacion. Perfectos para regalar momentos inboxadiables.",
    image: "/images/portada/3.webp",
    primaryButton: { text: "Ver Productos", href: "#productos" },
    secondaryButton: { text: "Venta al Por Mayor", href: "#mayoreo" },
    stats: [
      { value: "+500", label: "Productos" },
      { value: "+10K", label: "Clientes Felices" },
      { value: "15+", label: "Anos de Experiencia" },
    ],
  },
  {
    id: 2,
    badge: "Ofertas Especiales",
    title: "Hasta 40%",
    highlight: "Descuento",
    titleEnd: "en Peluches",
    description: "Aprovecha nuestras ofertas exclusivas en toda la coleccion. Tiempo limitado.",
    image: "/images/portada/4.webp",
    primaryButton: { text: "Ver Ofertas", href: "#productos" },
    secondaryButton: { text: "Conocer Mas", href: "#nosotros" },
    stats: [
      { value: "40%", label: "Descuento Max" },
      { value: "+100", label: "Productos en Oferta" },
      { value: "7", label: "Dias de Promo" },
    ],
  },
  {
    id: 3,
    badge: "Emprendedores",
    title: "Emprende",
    highlight: "Con Nosotros",
    titleEnd: "Hoy",
    description: "Somos fabricantes directos. Obtiene los mejores precios al por mayor.",
    image: "/images/portada/2.webp",
    primaryButton: { text: "Cotizar Mayoreo", href: "#mayoreo" },
    secondaryButton: { text: "Llamar Ahora", href: "tel:+573001234567" },
    stats: [
      { value: "-50%", label: "Precios Mayoreo" },
      { value: "+200", label: "Distribuidores" },
      { value: "24h", label: "Cotizacion" },
    ],
  },
  {
    id: 4,
    badge: "Regalo Perfecto",
    title: "El Regalo",
    highlight: "Ideal",
    titleEnd: "para Toda Ocasion",
    description: "Cumpleanos, aniversarios, dia de la madre. Nuestros peluches crean sonrisas.",
    image: "/images/portada/1.webp",
    primaryButton: { text: "Comprar Ahora", href: "#productos" },
    secondaryButton: { text: "Ver Catalogo", href: "#categorias" },
    stats: [
      { value: "100%", label: "Satisfaccion" },
      { value: "+50", label: "Modelos" },
      { value: "Gratis", label: "Envio +$150K" },
    ],
  },
{
    id: 5,
    badge: "Babyshower",
    title: "Celebra la",
    highlight: "Nueva Vida",
    titleEnd: "con Amor",
    description: "El regalo perfecto para la llegada del bebe. Peluches suaves y seguros para el nuevo miembro de la familia.",
    image: "/images/portada/6.webp",
    primaryButton: { text: "Ver Coleccion", href: "#productos" },
    secondaryButton: { text: "Personalizar Regalo", href: "#contacto" },
    stats: [
      { value: "100%", label: "Seguros" },
      { value: "+30", label: "Modelos Bebe" },
      { value: "Gratis", label: "Envio +$150K" },
    ],
  },
  {
    id: 6,
    badge: "Viajes",
    title: "Companero",
    highlight: "de Viaje",
    titleEnd: "Perfecto",
    description: "El cervical con antifaz ideal para accompanies a los ninos en sus aventuras. Ligero, suave y perfecto para llevar a todas partes.",
    image: "/images/portada/5.webp",
    primaryButton: { text: "Ver Modelos", href: "#productos" },
    secondaryButton: { text: "Comprar Ahora", href: "#productos" },
    stats: [
      { value: "Portatil", label: "Facil de Llevar" },
      { value: "+40", label: "Modelos" },
      { value: "Resistente", label: "Calidad Premium" },
    ],
  },
  {
    id: 7,
    badge: "Futbol",
    title: "Anime a tu",
    highlight: "Seleccion",
    titleEnd: "con Orgullo",
    description: "Celebra cada partido con los peluches de tu equipo favorito. La mejor energia para pasar en familia.",
    image: "/images/portada/7.webp",
    primaryButton: { text: "Ver Equipos", href: "#categorias" },
    secondaryButton: { text: "Comprar Ahora", href: "#productos" },
    stats: [
      { value: "+20", label: "Equipos" },
      { value: "Oficial", label: "Licencias" },
      { value: "Descuento", label: "Por Mayor" },
    ],
  },
  {
    id: 8,
    badge: "Graduacion",
    title: "Celebra su",
    highlight: "Graduacion",
    titleEnd: "Unica",
    description: "El regalo perfecto para festejar la graduation del nino o nina. Un recuerdo especial que durara para siempre.",
    image: "/images/portada/8.webp",
    primaryButton: { text: "Ver Regalos", href: "#productos" },
    secondaryButton: { text: "Personalizar", href: "#contacto" },
    stats: [
      { value: "Unico", label: "Personalizable" },
      { value: "+25", label: "Modelos" },
      { value: "Gratis", label: "Envio +$150K" },
    ],
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[currentSlide]

  return (
    <section id="inicio" className="relative min-h-[50vh]">
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          key={slide.id}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl" />


      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 h-full flex items-end">
        <div className="max-w-2xl">
          
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight text-balance mb-4 md:mb-6">
            {slide.title} <span className="text-pink-400">{slide.highlight}</span> {slide.titleEnd}
          </h1>
          
          <p className="text-sm md:text-lg text-white/80 max-w-xl leading-relaxed mb-6 md:mb-8">
            {slide.description}
          </p>
          
          <div className="flex flex-row flex-wrap gap-3 mb-8 md:mb-12">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-4 md:px-8">
              <Link href={slide.primaryButton.href}>
                {slide.primaryButton.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-4 md:px-8 border-2 border-white bg-cyan-500 text-white hover:bg-cyan/10">
              <Link href={slide.secondaryButton.href}>
                {slide.secondaryButton.text}
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {slide.stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4 border border-white/20">
                <p className="text-xs md:text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] md:text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
