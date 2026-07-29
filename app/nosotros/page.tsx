"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Users, Heart, Star, Truck } from "lucide-react"

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#d946ef] to-primary" />
        <div className="absolute inset-0 bg-[url('/images/fondo/1.webp')] opacity-10" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-[var(--font-montserrat)] drop-shadow-lg">
            ¿Quiénes Somos?
          </h1>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/fondo/2.webp"
                alt="Personajes Pelanas"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-primary text-center mb-8 font-[var(--font-montserrat)]">
            Nuestra historia
          </h2>
          
          <div className="space-y-6 text-muted-foreground text-center text-lg leading-relaxed">
            <p>
              La Fabrica de Peluches Mundo Disney. Su objetivo principal es la venta de peluches, cojines, mantas y artículos relacionados con el ramo.
            </p>
            <p>
              Esta fabrica exporta nuestros productos a todo el territorio nacional de Venezuela, trabajando con más de 7 mayoristas a nivel nacional que le ofrecen la variedad de productos con los cuales trabajamos 
nuestros productos 100% exclusivos contando con la renovación de nuestros productos cada 3 meses para ofrecer exclusividad a nuestros clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-16 font-[var(--font-montserrat)]">
            Nuestra Trayectoria
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 hidden md:block" />
            
            <div className="space-y-12">
              {[
                { year: "2010", title: "Fundación", description: "Inicio de operaciones con 4 empleados y un taller en Venezuela" },
                { year: "2011", title: "Expansión Nacional", description: "Ampliación a otras ciudades principales de Venezuela y Colombia" },
                { year: "2012", title: "Mascota oficial", description: "Creacion de la mascota oficial para loa Juegos Iberoamericanos de atletismo llamado Jaggy" },
                { year: "2013", title: "Cerramos Nuestras Puertas", description: "Cierre de nuestras puertas de la fabrica con la ilusion y el trabajo que seguiremos desarrollando" },
                { year: "2024", title: "Volvimos a ilusionarnos", description: "Despues de una larga espera y de estar trabajando en papel todo lo que hariamos volvimo a empezar de 0 con la iluson dle trabajo de estos 11 años" },
                { year: "2026", title: "Transformación Digital y Produccion", description: "Lanzamiento de tienda en línea y presencia digital con todos nuestros personajes esperando robarse los corazones de todos nuestros clientes" },
              ].map((item, index) => (
                <div key={item.year} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-background p-6 rounded-2xl shadow-lg border border-border/50 inline-block">
                      <span className="text-primary font-bold text-2xl font-[var(--font-montserrat)]">{item.year}</span>
                      <h3 className="text-xl font-semibold text-foreground mt-2">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 bg-primary rounded-full relative z-10 shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Logros */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative max-w-md mx-auto">
              <Image
                src="/images/fondo/3.webp"
                alt="personajes"
                width={400}
                height={300}
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8 font-[var(--font-montserrat)]">
                Nuestros Logros
              </h2>
              
              <ul className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Más de 15 años de experiencia en el diseño y fabricación de peluches.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Desarrollo de personajes y mascotas personalizadas para eventos, marcas y campañas promocionales.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Presencia comercial en Venezuela y Colombia.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Más de 10.000 productos elaborados entre peluches, cojines y artículos de expresión social.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Reactivación y transformación digital de la marca en 2024, consolidando una nueva etapa de crecimiento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">✓</span>
                  <span>Creación constante de diseños exclusivos renovados periódicamente para ofrecer productos únicos a nuestros clientes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12 font-[var(--font-montserrat)]">
            Nuestros Valores
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Pasión", description: "Amamos lo que hacemos y lo reflejamos en cada producto" },
              { icon: Star, title: "Calidad", description: "Altos estándares en materiales y procesos de fabricación" },
              { icon: Users, title: "Compromiso", description: "Con nuestros clientes, empleados y la comunidad" },
              { icon: Truck, title: "Servicio", description: "Entrega puntual y atención personalizada" },
            ].map((valor) => (
              <div key={valor.title} className="bg-background p-8 rounded-2xl shadow-lg text-center border border-border/50 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <valor.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{valor.title}</h3>
                <p className="text-muted-foreground">{valor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Años de Experiencia" },
              { number: "500+", label: "Clientes Satisfechos" },
              { number: "10K+", label: "Productos Creados" },
              { number: "10+", label: "Empleados" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary font-[var(--font-montserrat)]">
                  {stat.number}
                </div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#7c3aed]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-[var(--font-montserrat)]">
            Somos una Empresa donde la Calidad y<br />
            el Compromiso son patrimonio Nacional
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Nos destacamos por la Creación, Fabricación y Comercialización<br />
            de muñecos y productos de Expresión Social
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
          >
            <Link href="/tienda">COMPRAR</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
