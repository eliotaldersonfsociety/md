import type { Metadata } from "next"
import SorpresasCityClient from "./sorpresas-city-client"
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
    title: `Sorpresas en ${city.name} | Regalos y Peluches | Mundo Disney`,
    description: `Sorpresas en ${city.name}, ${departmentText}, ${countryText}. Regalos, peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.`,
    keywords: [
      `sorpresas ${city.name}`,
      `regalos sorpresa ${city.name}`,
      `sorpresas cumpleanos ${city.name}`,
      `sorpresas aniversario ${city.name}`,
      `peluches sorpresa ${city.name}`,
      `sorpresas ${countryText}`,
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
      canonical: `/sorpresas/${city.slug}`,
      languages: {
        "es-co": `/sorpresas/${city.slug}`,
        "es-ve": `/sorpresas/${city.slug}?country=ve`,
        "x-default": `/sorpresas/${city.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      alternateLocale: ["es_VE"],
      url: `https://fabricadepeluchesmundodisney.com/sorpresas/${city.slug}`,
      siteName: "Fábrica de Peluches Mundo Disney",
      title: `Sorpresas en ${city.name} | Regalos y Peluches | Mundo Disney`,
      description: `Sorpresas en ${city.name}, ${departmentText}, ${countryText}. Regalos, peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.`,
      images: [
        {
          url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
          width: 1200,
          height: 630,
          alt: `Sorpresas en ${city.name} - Mundo Disney`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Sorpresas en ${city.name} | Mundo Disney`,
      description: `Sorpresas en ${city.name}, ${departmentText}, ${countryText}.`,
      images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
    },
  }
}

export default async function SorpresasCityPage({ params }: CityPageProps) {
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

  return <SorpresasCityClient city={city} />
}
