import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Términos de Uso | Fábrica de Peluches Mundo Disney",
  description: "Términos y condiciones de uso de Fábrica de Peluches Mundo Disney.",
  canonical: "/terminos",
}

export default function TerminosUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Términos de Uso</h1>

          <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
            <p>
              Al usar este sitio web, aceptás los siguientes términos. Si no estás de acuerdo, te pedimos que no utilices nuestros servicios.
            </p>

            <h2 className="text-xl font-semibold">1. Uso del sitio</h2>
            <p>
              Este sitio está destinado a usuarios mayores de 18 años. Podés utilizar nuestros productos y servicios para fines personales o empresariales, siempre que cumplas con estos términos.
            </p>

            <h2 className="text-xl font-semibold">2. Precios y disponibilidad</h2>
            <p>
              Los precios publicados pueden variar sin previo aviso. La disponibilidad de los productos está sujeta a stock. Nos reservamos el derecho de modificar o cancelar ofertas cuando sea necesario.
            </p>

            <h2 className="text-xl font-semibold">3. Pedidos y pagos</h2>
            <p>
              Al realizar un pedido, te comprometés a proporcionar información veraz y a realizar el pago correspondiente. Si existiese algún inconveniente con tu pago o pedido, te contactaremos para resolverlo.
            </p>

            <h2 className="text-xl font-semibold">4. Propiedad intelectual</h2>
            <p>
              Todo el contenido del sitio, incluyendo diseños, textos, logotipos e imágenes, pertenece a Fabrica de Peluches Mundo Disney o se usa con autorización. No podés reproducir ni distribuir este contenido sin autorización escrita.
            </p>

            <h2 className="text-xl font-semibold">5. Cambios en los términos</h2>
            <p>
              Podemos actualizar estos términos ocasionalmente. Te recomendamos revisar esta página periódicamente. El uso continuado del sitio implica aceptación de los cambios.
            </p>

            <h2 className="text-xl font-semibold">6. Contacto</h2>
            <p>
              Si tenés preguntas sobre estos términos, podés escribirnos por WhatsApp o visitar nuestra sección de Contacto.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
