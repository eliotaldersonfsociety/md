"use client"

import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    name: "Peluches",
    image: "/images/categorias/1.webp",
    description: "Tiernos y suaves",
    slug: "/peluches"
  },
  {
    name: "Cojines",
    image: "/images/categorias/2.webp",
    description: "Comodidad única",
    slug: "/cojines"
  },
  {
    name: "Latas",
    image: "/images/categorias/4.webp",
    description: "Diseños originales",
    slug: "/latas"
  },
  {
    name: "Cervicales",
    image: "/images/categorias/3.webp",
    description: "Descanso perfecto",
    slug: "/cervicales"
  },
  {
    name: "Llaveros",
    image: "/images/categorias/5.webp",
    description: "Lleva tu favorito",
    slug: "/llaveros"
  },
  {
    name: "Ropa",
    image: "/images/categorias/6.webp",
    description: "Exclusivos",
    slug: "/ropa"
  }
]

export function CategoriesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide justify-center flex-wrap">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.slug}
              className="flex flex-col items-center gap-3 min-w-[140px] p-3 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-24 h-32 rounded-xl overflow-hidden relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
