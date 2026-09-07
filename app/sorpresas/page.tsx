import type { Metadata } from "next"
import SorpresasClient from "./sorpresas-client"

export const metadata: Metadata = {
  title: "Sorpresas en Colombia y Venezuela | Regalos y Peluches | Mundo Disney",
  description: "Sorpresas en Colombia y Venezuela. Regalos, peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales. Envios a Bogota, Medellin, Cali, Caracas, Maracaibo y mas.",
  keywords: [
    "sorpresas",
    "sorpresas en bogota",
    "sorpresas en medellin",
    "sorpresas en cali",
    "sorpresas en caracas",
    "sorpresas en maracaibo",
    "sorpresas colombia",
    "sorpresas venezuela",
    "regalos sorpresa",
    "sorpresas para mi novia",
    "sorpresas para mi novio",
    "sorpresas de cumpleanos",
    "sorpresas de aniversario",
    "sorpresas personalizadas",
    "peluches sorpresa",
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
    canonical: "/sorpresas",
    languages: {
      "es-co": "/sorpresas",
      "es-ve": "/sorpresas?country=ve",
      "x-default": "/sorpresas",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/sorpresas",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Sorpresas en Colombia y Venezuela | Regalos y Peluches | Mundo Disney",
    description: "Sorpresas en Colombia y Venezuela. Regalos, peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Sorpresas en Colombia y Venezuela - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorpresas en Colombia y Venezuela | Mundo Disney",
    description: "Sorpresas en Colombia y Venezuela. Regalos, peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function SorpresasPage() {
  return <SorpresasClient />
}
