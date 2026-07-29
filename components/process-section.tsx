import { Lightbulb, Search, ClipboardList, CreditCard, Heart } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Lightbulb,
    title: "Recibimos tu idea",
    description: "Envíanos imágenes, especificaciones y cantidad de producto.",
  },
  {
    icon: Search,
    title: "Cotización",
    description: "5 días hábiles",
  },
  {
    icon: ClipboardList,
    title: "Solicitud, elaboración y aprobación del prototipo",
    description: "El prototipo será entregado 15 días hábiles después del pago.",
  },
  {
    icon: CreditCard,
    title: "Orden de compra y anticipo",
    description: "Aprobado el prototipo, recibida la orden de compra y el anticipo iniciamos producción.",
  },
  {
    icon: Heart,
    title: "Entrega final",
    description: "De acuerdo a los tiempos acordados",
  },
]

export function ProcessSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-primary mb-6">
          Nuestro Plan de Desarrollo
        </h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-16 text-lg">
          En Fábrica de Peluches Mundo Disney, convertimos tus ideas en soluciones creativas, innovadoras y totalmente personalizadas. Nuestro equipo de expertos se enfoca en comprender a profundidad tus necesidades y objetivos, trabajando contigo de forma cercana en cada etapa del proceso para crear desarrollos únicos que reflejen tu visión y conecten de verdad con lo que imaginas.

        </p>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {steps.slice(0, 3).map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-2xl mx-auto mb-16">
          {steps.slice(3).map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Certificate notice */}
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
            <span className="text-accent text-2xl">✓</span>
            Nuestros Peluches cuentan con el certificado de conformidad de producto
          </p>
          <Link 
            href="/contacto" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg"
          >
            <span className="text-accent">→</span>
            Clic <span className="underline">aquí</span> para diligenciar tu solicitud
          </Link>
        </div>
      </div>
    </section>
  )
}
