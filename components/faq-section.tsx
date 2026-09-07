"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "¿Hacen envíos a todo Colombia y Venezuela?",
    answer: "Sí, realizamos envíos a todas las ciudades y municipios de Colombia y Venezuela. El envío es gratis a partir de $500.000 pesos."
  },
  {
    question: "¿Cuál es el tiempo de entrega?",
    answer: "El tiempo de entrega estimado es de 2 a 5 días hábiles, dependiendo de la zona y la transportadora."
  },
  {
    question: "¿Puedo personalizar mis productos?",
    answer: "Sí, todos nuestros productos son personalizables. Puedes agregar nombres, fechas, logos o diseños especiales."
  },
  {
    question: "¿Cuál es el pedido mínimo para compras al por mayor?",
    answer: "El pedido mínimo para compras al por mayor es de 3 unidades por referencia. Contáctanos para cotizaciones especiales."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos transferencias bancarias, pagos en efectivo y pagos por WhatsApp. Contáctanos para conocer todas las opciones."
  }
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Soporte
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros productos y servicios.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
