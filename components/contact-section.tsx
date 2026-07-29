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
    details: ["Cúcuta, San Antonio del Táchira, Rubio"]
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
    <section id="contacto" className="py-12 md:py-20 bg-muted/30">
      {/* CAMBIO: py-12 en móvil, py-20 en desktop */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* CAMBIO: gap-8 en móvil, gap-12 en desktop */}

          {/* Contact Info */}
          <div className="space-y-6 md:space-y-8">
            {/* CAMBIO: space-y-6 en móvil */}
            <div>
              <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3 md:mb-4">
                {/* CAMBIO: text-xs y padding reducido en móvil */}
                Contacto
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4 text-balance">
                {/* CAMBIO: text-2xl en móvil, escalado progresivo */}
                ¿Tienes Preguntas?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {/* CAMBIO: text-sm en móvil */}
                Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                Ya sea para pedidos, cotizaciones o cualquier consulta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* CAMBIO: grid-cols-1 en móvil, gap-3 reducido */}
              {contactInfo.map((info) => (
                <div key={info.title} className="p-3 md:p-4 rounded-xl bg-card border border-border min-w-0">
                  {/* CAMBIO: p-3 en móvil, min-w-0 para evitar desbordamiento */}
                  <div className="flex items-start gap-2.5 md:gap-3">
                    {/* CAMBIO: gap-2.5 en móvil */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {/* CAMBIO: w-8 h-8 en móvil */}
                      <info.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      {/* CAMBIO: icono más pequeño en móvil */}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* CAMBIO: flex-1 asegura que ocupe el espacio disponible */}
                      <h3 className="font-semibold text-foreground text-sm md:text-base mb-1">
                        {/* CAMBIO: text-sm en móvil */}
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p 
                          key={idx} 
                          className="text-xs md:text-sm text-muted-foreground break-words leading-relaxed"
                        >
                          {/* CAMBIO: text-xs en móvil, break-words forzado */}
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 sm:p-6 md:p-8 shadow-lg">
            {/* CAMBIO: rounded-xl y p-4 en móvil pequeño */}
            {submitted ? (
              <div className="bg-[#fef9f0] border border-[#f5d0a9] rounded-xl md:rounded-2xl p-6 md:p-10 text-center">
                {/* CAMBIO: padding reducido en móvil */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#fde68a]/30 flex items-center justify-center mx-auto mb-4 md:mb-5">
                  {/* CAMBIO: icono más pequeño en móvil */}
                  <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-[#d97706]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1f2937] mb-2 md:mb-3">
                  Mensaje Enviado
                </h3>
                <p className="text-sm md:text-base text-[#6b7280] leading-relaxed">
                  Gracias por contactarnos. Nuestro equipo te responderá pronto.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-4 md:mt-6 rounded-xl text-sm"
                  size="sm"
                  // CAMBIO: size="sm" y margin reducido en móvil
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">
                  {/* CAMBIO: text-lg en móvil */}
                  Envíanos un Mensaje
                </h3>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 text-red-600 text-xs md:text-sm mb-3 md:mb-4">
                    {/* CAMBIO: padding y texto más pequeño en móvil */}
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* CAMBIO: space-y-3 en móvil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* CAMBIO: grid-cols-1 en móvil (inputs apilados), gap-3 */}
                    <div>
                      <label htmlFor="name" className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                        {/* CAMBIO: text-xs label en móvil */}
                        Nombre
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Tu nombre"
                        className="rounded-lg text-sm h-9 md:h-10"
                        // CAMBIO: altura reducida en móvil
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                        Correo Electrónico
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className="rounded-lg text-sm h-9 md:h-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Tu teléfono"
                        className="rounded-lg text-sm h-9 md:h-10"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                        Asunto
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="¿En qué podemos ayudarte?"
                        className="rounded-lg text-sm h-9 md:h-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      // CAMBIO: rows={3} en móvil (era 4)
                      placeholder="Escribe tu mensaje aquí..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="default"
                    // CAMBIO: size="default" en móvil, "lg" solo en desktop si quieres
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base h-10 md:h-11"
                    // CAMBIO: altura y texto reducidos en móvil
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
