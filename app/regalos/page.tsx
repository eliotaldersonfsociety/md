import type { Metadata } from "next"
import RegalosClient from "./regalos-client"

export const metadata: Metadata = {
  title: "Regalos Personalizados y Peluches | Mundo Disney",
  description: "Peluches personalizados, cojines, llaveros y regalos únicos para toda ocasión. Envíos a Colombia y Venezuela. Ideas originales para regalar.",
  keywords: [
    "regalos personalizados",
    "peluches personalizados",
    "regalos para cumpleaños",
    "regalos para aniversario",
    "regalos para San Valentín",
    "regalos para Amor y Amistad",
    "cojines personalizados",
    "llaveros personalizados",
    "regalos originales",
    "regalos para parejas",
    "regalos para amigos",
    "regalos para empresas",
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
    canonical: "/regalos",
    languages: {
      "es-co": "/regalos",
      "es-ve": "/regalos?country=ve",
      "x-default": "/regalos",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/regalos",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos Personalizados y Peluches | Mundo Disney",
    description: "Peluches personalizados, cojines, llaveros y regalos únicos para toda ocasión. Envíos a Colombia y Venezuela.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos personalizados y peluches - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos Personalizados y Peluches | Mundo Disney",
    description: "Peluches personalizados, cojines, llaveros y regalos únicos para toda ocasión.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function RegalosPage() {
  return <RegalosClient />
}
