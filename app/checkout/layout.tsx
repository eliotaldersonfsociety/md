import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Fábrica de Peluches Mundo Disney",
  description: "Finaliza tu compra en Fábrica de Peluches Mundo Disney. Pago seguro y envío a todo Colombia y Venezuela.",
  canonical: "/checkout",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
