import type { Metadata } from "next"
import RamosFloralesCityClient from "./ramos-florales-city-client"
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
    title: `Ramos Florales en ${city.name} | Flores y Regalos | Mundo Disney`,
    description: `Ramos florales en ${city.name}, ${departmentText}, ${countryText}. Flores, peluches, cojines y detalles para toda ocasion.`,
    keywords: [
      `ramos florales ${city.name}`,
      `ramos ${city.name}`,
      `flores ${city.name}`,
      `peluches ${city.name}`,
      `regalos ${city.name}`,
      `ramos florales ${countryText}`,
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
      canonical: `/ramos-florales/${city.slug}`,
      languages: {
        "es-co": `/ramos-florales/${city.slug}`,
        "es-ve": `/ramos-florales/${city.slug}?country=ve`,
        "x-default": `/ramos-florales/${city.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      alternateLocale: ["es_VE"],
      url: `https://fabricadepeluchesmundodisney.com/ramos-florales/${city.slug}`,
      siteName: "Fábrica de Peluches Mundo Disney",
      title: `Ramos Florales en ${city.name} | Flores y Regalos | Mundo Disney`,
      description: `Ramos florales en ${city.name}, ${departmentText}, ${countryText}. Flores, peluches, cojines y detalles para toda ocasion.`,
      images: [
        {
          url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
          width: 1200,
          height: 630,
          alt: `Ramos florales en ${city.name} - Mundo Disney`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Ramos Florales en ${city.name} | Mundo Disney`,
      description: `Ramos florales en ${city.name}, ${departmentText}, ${countryText}.`,
      images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
    },
  }
}

export default async function RamosFloralesCityPage({ params }: CityPageProps) {
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

  return <RamosFloralesCityClient city={city} />
}
