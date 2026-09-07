import type { Metadata } from "next"
import ArreglosFloralesCityClient from "./arreglos-florales-city-client"
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
    title: `Complementos para Arreglos Florales en ${city.name} | Mundo Disney`,
    description: `Peluches, cojines y regalos únicos para complementar tus arreglos florales en ${city.name}, ${departmentText}, ${countryText}.`,
    keywords: [
      `arreglos florales ${city.name}`,
      `complementos para arreglos florales ${city.name}`,
      `peluches para arreglos florales ${city.name}`,
      `regalos para flores ${city.name}`,
      `flores con peluches ${city.name}`,
      `arreglos florales ${countryText}`,
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
      canonical: `/arreglos-florales/${city.slug}`,
      languages: {
        "es-co": `/arreglos-florales/${city.slug}`,
        "es-ve": `/arreglos-florales/${city.slug}?country=ve`,
        "x-default": `/arreglos-florales/${city.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      alternateLocale: ["es_VE"],
      url: `https://fabricadepeluchesmundodisney.com/arreglos-florales/${city.slug}`,
      siteName: "Fábrica de Peluches Mundo Disney",
      title: `Complementos para Arreglos Florales en ${city.name} | Mundo Disney`,
      description: `Peluches, cojines y regalos únicos para complementar tus arreglos florales en ${city.name}.`,
      images: [
        {
          url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
          width: 1200,
          height: 630,
          alt: `Complementos para arreglos florales en ${city.name} - Mundo Disney`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Complementos para Arreglos Florales en ${city.name} | Mundo Disney`,
      description: `Peluches y regalos únicos para complementar tus arreglos florales en ${city.name}.`,
      images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
    },
  }
}

export default async function ArreglosFloralesCityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params
  const city = getCityBySlug(citySlug)

  if (!city) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Ciudad no encontrada</h1>
          <p className="text-muted-foreground">Lo sentimos, no encontramos información para esta ciudad.</p>
        </div>
      </main>
    )
  }

  return <ArreglosFloralesCityClient city={city} />
}
