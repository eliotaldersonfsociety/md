"use client"

import { Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-cyan-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="text-primary-foreground space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              ¿QUE TE OFRECEMOS COMO ALIADOS CORPORATIVOS?
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-lg">
              Creamos cualquier idea corporativa a través del diseño y fabricación de productos que impulsen la imagen, proyección y promoción de tu compañía.
            </p>
            
            <ul className="space-y-3 text-primary-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Acuerdo de confidencialidad
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Certificado de conformidad de producto
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                Póliza de cumplimiento
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">•</span>
                +15 años de experiencia
              </li>
            </ul>
          </div>

          {/* Right content - Video thumbnail */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/hero-video-thumb.jpg"
                alt="Mira como hacemos tu idea realidad"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 lg:h-10 lg:w-10 text-primary-foreground fill-current ml-1" />
                </button>
              </div>
            </div>
            <p className="text-center text-primary-foreground/80 mt-4 text-sm lg:text-base">
              Mira como hacemos tu idea realidad
            </p>
          </div>
        </div>

        {/* Contact cards */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src="https://randomuser.me/api/portraits/men/72.jpg" alt="Jose Olarte" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Jose Olarte <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full ml-1">Online</span></p>
              <p className="text-xs text-muted-foreground">Venezuela Escríbenos</p>
            </div>
          </div>
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Claudia Aldana" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Claudia Aldana <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full ml-1">Online</span></p>
              <p className="text-xs text-muted-foreground">Colombia Escríbenos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
