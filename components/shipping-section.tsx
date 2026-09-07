"use client"

import Image from "next/image"
import { Truck, Shield, Clock, Package } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Envíos a Todo Colombia",
    description: "Entregas seguras a todas las ciudades y municipios del país."
  },
  {
    icon: Package,
    title: "Envíos a Venezuela",
    description: "Cobertura en las principales ciudades de Venezuela."
  },
  {
    icon: Shield,
    title: "Embalaje Seguro",
    description: "Protegemos cada pedido para que llegue en perfectas condiciones."
  },
  {
    icon: Clock,
    title: "Tiempos de Entrega",
    description: "Entrega estimada de 2 a 5 días hábiles según la zona."
  }
]

export function ShippingSection() {
  return (
    <section id="envios" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Envíos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Envíos a Todo Colombia y Venezuela
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Envío gratis a partir de $500.000 pesos. Realizamos envíos a toda Colombia y Venezuela con las mejores transportadoras.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
