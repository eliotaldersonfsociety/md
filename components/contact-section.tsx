"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react"
import { submitContactForm } from "@/db/actions"

const contactInfo = [
  {
    icon: MapPin,
    title: "Dirección",
    details: ["Cucuta, San Antonio del Tachira, Rubio"]
  },
  {
    icon: Phone,
    title: "Teléfonos",
    details: ["Ventas: +58 422 178 2843", "Col: +57 321 343 8063"]
  },
  {
    icon: Mail,
    title: "Correo",
    details: ["fabricadepeluchesmundodisney@gmail.com"]
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["Lunes - Viernes: 8am - 5pm", "Sábados: 9am - 1pm"]
  }
]

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    try {
      const result = await submitContactForm({ name, email, phone, subject, message })

      if (!result.success) {
        setSubmitError("Error al enviar el mensaje")
        return
      }

      setSubmitted(true)
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("Error inesperado al enviar el mensaje")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Contacto
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                ¿Tienes Preguntas?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                Ya sea para pedidos, cotizaciones o cualquier consulta.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <div key={info.title} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground break-words max-w-full">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
            {submitted ? (
              <div className="bg-[#fef9f0] border border-[#f5d0a9] rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#fde68a]/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-[#d97706]" />
                </div>
                <h3 className="text-xl font-bold text-[#1f2937] mb-3">
                  Mensaje Enviado
                </h3>
                <p className="text-[#6b7280] leading-relaxed">
                  Gracias por contactarnos. Nuestro equipo te responderá pronto.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-6 rounded-xl"
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6">Envíanos un Mensaje</h3>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-4">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nombre
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        className="rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Correo Electrónico
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className="rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Tu teléfono"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Asunto
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="¿En qué podemos ayudarte?"
                        className="rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
