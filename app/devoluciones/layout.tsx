import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Devoluciones | Fábrica de Peluches Mundo Disney",
  description: "Política de devoluciones de Fábrica de Peluches Mundo Disney. Plazos, condiciones y proceso de reembolso.",
  canonical: "/devoluciones",
}

export default function DevolucionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
