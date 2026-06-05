import { Button } from "@/components/ui/button"
import { Building2, Palette, Award, Boxes, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Diseño Personalizado",
    description: "Creamos productos únicos según la imagen de tu marca"
  },
  {
    icon: Boxes,
    title: "Mínimo 200 Unidades",
    description: "Producción eficiente con precios competitivos"
  },
  {
    icon: Award,
    title: "Alta Calidad",
    description: "Materiales premium que representan tu marca"
  },
  {
    icon: Building2,
    title: "Empresas Reconocidas",
    description: "Hemos trabajado con grandes marcas del país"
  }
]

export function CorporateSection() {
  return (
    <section id="corporativo" className="py-20 bg-foreground text-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-card/10 text-card text-sm font-medium mb-4">
            Productos Corporativos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Desarrollamos Tus Ideas
          </h2>
          <p className="text-card/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            Creamos tu producto corporativo a partir de 200 unidades con un proceso claro 
            y un gran beneficio de posicionamiento de marca. Tu mascota corporativa cobra vida 
            en nuestras manos expertas.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card/5 border border-card/10 hover:bg-card/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-card/60">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              Solicitar Cotización
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-card/30 text-card hover:bg-card/10">
              Ver Portafolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
