import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function TerminosUsoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Términos de Uso</h1>
          <div className="prose prose-gray max-w-none space-y-6">
            <p>Última actualización: 23 de junio de 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceptación de los términos</h2>
            <p>Al acceder y utilizar este sitio web, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo, por favor no utilices el sitio.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso del sitio</h2>
            <p>Este sitio está destinado a la venta de productos personalizados. Te comprometes a proporcionar información veraz y completa al realizar un pedido.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Precios y pagos</h2>
            <p>Los precios mostrados incluyen IVA cuando corresponda. Nos reservamos el derecho de modificar precios en cualquier momento sin previo aviso. Los pagos deben realizarse a través de los métodos disponibles en el sitio.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Envíos</h2>
            <p>Realizamos envíos a nivel nacional e internacional. Los tiempos de entrega pueden variar según la ubicación y disponibilidad del producto.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Devoluciones</h2>
            <p>Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto, siempre que se encuentre en su estado original. Los gastos de envío de devolución corren por cuenta del cliente.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Propiedad intelectual</h2>
            <p>Todo el contenido del sitio, incluyendo imágenes, textos y logos, es propiedad de nuestra empresa y está protegido por leyes de derechos de autor.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitación de responsabilidad</h2>
            <p>No seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso de este sitio o de nuestros productos.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contacto</h2>
            <p>Para cualquier consulta sobre estos términos, contáctanos a través de nuestros canales de atención al cliente.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
