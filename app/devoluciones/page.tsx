"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RotateCcw, Clock, Package, AlertCircle, CheckCircle } from "lucide-react"

export default function DevolucionesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Devoluciones</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Política de Devoluciones
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Plazo de Devolución</h3>
                  <p className="text-muted-foreground">
                    Aceptamos devoluciones dentro de los 7 días posteriores a la recepción del producto.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Condiciones para Devolución</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      El producto debe estar en perfectas condiciones, sin uso y con su empaque original.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Los productos personalizados no pueden ser devueltos a menos que tengan defectos de fabricación.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      El cliente asume los costos de envío de la devolución.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Productos No Devueltos</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Productos con signos de uso o daño físico
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Productos personalizados sin defectos de fabricación
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Productos comprados con más de 7 días de anticipación
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">Proceso de Devolución</h3>
                  <ol className="text-muted-foreground space-y-2 text-sm">
                    <li>1. Contacta nuestro servicio al cliente por WhatsApp o email</li>
                    <li>2. Proporciona tu número de orden y motivo de devolución</li>
                    <li>3. Recibirás instrucciones para el envío del producto</li>
                    <li>4. Una vez recibido y verificado, se procesará el reembolso</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-2">¿Tienes dudas?</h3>
              <p className="text-muted-foreground text-sm">
                Si necesitas más información sobre nuestra política de devoluciones, no dudes en contactarnos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}