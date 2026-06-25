"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function EnviosPage() {
  const [showColombiaCarriers, setShowColombiaCarriers] = useState(true)
  const [showVenezuelaCarriers, setShowVenezuelaCarriers] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Envíos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Zonas de Envío y Transportadoras
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Envío gratis a partir de $500.000 pesos. Realizamos envíos a toda Colombia y Venezuela.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <p className="text-sm font-medium text-foreground mb-4">
              Envío gratis a partir de $500.000 pesos
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setShowColombiaCarriers(!showColombiaCarriers)}
                  className="flex items-center justify-between gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 hover:text-foreground transition-colors w-full"
                >
                  <span className="flex items-center gap-1.5">
                    Colombia
                    <Image src="/images/banderas/1.webp" alt="Colombia" width={16} height={12} className="inline-block rounded-sm" />
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showColombiaCarriers ? 'rotate-180' : ''}`} />
                </button>
                {showColombiaCarriers && (
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://interrapidisimo.com/cotiza-tu-envio/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-8 w-16 flex-shrink-0">
                        <Image src="/images/banderas/interrapisimo.png" alt="Interrapidisimo" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Interrapidisimo</span>
                    </a>
                    <a
                      href="https://www.servientrega.com/cotizar-envio"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-8 w-16 flex-shrink-0">
                        <Image src="/images/banderas/servientrega.jpg" alt="Servientrega" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Servientrega</span>
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={() => setShowVenezuelaCarriers(!showVenezuelaCarriers)}
                  className="flex items-center justify-between gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 hover:text-foreground transition-colors w-full"
                >
                  <span className="flex items-center gap-1.5">
                    Venezuela
                    <Image src="/images/banderas/2.webp" alt="Venezuela" width={16} height={12} className="inline-block rounded-sm" />
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showVenezuelaCarriers ? 'rotate-180' : ''}`} />
                </button>
                {showVenezuelaCarriers && (
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://mrwve.com/calcula-envio"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-8 w-16 flex-shrink-0">
                        <Image src="/images/banderas/mrw.svg" alt="MRW" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-medium text-foreground">MRW</span>
                    </a>
                    <a
                      href="https://zoom.red/consulta-de-precios/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-8 w-16 flex-shrink-0">
                        <Image src="/images/banderas/zoom.jpg" alt="Zoom" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Zoom</span>
                    </a>
                    <a
                      href="https://www.tealca.com/calculo-de-tarifas/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-white hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-8 w-16 flex-shrink-0">
                        <Image src="/images/banderas/tealca.png" alt="Tealca" fill className="object-contain" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Tealca</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Tiempo de Entrega</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cúcuta: 2-3 días hábiles</li>
                <li>• Otras ciudades de Colombia: 3-5 días hábiles</li>
                <li>• Venezuela: 5-10 días hábiles según la transportadora</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}