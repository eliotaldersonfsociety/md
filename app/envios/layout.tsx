import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Envíos | Fábrica de Peluches Mundo Disney",
  description: "Zonas de envío y transportadoras de Fábrica de Peluches Mundo Disney. Envíos a Colombia y Venezuela.",
  canonical: "/envios",
}

export default function EnviosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
