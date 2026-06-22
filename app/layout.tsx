import type { Metadata, Viewport } from 'next'
import { Poppins, Quicksand } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/context/cart-context'
import { RatingProvider } from '@/context/rating-context'
import { ExchangeRateProvider } from '@/lib/exchange-rate'
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
  title: 'Mundo Disney - Fábrica de Peluches | Tus Tiernos Compañeros',
  description: 'Fábrica de peluches de alta calidad. Venta al por mayor y menor. Peluches tiernos, cojines, mantas y más. Emprende con nosotros.',
  keywords: ['peluches', 'fábrica de peluches', 'venta de peluches', 'mayorista peluches', 'peluches tiernos', 'mundo disney'],
  icons: {
    icon: '/images/favicon/1.png',
    apple: '/images/favicon/1.png',
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
        <ExchangeRateProvider>
          <CartProvider>
            <RatingProvider>
              {children}
            </RatingProvider>
          </CartProvider>
        </ExchangeRateProvider>
        <Analytics />
      </body>
    </html>
  )
}
