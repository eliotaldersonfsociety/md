"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Cojines",
    image: "/images/categorias/2.webp",
    description: "Comodidad única",
    href: "/cojines"
  },
  {
    name: "Cervicales",
    image: "/images/categorias/3.webp",
    description: "Descanso perfecto",
    href: "/cervicales"
  }
]

export function CojinesCervicalesSection() {
  return (
    <section id="cojines-cervicales" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Confort
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cojines y Cervicales con Diseño Único
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Diseños exclusivos para el descanso y la comodidad de tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-white/80">{category.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-white mt-2 group-hover:gap-2 transition-all">
                  Ver más <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
