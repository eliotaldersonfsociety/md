import type { Metadata } from "next"
import ConLogoClient from "./con-logo-client"

export const metadata: Metadata = {
  title: "Peluches con Logo Personalizados para Empresas | Mundo Disney",
  description: "Peluches con logo personalizado para empresas. Mascotas corporativas, material POP y regalos de marca. Pedidos desde 100 unidades.",
  keywords: [
    "peluches con logo",
    "peluches personalizados para empresas",
    "mascotas corporativas",
    "material POP",
    "regalos de marca",
    "peluches con logo personalizado",
    "peluches empresariales",
    "regalos corporativos con logo",
    "peluches para publicidad",
    "mascotas de marca",
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
    canonical: "/con-logo",
    languages: {
      "es-co": "/con-logo",
      "es-ve": "/con-logo?country=ve",
      "x-default": "/con-logo",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_VE"],
    url: "https://fabricadepeluchesmundodisney.com/con-logo",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Peluches con Logo Personalizados para Empresas | Mundo Disney",
    description: "Peluches con logo personalizado para empresas. Mascotas corporativas, material POP y regalos de marca.",
    images: [
      {
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Peluches con logo personalizado para empresas - Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peluches con Logo Personalizados para Empresas | Mundo Disney",
    description: "Peluches con logo personalizado para empresas. Mascotas corporativas, material POP y regalos de marca.",
    images: ["https://fabricadepeluchesmundodisney.com/images/logo.webp"],
  },
}

export default function ConLogoPage() {
  return <ConLogoClient />
}
