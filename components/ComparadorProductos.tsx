"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"

export function ProductsComparison() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-[var(--font-montserrat)] mb-2">
            Productos Corporativos
          </h2>
          <p className="text-lg md:text-xl text-black font-medium">
            Desarrollamos Tus ideas
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left text */}
          <div className="max-w-xs text-center lg:text-right order-2 lg:order-1">
            <h3 className="text-primary font-semibold text-lg mb-3">
              Explora nuestra línea de desarrollos corporativos
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Creamos tu producto corporativo a partir de 200 unidades con un proceso claro y un gran beneficio de posicionamiento de marca.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Durante este tiempo hemos desarrollado una gran cantidad de productos para diferentes empresas, cada producto es único y diferente.
            </p>
          </div>

          {/* Image comparison slider */}
          <div 
            ref={containerRef}
            className="relative w-full max-w-md lg:max-w-lg aspect-square cursor-ew-resize select-none order-1 lg:order-2"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Final image (right side - full) */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src="/images/peluches/12.webp"
                alt="Producto final - Oso de peluche"
                fill
                className="object-contain"
                draggable={false}
              />
            </div>

            {/* Sketch image (left side - clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden rounded-lg"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src="/images/peluches/77.webp"
                alt="Boceto - Diseño del oso"
                fill
                className="object-contain"
                draggable={false}
              />
            </div>

            {/* Slider line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Slider handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <div className="flex items-center gap-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right text */}
          <div className="max-w-xs text-center lg:text-left order-3">
            <h3 className="text-primary font-semibold text-lg mb-3">
              Un Equipo Dedicado
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Creamos cualquier idea corporativa a través del diseño y fabricación de productos que impulsen la imagen, proyección y promoción de tu compañía.
            </p>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>Altos estándares de calidad</li>
              <li>Productos Duraderos</li>
              <li>Fidelización de tu marca</li>
              <li className="font-medium text-foreground">Somos el mejor aliado empresarial.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
