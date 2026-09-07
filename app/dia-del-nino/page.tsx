import type { Metadata } from "next"
import DiaDelNinoClient from "./dia-del-nino-client"

export const metadata: Metadata = {
  title: "Regalos para el Día del Niño | Peluches Personalizados | Mundo Disney",
  description: "Peluches personalizados y regalos únicos para el Día del Niño. Los peluches más divertidos y tiernos para sorprender a los niños. Envíos a Colombia y Venezuela.",
  keywords: [
    "regalos para el Día del Niño",
    "peluches para el Día del Niño",
    "peluches para niños",
    "regalos para niños",
    "Día del Niño Colombia",
    "Día del Niño Venezuela",
    "peluches personalizados para niños",
    "regalos infantiles",
    "juguetes de peluche",
    "peluches para regalar a niños",
    "ideas para el Día del Niño",
    "regalos originales para niños",
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
    canonical: "/dia-del-nino",
    languages: {
      "es-co": "/dia-del-nino",
      "es-ve": "/dia-del-nino?country=ve",
      "x-default": "/dia-del-nino",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/dia-del-nino",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos para el Día del Niño | Peluches Personalizados | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para el Día del Niño. Los peluches más divertidos y tiernos para sorprender a los niños.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos para el Día del Niño - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos para el Día del Niño | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para el Día del Niño. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function DiaDelNinoPage() {
  return <DiaDelNinoClient />
}
