import type { Metadata, Viewport } from 'next'
import { Poppins, Quicksand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { RatingProvider } from '@/context/rating-context'
import { Toaster } from 'sonner'
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/json-ld'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

const quicksand = Quicksand({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fabricadepeluchesmundodisney.com"),
  title: {
    default: "Fábrica de Peluches Mundo Disney | Peluches y Regalos Personalizados",
    template: "%s | Fábrica de Peluches Mundo Disney",
  },
  description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados. Envíos a todo Colombia y Venezuela. Pedidos al por mayor y detal para cumpleaños, eventos y empresas.",
  keywords: ["peluches", "cojines", "cervicales", "llaveros", "regalos personalizados", "peluches personalizados", "cojines personalizados", "regalos corporativos", "fabrica de peluches", "peluches en Colombia", "peluches en Venezuela"],
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
  canonical: "/",
  alternates: {
    canonical: "https://fabricadepeluchesmundodisney.com",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://fabricadepeluchesmundodisney.com",
    siteName: "Fábrica de Peluches Mundo Disney",
    title: "Fábrica de Peluches Mundo Disney | Peluches y Regalos Personalizados",
    description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados. Envíos a todo Colombia y Venezuela.",
    images: [
      {
        url: "/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Fábrica de Peluches Mundo Disney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fábrica de Peluches Mundo Disney | Peluches y Regalos Personalizados",
    description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados. Envíos a todo Colombia y Venezuela.",
    images: ["/images/logo.webp"],
  },
  verification: {
    google: "mOYPT4fAItFAfp7sgZDi7a9n1QxN2FF09bQM3gKcvO0",
  },
  icons: {
    icon: "/images/favicon/1.png",
    apple: "/images/favicon/1.png",
  },
}

export const viewport: Viewport = {
  themeColor: '#e8a4b8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${poppins.variable} ${quicksand.variable} antialiased`}>
        <CartProvider>
          <RatingProvider>
            {children}
          </RatingProvider>
        </CartProvider>
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
      </body>
    </html>
  )
}
