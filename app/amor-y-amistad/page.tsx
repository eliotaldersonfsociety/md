import type { Metadata } from "next"
import AmorYAmistadClient from "./amor-y-amistad-client"

export const metadata: Metadata = {
  title: "Peluches y Regalos para Amor y Amistad | Mundo Disney",
  description: "Peluches personalizados y regalos únicos para el Día del Amor y la Amistad en Colombia. Ideas para parejas, amigos, familiares y compañeros. Envíos a todo el país.",
  keywords: [
    "regalos para Amor y Amistad",
    "regalos Amor y Amistad Colombia",
    "peluches para Amor y Amistad",
    "peluches Amor y Amistad",
    "regalos para el Día del Amor y la Amistad",
    "regalos para Amor y Amistad en Colombia",
    "peluches personalizados Amor y Amistad",
    "regalos para mi novia",
    "regalos para mi novio",
    "regalos para mi mejor amiga",
    "regalos para mi mejor amigo",
    "detalles para Amor y Amistad",
    "detalles para amigos",
    "regalos para parejas",
    "regalos personalizados",
    "peluches para regalar",
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
    canonical: "/amor-y-amistad",
    languages: {
      "es-co": "/amor-y-amistad",
      "es-ve": "/amor-y-amistad?country=ve",
      "x-default": "/amor-y-amistad",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/amor-y-amistad",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches y Regalos para Amor y Amistad | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para el Día del Amor y la Amistad en Colombia. Ideas para parejas, amigos, familiares y compañeros.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches y regalos para Amor y Amistad - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches y Regalos para Amor y Amistad | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para el Día del Amor y la Amistad en Colombia. Envíos a todo el país.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function AmorYAmistadPage() {
  return <AmorYAmistadClient />
}
