import type { Metadata } from "next"
import BabyShowerClient from "./baby-shower-client"

export const metadata: Metadata = {
  title: "Regalos para Baby Shower y Nacimientos | Peluches Personalizados | Mundo Disney",
  description: "Peluches personalizados y regalos únicos para baby shower y nacimientos. Los peluches más tiernos para celebrar la llegada del bebé. Envíos a Colombia y Venezuela.",
  keywords: [
    "regalos para baby shower",
    "peluches para baby shower",
    "regalos para nacimientos",
    "peluches para recién nacidos",
    "baby shower Colombia",
    "baby shower Venezuela",
    "peluches personalizados para baby shower",
    "regalos originales para baby shower",
    "peluches para bebés",
    "detalles para baby shower",
    "regalos para futuros papás",
    "cojines para baby shower",
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
    canonical: "/baby-shower",
    languages: {
      "es-co": "/baby-shower",
      "es-ve": "/baby-shower?country=ve",
      "x-default": "/baby-shower",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/baby-shower",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Regalos para Baby Shower y Nacimientos | Peluches Personalizados | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para baby shower y nacimientos. Los peluches más tiernos para celebrar la llegada del bebé.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Regalos para baby shower y nacimientos - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalos para Baby Shower y Nacimientos | Mundo Disney",
    description: "Peluches personalizados y regalos únicos para baby shower. Envíos a Colombia y Venezuela.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function BabyShowerPage() {
  return <BabyShowerClient />
}
