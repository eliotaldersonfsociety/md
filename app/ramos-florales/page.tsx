import type { Metadata } from "next"
import RamosFloralesClient from "./ramos-florales-client"

export const metadata: Metadata = {
  title: "Ramos Florales en Colombia y Venezuela | Flores y Regalos | Mundo Disney",
  description: "Ramos florales en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion. Envios a Bogota, Medellin, Cali, Caracas, Maracaibo y mas.",
  keywords: [
    "ramos florales",
    "ramos florales bogota",
    "ramos florales medellin",
    "ramos florales cali",
    "ramos florales caracas",
    "ramos florales maracaibo",
    "ramos florales colombia",
    "ramos florales venezuela",
    "ramos con peluches",
    "ramos con flores",
    "ramos para cumpleanos",
    "ramos para aniversario",
    "ramos para san valentin",
    "ramos personalizados",
    "flores con peluches",
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
    canonical: "/ramos-florales",
    languages: {
      "es-co": "/ramos-florales",
      "es-ve": "/ramos-florales?country=ve",
      "x-default": "/ramos-florales",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/ramos-florales",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Ramos Florales en Colombia y Venezuela | Flores y Regalos | Mundo Disney",
    description: "Ramos florales en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Ramos florales en Colombia y Venezuela - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramos Florales en Colombia y Venezuela | Mundo Disney",
    description: "Ramos florales en Colombia y Venezuela. Flores, peluches, cojines y detalles para toda ocasion.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function RamosFloralesPage() {
  return <RamosFloralesClient />
}
