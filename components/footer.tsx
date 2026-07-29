import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram } from "lucide-react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

const footerLinks = {
  productos: [
    { name: "Peluches", href: "/peluches" },
    { name: "Cojines", href: "/cojines" },
    { name: "Latas", href: "/latas" },
    { name: "Cervicales", href: "/cervicales" },
    { name: "Llaveros", href: "/llaveros" },
    { name: "Ropa", href: "/ropa" }
  ],
  empresa: [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Mayoreo", href: "/tienda" },
    { name: "Corporativo", href: "/empresas" },
    { name: "Contacto", href: "/contacto" }
  ],
  soporte: [
    { name: "Preguntas Frecuentes", href: "/contacto" },
    { name: "Envíos", href: "/contacto" },
    { name: "Devoluciones", href: "/contacto" },
    { name: "Términos y Condiciones", href: "/contacto" }
  ]
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/streetachira" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/fabricadepeluchesmundodisney" },
  { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@fabricamundodisney" }
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
              <Link href="/politicas" className="text-card/40 hover:text-card text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-card/40 hover:text-card text-sm transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
