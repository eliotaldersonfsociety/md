import type { Metadata } from "next"
import ArreglosClient from "./arreglos-client"

export const metadata: Metadata = {
  title: "Arreglos en Colombia y Venezuela | Flores, Peluches y Regalos | Mundo Disney",
  description: "Encuentra los mejores arreglos en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion. Envios a Bogota, Medellin, Cali, Caracas, Maracaibo y mas.",
  keywords: [
    "arreglos",
    "arreglos florales",
    "arreglos en bogota",
    "arreglos en medellin",
    "arreglos en cali",
    "arreglos en caracas",
    "arreglos en maracaibo",
    "arreglos florales colombia",
    "arreglos florales venezuela",
    "peluches para arreglos",
    "cojines para arreglos",
    "regalos para cumpleanos",
    "regalos para aniversario",
    "detalles para san valentin",
    "flores con peluches",
    "arreglos personalizados",
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
    canonical: "/arreglos",
    languages: {
      "es-co": "/arreglos",
      "es-ve": "/arreglos?country=ve",
      "x-default": "/arreglos",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/arreglos",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Arreglos en Colombia y Venezuela | Flores, Peluches y Regalos | Mundo Disney",
    description: "Encuentra los mejores arreglos en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Arreglos en Colombia y Venezuela - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arreglos en Colombia y Venezuela | Mundo Disney",
    description: "Encuentra los mejores arreglos en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function ArreglosPage() {
  return <ArreglosClient />
}
