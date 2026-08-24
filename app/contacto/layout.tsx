import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto | Fábrica de Peluches Mundo Disney",
  description: "Contáctanos para pedidos personalizados, regalos empresariales o información. WhatsApp y teléfono disponibles para Colombia y Venezuela.",
  canonical: "/contacto",
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
