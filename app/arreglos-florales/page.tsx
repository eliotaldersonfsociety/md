import type { Metadata } from "next"
import ArreglosFloralesClient from "./arreglos-florales-client"

export const metadata: Metadata = {
  title: "Complementos para Arreglos Florales | Peluches y Regalos para Flores | Mundo Disney",
  description: "Peluches, cojines y regalos únicos para complementar tus arreglos florales. Ideas originales para regalar junto a flores en Colombia y Venezuela.",
  keywords: [
    "complementos para arreglos florales",
    "qué agregar a un arreglo floral",
    "peluches para arreglos florales",
    "regalos para acompañar flores",
    "detalles para arreglos florales",
    "arreglos florales con peluches",
    "flores con peluches",
    "regalos para cumpleaños con flores",
    "regalos para aniversario con flores",
    "complementos para flores",
    "arreglos florales Bogotá",
    "arreglos florales Medellín",
    "arreglos florales Cali",
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
    canonical: "/arreglos-florales",
    languages: {
      "es-co": "/arreglos-florales",
      "es-ve": "/arreglos-florales?country=ve",
      "x-default": "/arreglos-florales",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/arreglos-florales",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Complementos para Arreglos Florales | Peluches y Regalos | Mundo Disney",
    description: "Peluches, cojines y regalos únicos para complementar tus arreglos florales. Ideas originales para regalar junto a flores.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Complementos para arreglos florales - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complementos para Arreglos Florales | Mundo Disney",
    description: "Peluches y regalos únicos para complementar tus arreglos florales.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function ArreglosFloralesPage() {
  return <ArreglosFloralesClient />
}
