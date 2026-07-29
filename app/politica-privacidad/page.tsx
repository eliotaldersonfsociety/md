import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Política de Privacidad</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            <p>Última actualización: 23 de junio de 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información que recopilamos</h2>
            <p>Recopilamos información que nos proporcionas directamente, como tu nombre, correo electrónico, número de teléfono, dirección de envío y datos de pago cuando realizas un pedido.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso de la información</h2>
            <p>Utilizamos tu información para procesar pedidos, mejorar nuestros productos y servicios, y comunicarnos contigo sobre el estado de tus compras. No compartimos tu información personal con terceros sin tu consentimiento.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Protección de datos</h2>
            <p>Implementamos medidas de seguridad para proteger tu información personal. Sin embargo, ninguna transmisión por Internet es 100% segura.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
            <p>Utilizamos cookies para mejorar tu experiencia de navegación. Puedes configurar tu navegador para rechazar cookies, pero esto podría afectar la funcionalidad del sitio.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, contáctanos a través de nuestros canales de atención.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contacto</h2>
            <p>Si tienes preguntas sobre esta política, puedes contactarnos a través del formulario de contacto o por WhatsApp.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
