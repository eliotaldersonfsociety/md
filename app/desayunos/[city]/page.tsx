import type { Metadata } from "next"
import DesayunosCityClient from "./desayunos-city-client"
import { getCityBySlug } from "@/lib/cities-data"

interface CityPageProps {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const { getAllCities } = await import("@/lib/cities-data")
  const cities = getAllCities()
  return cities.map((city) => ({ city: city.slug }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)

  if (!city) {
    return { title: "Ciudad no encontrada | Fábrica de Peluches Mundo Disney" }
  }

  const countryText = city.country === 'colombia' ? 'Colombia' : 'Venezuela'
  const departmentText = city.department || city.state || ''

  return {
    title: `Desayunos Sorpresa en ${city.name} | Mundo Disney`,
    description: `Desayunos sorpresa en ${city.name}, ${departmentText}, ${countryText}. Peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.`,
    keywords: [
      `desayunos sorpresa ${city.name}`,
      `desayunos ${city.name}`,
      `desayuno cumpleanos ${city.name}`,
      `desayuno aniversario ${city.name}`,
      `peluches desayuno ${city.name}`,
      `desayunos sorpresa ${countryText}`,
    ],
    authors: [{ name: "Fábrica de Peluches Mundo Disney" }],
    creator: "Fábrica de Peluches Mundo Disney",
    publisher: "Fábrica de Peluches Mundo Disney",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/desayunos/${city.slug}`,
      languages: {
        "es-co": `/desayunos/${city.slug}`,
        "es-ve": `/desayunos/${city.slug}?country=ve`,
        "x-default": `/desayunos/${city.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      alternateLocale: ["es_VE"],
      url: `https://fabricadepeluchesmundodisney.com/desayunos/${city.slug}`,
      siteName: "Fábrica de Peluches Mundo Disney",
      title: `Desayunos Sorpresa en ${city.name} | Mundo Disney`,
      description: `Desayunos sorpresa en ${city.name}, ${departmentText}, ${countryText}. Peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.`,
      images: [
        {
          url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
          width: 1200,
          height: 630,
          alt: `Desayunos sorpresa en ${city.name} - Mundo Disney`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Desayunos Sorpresa en ${city.name} | Mundo Disney`,
      description: `Desayunos sorpresa en ${city.name}, ${departmentText}, ${countryText}.`,
      images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
    },
  }
}

export default async function DesayunosCityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)

  if (!city) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Ciudad no encontrada</h1>
          <p className="text-muted-foreground">Lo sentimos, no encontramos informacion para esta ciudad.</p>
        </div>
      </main>
    )
  }

  return <DesayunosCityClient city={city} />
}
