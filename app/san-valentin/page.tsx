import type { Metadata } from "next"
import SanValentinClient from "./san-valentin-client"

export const metadata: Metadata = {
  title: "Peluches y Regalos para San Valentín | Mundo Disney",
  description: "Peluches personalizados, cojines románticos y regalos únicos para San Valentín. Envíos a Colombia y Venezuela. Ideas originales para tu pareja.",
  keywords: [
    "peluches para San Valentín",
    "regalos para San Valentín",
    "peluches para el 14 de febrero",
    "regalos para el 14 de febrero",
    "peluches para mi novia",
    "peluches para mi novio",
    "peluches románticos",
    "regalos románticos",
    "regalos personalizados para San Valentín",
    "peluches personalizados para San Valentín",
    "oso de peluche para San Valentín",
    "osos de peluche para regalar",
    "regalos para enamorados",
    "detalles para San Valentín",
    "detalles románticos",
    "regalo para mi pareja",
    "regalo para mi novia",
    "regalo para mi novio",
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
    canonical: "/san-valentin",
    languages: {
      "es-co": "/san-valentin",
      "es-ve": "/san-valentin?country=ve",
      "x-default": "/san-valentin",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/san-valentin",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches y Regalos para San Valentín | Mundo Disney",
    description: "Peluches personalizados, cojines románticos y regalos únicos para San Valentín. Envíos a Colombia y Venezuela.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches y regalos románticos para San Valentín - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches y Regalos para San Valentín | Mundo Disney",
    description: "Peluches personalizados, cojines románticos y regalos únicos para San Valentín. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function SanValentinPage() {
  return <SanValentinClient />
}
