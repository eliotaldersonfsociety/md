"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const characters = [
  {
    name: "Milo",
    image: "/images/personajes/milo.webp",
    personality: "Tierno y cariñoso"
  },
  {
    name: "Mimi",
    image: "/images/personajes/mimi.webp",
    personality: "Dulce y juguetona"
  },
  {
    name: "Bubu",
    image: "/images/personajes/bubu.webp",
    personality: "Mágico y soñador"
  },
  {
    name: "Lala",
    image: "/images/personajes/lala.webp",
    personality: "Tranquila y adorable"
  },
  {
    name: "Dodo",
    image: "/images/personajes/dodo.webp",
    personality: "Alegre y amigable"
  },
  {
    name: "Buny",
    image: "/images/personajes/buny.webp",
    personality: "Lista y curiosa"
  },
  {
    name: "Max",
    image: "/images/personajes/max.webp",
    personality: "Tranquilo y sabio"
  },
  {
    name: "Kira",
    image: "/images/personajes/Kira.webp",
    personality: "Valiente y protectora"
  },
  {
    name: "Roco",
    image: "/images/personajes/roco.webp",
    personality: "Pequeño y fuerte"
  },
  {
    name: "Mura",
    image: "/images/personajes/mura.webp",
    personality: "Fuerte y leal"
  },
  {
    name: "Nube",
    image: "/images/personajes/nube.webp",
    personality: "Dulce y tímido"
  },
  {
    name: "Kimi",
    image: "/images/personajes/Kimi.webp",
    personality: "Suavecita y esponjosa"
  },
  {
    name: "Gino",
    image: "/images/personajes/gino.webp",
    personality: "Juguetón y travieso"
  },
  {
    name: "Jira",
    image: "/images/personajes/jira.webp",
    personality: "Elegante y amable"
  },
  {
    name: "Drako",
    image: "/images/personajes/drako.webp",
    personality: "Travieso y dulce"
  },
  {
    name: "Drini",
    image: "/images/personajes/drini.webp",
    personality: "Calma y serena"
  },
  {
    name: "Conejo Orejon",
    image: "/images/personajes/conejo.webp",
    personality: "Ágil y curioso"
  },
  {
    name: "Coneja Orejon",
    image: "/images/personajes/coneja.webp",
    personality: "Rápida y tierna"
  },
  {
    name: "Perro Orejon",
    image: "/images/personajes/perro.webp",
    personality: "Lindo y Jugueton"
  },
  {
    name: "Perra Orejon",
    image: "/images/personajes/perra.webp",
    personality: "Cariñosa y fiel"
  }
]

export function CharactersSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nuestra Familia
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Nuestros Personajes Favoritos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personajes que dejan huella en el corazón de grandes y pequeños
          </p>
        </div>

        {/* Characters Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex gap-6 pb-4 carousel-animate">
              {[...characters, ...characters].map((character, index) => (
                <div
                  key={`${character.name}-${index}`}
                  className="flex-shrink-0 w-48 snap-center group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-full overflow-hidden border-4 border-card shadow-lg group-hover:border-primary group-hover:shadow-xl transition-all duration-300 bg-white">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {character.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {character.personality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
