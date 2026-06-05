import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Store, Rocket, TrendingUp, Users, ArrowRight } from "lucide-react"

const benefits = [
  {
    icon: Store,
    title: "Surte Tu Negocio",
    description: "Una marca reconocida unida a tu negocio genera excelentes ganancias y beneficios para tus clientes."
  },
  {
    icon: Rocket,
    title: "Inicia Tu Emprendimiento",
    description: "Somos la mejor opción para iniciar tu negocio con productos de alta calidad y demanda constante."
  },
  {
    icon: TrendingUp,
    title: "Rentabilidad Garantizada",
    description: "Márgenes de ganancia atractivos y productos que se venden solos por su calidad y ternura."
  },
  {
    icon: Users,
    title: "Soporte Continuo",
    description: "Te acompañamos en cada paso con asesoría personalizada y material de apoyo para tu negocio."
  }
]

export function WholesaleSection() {
  return (
    <section id="mayoreo" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/fondo/4.webp"
                alt="Fábrica de peluches"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-card text-2xl font-bold">
                  +15 años de experiencia
                </p>
                <p className="text-card/80">
                  Fabricando sonrisas y momentos especiales
                </p>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -right-4 -bottom-4 bg-card rounded-2xl p-4 shadow-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">+200%</p>
                  <p className="text-xs text-muted-foreground">Margen de ganancia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Emprende Con Nosotros
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Venta al Por Mayor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vender nuestros productos es una manera de emprendimiento rentable. 
                Únete a nuestra red de distribuidores y haz crecer tu negocio con productos 
                que enamoran a primera vista.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              Recibir Asesoría
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
