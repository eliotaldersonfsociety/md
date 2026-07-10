"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Clock, Send, Building2, MessageCircle } from "lucide-react"
import { submitContactForm } from "@/db/actions"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  })
  const [selectedBranch, setSelectedBranch] = useState("Cúcuta")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await submitContactForm({
        name: formData.nombre,
        email: formData.email,
        phone: formData.telefono,
        subject: formData.asunto,
        message: formData.mensaje
      })
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image
          src="/images/fondo/1.webp"
          alt="Fábrica de Peluches Pelanas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Contáctanos
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
              Estamos listos para convertir tus ideas en peluches únicos
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ubicación</h3>
              <p className="text-muted-foreground text-sm">
                Cucuta, San Antonio del Tachira, Rubio 
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Teléfono</h3>
              <p className="text-muted-foreground text-sm">
                +57 321 343 8063<br />
                +58 422 178 2843
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground text-sm break-words max-w-full">
                fanricadepeluchesmundodisney@gmail.com<br />
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Horario</h3>
              <p className="text-muted-foreground text-sm">
                Lun - Vie: 8am - 6pm<br />
                Sáb: 9am - 2pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Escríbenos</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cuéntanos tu idea
                </h2>
                <p className="text-muted-foreground">
                  Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas hábiles.
                </p>
              </div>

              {submitted ? (
                <div className="bg-accent/10 border border-accent rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Mensaje Enviado</h3>
                  <p className="text-muted-foreground">
                    Gracias por contactarnos. Nuestro equipo te responderá pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                        Nombre completo *
                      </label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        className="rounded-xl border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="empresa" className="block text-sm font-medium text-foreground mb-2">
                        Empresa
                      </label>
                      <Input
                        id="empresa"
                        name="empresa"
                        type="text"
                        value={formData.empresa}
                        onChange={handleChange}
                        placeholder="Nombre de tu empresa"
                        className="rounded-xl border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className="rounded-xl border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-2">
                        Teléfono *
                      </label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+57 300 000 0000"
                        className="rounded-xl border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-foreground mb-2">
                      Asunto *
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      required
                      value={formData.asunto}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:ring-primary focus:outline-none"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="corporativo">Desarrollo Corporativo</option>
                      <option value="personalizado">Peluche Personalizado</option>
                      <option value="cotizacion">Solicitar Cotización</option>
                      <option value="mayorista">Compra Mayorista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu proyecto o idea..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:ring-primary focus:outline-none resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Right Side - Map & Info */}
            <div className="space-y-8">
              {/* Branch Selector */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setSelectedBranch("Cúcuta")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedBranch === "Cúcuta"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  Cúcuta 
                </button>
                <button
                  onClick={() => setSelectedBranch("San Antonio del Táchira")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedBranch === "San Antonio del Táchira"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  San Antonio del Táchira 
                </button>
                <button
                  onClick={() => setSelectedBranch("Rubio")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedBranch === "Rubio"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  Rubio 
                </button>
              </div>
              
              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border h-[300px] lg:h-[350px]">
                <iframe
                  src={`https://www.google.com/maps?q=${selectedBranch}${selectedBranch.includes("Rubio") ? ", Municipio Junín, Venezuela" : selectedBranch.includes("Táchira") ? ", Venezuela" : ", Colombia"}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ubicación ${selectedBranch} - Pelanas`}
                />
              </div>

              {/* Quick Contact Options */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
                <h3 className="text-xl font-bold mb-4">Contacto Rápido</h3>
                <p className="text-primary-foreground/90 mb-6">
                  ¿Prefieres hablar directamente? Contáctanos por WhatsApp o llámanos.
                </p>
                <div className="space-y-3">
                  <a 
                    href="https://wa.me/573112814787" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-accent text-accent-foreground rounded-xl px-5 py-3 font-semibold hover:bg-accent/90 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Colombia
                    <Image src="/images/banderas/1.webp" alt="Colombia" width={20} height={14} className="ml-auto rounded-sm" />
                  </a>
                  <a 
                    href="https://wa.me/584221782843" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-accent text-accent-foreground rounded-xl px-5 py-3 font-semibold hover:bg-accent/90 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Venezuela
                    <Image src="/images/banderas/2.webp" alt="Venezuela" width={20} height={14} className="ml-auto rounded-sm" />
                  </a>
                  
                </div>
              </div>

              {/* Corporate Info */}
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Desarrollos Corporativos</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      ¿Buscas crear peluches personalizados para tu empresa? Trabajamos con pedidos desde 100 unidades con precios especiales.
                    </p>
                    <a 
                      href="/empresas"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Ver más información
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Cuál es el pedido mínimo para desarrollos corporativos?",
                answer: "El pedido mínimo es de 100 unidades. Esto nos permite optimizar la producción y ofrecerte los mejores precios."
              },
              {
                question: "¿Cuánto tiempo toma la producción?",
                answer: "El tiempo de producción varía según la complejidad del diseño y la cantidad. Generalmente entre 3-6 semanas después de aprobar el prototipo."
              },
              {
                question: "¿Puedo ver un prototipo antes de hacer el pedido completo?",
                answer: "Sí, siempre creamos un prototipo para tu aprobación antes de iniciar la producción en masa."
              },
              {
                question: "¿Hacen envíos a otras ciudades de Colombia?",
                answer: "Sí, realizamos envíos a toda Colombia y Venezuela. Cúcuta y San Antonio del Táchira tienen envío gratis. El tiempo de entrega es de 2-5 días hábiles según tu ubicación."
              },
              {
                question: "¿Cuáles son las transportadoras disponibles?",
                answer: "Trabajamos con Interrapidisimo y Servientrega en Colombia, y MRW, Zoom y Tealca en Venezuela. Puedes ver más detalles en nuestra página de Envíos."
              },
              {
                question: "¿Cuál es la política de devoluciones?",
                answer: "Aceptamos devoluciones dentro de los 7 días posteriores a la recepción del producto, siempre que esté en perfectas condiciones y con su empaque original. Los productos personalizados no pueden ser devueltos a menos que tengan defectos de fabricación."
              }
            ].map((faq, index) => (
              <details 
                key={index}
                className="group bg-white rounded-xl border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-foreground hover:bg-muted/30 transition-colors">
                  {faq.question}
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
