import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, MessageCircle } from "lucide-react"

const footerLinks = {
  productos: [
    { name: "Peluches", href: "#" },
    { name: "Cojines", href: "#" },
    { name: "Mantas", href: "#" },
    { name: "Regalos", href: "#" }
  ],
  empresa: [
    { name: "Nosotros", href: "#" },
    { name: "Mayoreo", href: "#mayoreo" },
    { name: "Corporativo", href: "#corporativo" },
    { name: "Contacto", href: "#contacto" }
  ],
  soporte: [
    { name: "Preguntas Frecuentes", href: "#" },
    { name: "Envíos", href: "#" },
    { name: "Devoluciones", href: "#" },
    { name: "Términos y Condiciones", href: "#" }
  ]
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "WhatsApp", icon: MessageCircle, href: "#" }
]

export function Footer() {
  return (
    <footer className="bg-foreground text-card pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                <Image
                  src="/images/logo.webp"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-l font-bold">Fabrica de Peluches Mundo Disney</span>
            </Link>
            <p className="text-card/60 text-sm mb-4 leading-relaxed">
              Fábrica de peluches de alta calidad. Creamos sonrisas y momentos especiales desde hace más de 15 años.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-card/60 group-hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-card/60 hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-card/60 hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-card/60 hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-card/40 text-sm">
              © 2026 Fabrica de Peluches Mundo Disney. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/politica-privacidad" className="text-card/40 hover:text-card text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos-uso" className="text-card/40 hover:text-card text-sm transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
