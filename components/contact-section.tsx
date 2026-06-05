"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
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
    details: ["fabricadepeluchesmundodisney@gmail.com" ]
  },
  {
    icon: Clock,
    title: "Horario",
    details: ["Lunes - Viernes: 8am - 5pm", "Sábados: 9am - 1pm"]
  }
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const phone = formData.get("phone") as string
      const subject = formData.get("subject") as string
      const message = formData.get("message") as string
      
      const result = await submitContactForm({ name, email, phone, subject, message })
      return result
    },
    null
  )

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
             <h3 className="text-xl font-bold text-foreground mb-6">Envíanos un Mensaje</h3>
             <form action={formAction} className="space-y-4">
               <div className="grid sm:grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                     Nombre
                   </label>
                   <Input
                     id="name"
                     placeholder="Tu nombre"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                     type="email"
                     placeholder="tu@correo.com"
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                     placeholder="Tu teléfono"
                     value={formData.phone}
                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     className="rounded-lg"
                   />
                 </div>
                 <div>
                   <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                     Asunto
                   </label>
                   <Input
                     id="subject"
                     placeholder="¿En qué podemos ayudarte?"
                     value={formData.subject}
                     onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                   rows={4}
                   placeholder="Escribe tu mensaje aquí..."
                   value={formData.message}
                   onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                   className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                   required
                 />
               </div>
               <Button type="submit" size="lg" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                 Enviar Mensaje
                 <Send className="ml-2 h-4 w-4" />
               </Button>
             </form>
           </div>
        </div>
      </div>
    </section>
  )
}