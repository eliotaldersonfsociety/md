import type { Metadata } from "next"
import NavidadClient from "./navidad-client"

export const metadata: Metadata = {
  title: "Peluches y Regalos para Navidad | Mundo Disney",
  description: "Peluches personalizados y regalos únicos para Navidad. Los mejores peluches para regalar en esta temporada. Envíos a Colombia y Venezuela.",
  keywords: [
    "regalos para Navidad",
    "peluches para Navidad",
    "peluches navideños",
    "regalos navideños",
    "Navidad Colombia",
    "Navidad Venezuela",
    "peluches personalizados para Navidad",
    "regalos originales para Navidad",
    "peluches para regalar en Navidad",
    "ideas de regalos navideños",
    "regalos personalizados Navidad",
    "peluches para niños Navidad",
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
    canonical: "/navidad",
    languages: {
      "es-co": "/navidad",
      "es-ve": "/navidad?country=ve",
      "x-default": "/navidad",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/navidad",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches y Regalos para Navidad | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para Navidad. Los mejores peluches para regalar en esta temporada.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches y regalos para Navidad - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches y Regalos para Navidad | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para Navidad. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function NavidadPage() {
  return <NavidadClient />
}
