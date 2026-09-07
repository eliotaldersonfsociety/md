import type { Metadata } from "next"
import CityClient from "./city-client"
import { getCityBySlug } from "@/lib/cities-data"

interface CityPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { getAllCities } = await import("@/lib/cities-data")
  const cities = getAllCities()
  return cities.map((city) => ({ slug: city.slug }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { slug } = await params
  const city = getCityBySlug(slug)

  if (!city) {
    return { title: "Ciudad no encontrada | Fábrica de Peluches Mundo Disney" }
  }

  const countryText = city.country === 'colombia' ? 'Colombia' : 'Venezuela'
  const departmentText = city.department || city.state || ''

  return {
    title: `Peluches y Regalos Personalizados en ${city.name} | Mundo Disney`,
    description: `Peluches personalizados, cojines y regalos únicos en ${city.name}, ${departmentText}, ${countryText}. Envíos a ${city.name} y toda la región.`,
    keywords: [
      `peluches en ${city.name}`,
      `regalos personalizados en ${city.name}`,
      `cojines en ${city.name}`,
      `peluches personalizados en ${city.name}`,
      `regalos en ${city.name}`,
      `envío a ${city.name}`,
      `peluches ${countryText}`,
      `regalos ${countryText}`,
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
      canonical: `/ciudad/${city.slug}`,
      languages: {
        "es-co": `/ciudad/${city.slug}`,
        "es-ve": `/ciudad/${city.slug}?country=ve`,
        "x-default": `/ciudad/${city.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      alternateLocale: ["es_VE"],
      url: `https://fabricadepeluchesmundodisney.com/ciudad/${city.slug}`,
      siteName: "Fábrica de Peluches Mundo Disney",
      title: `Peluches y Regalos Personalizados en ${city.name} | Mundo Disney`,
      description: `Peluches personalizados, cojines y regalos únicos en ${city.name}, ${departmentText}, ${countryText}.`,
      images: [
        {
          url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
          width: 1200,
          height: 630,
          alt: `Peluches y regalos personalizados en ${city.name} - Mundo Disney`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Peluches y Regalos Personalizados en ${city.name} | Mundo Disney`,
      description: `Peluches personalizados en ${city.name}, ${departmentText}, ${countryText}. Envíos a toda la región.`,
      images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
    },
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  const city = getCityBySlug(slug)

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

  return <CityClient city={city} />
}
