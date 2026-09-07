import type { Metadata } from "next"
import CumpleanosClient from "./cumpleanos-client"

export const metadata: Metadata = {
  title: "Regalos para Cumpleaños | Peluches Personalizados | Mundo Disney",
  description: "Peluches personalizados y regalos únicos para cumpleaños. Sorprende a esa persona especial con un peluche único. Envíos a Colombia y Venezuela.",
  keywords: [
    "regalos para cumpleaños",
    "peluches para cumpleaños",
    "peluches personalizados para cumpleaños",
    "regalos personalizados para cumpleaños",
    "cumpleaños Colombia",
    "cumpleaños Venezuela",
    "ideas de regalos para cumpleaños",
    "peluches para regalar en cumpleaños",
    "regalos originales para cumpleaños",
    "detalles para cumpleaños",
    "regalos para mi novio cumpleaños",
    "regalos para mi novia cumpleaños",
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
    canonical: "/cumpleanos",
    languages: {
      "es-co": "/cumpleanos",
      "es-ve": "/cumpleanos?country=ve",
      "x-default": "/cumpleanos",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/cumpleanos",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos para Cumpleaños | Peluches Personalizados | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para cumpleaños. Sorprende a esa persona especial con un peluche único.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos para cumpleaños - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos para Cumpleaños | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para cumpleaños. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function CumpleanosPage() {
  return <CumpleanosClient />
}
