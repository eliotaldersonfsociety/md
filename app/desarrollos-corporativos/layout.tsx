import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Peluches al Por Mayor para Tiendas y Negocios | Mundo Disney",
  description: "Desarrollos corporativos y regalos empresariales personalizados. Diseño de mascotas de marca, material POP y kits de bienvenida.",
  canonical: "/desarrollos-corporativos",
}

export default function DesarrollosCorporativosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
