import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PoliticasPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Políticas de Privacidad</h1>

          <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
            <p>
              En <strong>Fabrica de Peluches Mundo Disney</strong> valoramos tu privacidad. Esta política explica cómo podemos recolectar, usar y proteger tu información personal cuando visitas nuestro sitio o realizas una compra.
            </p>

            <h2 className="text-xl font-semibold">1. Información que recopilamos</h2>
            <p>
              Podemos solicitar datos personales como nombre, correo electrónico, número de teléfono, dirección y método de pago cuando completas un pedido o compartes información con nosotros.
            </p>

            <h2 className="text-xl font-semibold">2. Uso de la información</h2>
            <p>
              Usamos tu información para procesar pedidos, responder consultas, mejorar nuestros servicios y enviarte información relacionada con tu compra. No compartimos tus datos con terceros sin consentimiento, excepto cuando sea necesario para cumplir con la ley o procesar tu pedido.
            </p>

            <h2 className="text-xl font-semibold">3. Cookies y tecnologías similares</h2>
            <p>
              Nuestro sitio puede usar cookies para mejorar tu experiencia de navegación. Podés configurar tu navegador para bloquear cookies, aunque algunas funciones podrían verse afectadas.
            </p>

            <h2 className="text-xl font-semibold">4. Seguridad</h2>
            <p>
              Implementamos medidas razonables para proteger tu información. Sin embargo, ningún sistema es completamente seguro, por lo que recomendamos no compartir información sensible por canales no seguros.
            </p>

            <h2 className="text-xl font-semibold">5. Contacto</h2>
            <p>
              Si tenés preguntas sobre esta política, podés escribirnos por WhatsApp o visitar nuestra sección de Contacto.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
