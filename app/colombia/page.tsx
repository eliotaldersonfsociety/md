import type { Metadata } from "next"
import ColombiaClient from "./colombia-client"

export const metadata: Metadata = {
  title: "Peluches y Regalos Personalizados en Colombia | Mundo Disney",
  description: "Peluches personalizados, cojines y regalos únicos en Colombia. Envíos a Bogotá, Medellín, Cali, Barranquilla y todas las ciudades. Pedidos al por mayor y detal.",
  keywords: [
    "peluches en Colombia",
    "regalos personalizados en Colombia",
    "peluches personalizados Colombia",
    "cojines en Colombia",
    "regalos en Colombia",
    "envío a todo Colombia",
    "peluches Bogotá",
    "peluches Medellín",
    "peluches Cali",
    "peluches Barranquilla",
    "regalos por mayor Colombia",
    "regalos al detal Colombia",
    "empresas Colombia",
    "Día del Amor y la Amistad Colombia",
    "San Valentín Colombia",
    "Día de la Madre Colombia",
    "Día del Niño Colombia",
    "Navidad Colombia",
    "cumpleaños Colombia",
    "aniversario Colombia",
    "baby shower Colombia",
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
    canonical: "/colombia",
    languages: {
      "es-co": "/colombia",
      "es-ve": "/colombia?country=ve",
      "x-default": "/colombia",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/colombia",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches y Regalos Personalizados en Colombia | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos en Colombia. Envíos a Bogotá, Medellín, Cali, Barranquilla y todas las ciudades.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches y regalos personalizados en Colombia - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches y Regalos Personalizados en Colombia | Mundo Disney",
    description: "Peluches personalizados, cojines y regalos únicos en Colombia. Envíos a todas las ciudades.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function ColombiaPage() {
  return <ColombiaClient />
}
