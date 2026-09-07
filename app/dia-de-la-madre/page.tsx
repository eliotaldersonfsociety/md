import type { Metadata } from "next"
import DiaDeLaMadreClient from "./dia-de-la-madre-client"

export const metadata: Metadata = {
  title: "Regalos para el Día de la Madre | Peluches y Cojines Personalizados | Mundo Disney",
  description: "Peluches personalizados, cojines y regalos únicos para el Día de la Madre. Envíos a Colombia y Venezuela. Ideas originales para mamá.",
  keywords: [
    "regalos para el Día de la Madre",
    "peluches para el Día de la Madre",
    "cojines para mamá",
    "regalos personalizados para mamá",
    "peluches personalizados para mamá",
    "detalles para la madre",
    "regalos para mamá",
    "Día de la Madre Colombia",
    "Día de la Madre Venezuela",
    "ideas para el Día de la Madre",
    "regalos originales para mamá",
    "peluches para mamá",
    "cojines románticos para mamá",
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
    canonical: "/dia-de-la-madre",
    languages: {
      "es-co": "/dia-de-la-madre",
      "es-ve": "/dia-de-la-madre?country=ve",
      "x-default": "/dia-de-la-madre",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/dia-de-la-madre",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos para el Día de la Madre | Peluches y Cojines Personalizados | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos para el Día de la Madre. Envíos a Colombia y Venezuela.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos para el Día de la Madre - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos para el Día de la Madre | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos para el Día de la Madre. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function DiaDeLaMadrePage() {
  return <DiaDeLaMadreClient />
}
