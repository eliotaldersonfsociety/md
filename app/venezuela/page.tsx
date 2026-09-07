import type { Metadata } from "next"
import VenezuelaClient from "./venezuela-client"

export const metadata: Metadata = {
  title: "Peluches y Regalos Personalizados en Venezuela | Mundo Disney",
  description: "Peluches personalizados, cojines y regalos únicos en Venezuela. Envíos a Caracas, Maracaibo, Valencia, Barquisimeto y todas las ciudades. Pedidos al por mayor y detal.",
  keywords: [
    "peluches en Venezuela",
    "regalos personalizados en Venezuela",
    "peluches personalizados Venezuela",
    "cojines en Venezuela",
    "regalos en Venezuela",
    "envío a todo Venezuela",
    "peluches Caracas",
    "peluches Maracaibo",
    "peluches Valencia",
    "peluches Barquisimeto",
    "regalos por mayor Venezuela",
    "regalos al detal Venezuela",
    "empresas Venezuela",
    "Día del Amor y la Amistad Venezuela",
    "San Valentín Venezuela",
    "Día de la Madre Venezuela",
    "Día del Niño Venezuela",
    "Navidad Venezuela",
    "cumpleaños Venezuela",
    "aniversario Venezuela",
    "baby shower Venezuela",
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
    canonical: "/venezuela",
    languages: {
      "es-co": "/venezuela",
      "es-ve": "/venezuela?country=ve",
      "x-default": "/venezuela",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/venezuela",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches y Regalos Personalizados en Venezuela | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos en Venezuela. Envíos a Caracas, Maracaibo, Valencia, Barquisimeto y todas las ciudades.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches y regalos personalizados en Venezuela - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches y Regalos Personalizados en Venezuela | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos en Venezuela. Envíos a todas las ciudades.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function VenezuelaPage() {
  return <VenezuelaClient />
}
