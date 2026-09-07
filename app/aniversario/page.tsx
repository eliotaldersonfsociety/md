import type { Metadata } from "next"
import AniversarioClient from "./aniversario-client"

export const metadata: Metadata = {
  title: "Regalos para Aniversario | Peluches y Regalos Personalizados | Mundo Disney",
  description: "Peluches personalizados y regalos románticos para aniversario de pareja. Ideas únicas para celebrar tu relación. Envíos a Colombia y Venezuela.",
  keywords: [
    "regalos para aniversario",
    "peluches para aniversario",
    "regalos para aniversario de pareja",
    "peluches personalizados para aniversario",
    "aniversario Colombia",
    "aniversario Venezuela",
    "ideas de regalos para aniversario",
    "regalos románticos para aniversario",
    "detalles para aniversario",
    "regalos originales para aniversario",
    "cojines para aniversario",
    "peluches para mi novio aniversario",
    "peluches para mi novia aniversario",
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
    canonical: "/aniversario",
    languages: {
      "es-co": "/aniversario",
      "es-ve": "/aniversario?country=ve",
      "x-default": "/aniversario",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/aniversario",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos para Aniversario | Peluches y Regalos Personalizados | Mundo Disney",
    description: "Peluches personalizados y regalos románticos para aniversario de pareja. Ideas únicas para celebrar tu relación.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos para aniversario - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos para Aniversario | Mundo Disney",
    description: "Peluches personalizados y regalos románticos para aniversario. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function AniversarioPage() {
  return <AniversarioClient />
}
