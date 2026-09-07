import type { Metadata } from "next"
import DesayunosClient from "./desayunos-client"

export const metadata: Metadata = {
  title: "Desayunos Sorpresa en Colombia y Venezuela | Mundo Disney",
  description: "Desayunos sorpresa en Colombia y Venezuela. Peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales. Envios a Bogota, Medellin, Cali, Caracas, Maracaibo y mas.",
  keywords: [
    "desayunos sorpresa",
    "desayunos sorpresa bogota",
    "desayunos sorpresa medellin",
    "desayunos sorpresa cali",
    "desayunos sorpresa caracas",
    "desayunos sorpresa maracaibo",
    "desayunos sorpresa colombia",
    "desayunos sorpresa venezuela",
    "desayuno cumpleanos",
    "desayuno aniversario",
    "desayuno san valentin",
    "desayuno personalizado",
    "regalos de desayuno",
    "desayuno sorpresa para mi novia",
    "desayuno sorpresa para mi novio",
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
    canonical: "/desayunos",
    languages: {
      "es-co": "/desayunos",
      "es-ve": "/desayunos?country=ve",
      "x-default": "/desayunos",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/desayunos",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Desayunos Sorpresa en Colombia y Venezuela | Mundo Disney",
    description: "Desayunos sorpresa en Colombia y Venezuela. Peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Desayunos sorpresa en Colombia y Venezuela - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desayunos Sorpresa en Colombia y Venezuela | Mundo Disney",
    description: "Desayunos sorpresa en Colombia y Venezuela. Peluches, cojines y detalles para cumpleanos, aniversarios y fechas especiales.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function DesayunosPage() {
  return <DesayunosClient />
}
