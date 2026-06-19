"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Truck, Shield, Minus, Plus, Trash2, CheckCircle2, Package, Upload, X, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { useUSDPrice } from "@/lib/exchange-rate"
import { formatPrice } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createOrderAction, uploadScreenshotAction } from "@/db/actions"

const paymentData: Record<string, { label: string; value: string }> = {
  daviplata: { label: "Numero de celular", value: "3006144416" },
  nequi: { label: "Numero de celular", value: "3219412929" },
  bancolombia: { label: "Numero de cuenta de ahorros", value: "9756325225" },
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const isWholesaleMode = searchParams.get('mode') === 'wholesale'
  const [copied, setCopied] = useState(false)

  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    wholesaleItems,
    removeFromWholesale,
    updateWholesaleQuantity,
    getWholesaleTotal,
    getTotalUnits,
    clearWholesale
  } = useCart()
  const { formatUSD } = useUSDPrice()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"daviplata" | "nequi" | "bancolombia">("daviplata")
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    businessName: "",
    nit: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    department: "",
    postalCode: "",
    notes: "",
    paymentReference: "",
    paymentScreenshot: ""
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showColombiaCarriers, setShowColombiaCarriers] = useState(true)
  const [showVenezuelaCarriers, setShowVenezuelaCarriers] = useState(false)

  // Determinar que items mostrar
  const displayItems = isWholesaleMode ? wholesaleItems : items
  const displayTotal = isWholesaleMode ? getWholesaleTotal() : getCartTotal()
  const displayClear = isWholesaleMode ? clearWholesale : clearCart
  
  const shippingCost = 0
  const total = displayTotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const extractVariantLabel = (name: string): string => {
    const match = name.match(/ - (.+)$/)
    return match ? match[1] : ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const orderData = {
      mode: (isWholesaleMode ? "wholesale" : "retail") as "retail" | "wholesale",
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      nit: formData.nit,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      department: formData.department,
      postalCode: formData.postalCode,
      paymentMethod,
      paymentReference: formData.paymentReference,
      paymentScreenshot: formData.paymentScreenshot,
      subtotal: displayTotal,
      shippingCost: 0,
      total,
      notes: formData.notes,
      items: displayItems.map((item) => {
        const variantLabel = (item as any).variantLabel || extractVariantLabel(item.name)
        return {
          productId: item.id,
          productName: item.name,
          variantLabel,
          productPrice: isWholesaleMode ? item.wholesalePrice : item.price,
          quantity: item.quantity
        }
      })
    }

    try {
      const result = await createOrderAction(orderData)
      setOrderNumber(result.orderNumber)
      setOrderComplete(true)
      displayClear()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-border">
          <div className={`w-20 h-20 ${isWholesaleMode ? 'bg-green-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <CheckCircle2 className={`w-10 h-10 ${isWholesaleMode ? 'text-green-600' : 'text-green-600'}`} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isWholesaleMode ? 'Cotizacion Solicitada' : 'Pedido Confirmado'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isWholesaleMode 
              ? 'Hemos recibido tu solicitud de cotizacion. Un asesor se comunicara contigo en las proximas 24 horas para confirmar tu pedido mayorista.'
              : 'Gracias por tu compra. Te enviaremos un correo con los detalles de tu pedido y el numero de seguimiento.'
            }
          </p>
          <div className={`${isWholesaleMode ? 'bg-green-50 border-green-200' : 'bg-muted/50'} rounded-xl p-4 mb-6 border`}>
            <p className="text-sm text-muted-foreground mb-1">
              {isWholesaleMode ? 'Numero de cotizacion' : 'Numero de orden'}
            </p>
<p className={`text-lg font-bold ${isWholesaleMode ? 'text-green-600' : 'text-[#5c2d91]'}`}>
               #{orderNumber || `${isWholesaleMode ? 'COT' : 'PEL'}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
             </p>
          </div>
          <Link href="/">
            <Button className={`w-full ${isWholesaleMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#5c2d91] hover:bg-[#5c2d91]/90'} text-white rounded-full`}>
              Volver a la Tienda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center shadow-xl border border-border">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            {isWholesaleMode ? <Package className="w-10 h-10 text-muted-foreground" /> : <Truck className="w-10 h-10 text-muted-foreground" />}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isWholesaleMode ? 'Tu lista de mayoreo esta vacia' : 'Tu carrito esta vacio'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isWholesaleMode 
              ? 'Selecciona "Al Mayor" en productos y agrega items a tu lista de pedido mayorista.'
              : 'Agrega algunos peluches adorables antes de continuar con el pago.'
            }
          </p>
          <Link href="/#productos">
            <Button className={`w-full ${isWholesaleMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#5c2d91] hover:bg-[#5c2d91]/90'} text-white rounded-full`}>
              Ver Productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-6">
        {/* Wholesale Banner */}
        {isWholesaleMode && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-800">Solicitud de Cotizacion Mayorista</h3>
              <p className="text-xs text-green-700">
                Completa tus datos y un asesor confirmara disponibilidad y precio final en 24 horas.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-6">
                {(isWholesaleMode ? [1, 2] : [1, 2, 3]).map((s, idx, arr) => (
                  <div key={s} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step >= s 
                          ? isWholesaleMode ? 'bg-green-600 text-white' : 'bg-[#5c2d91] text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {s}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className={`w-16 h-1 mx-2 rounded ${step > s ? (isWholesaleMode ? 'bg-green-600' : 'bg-[#5c2d91]') : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Contact / Business Info */}
              {step === 1 && (
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    {isWholesaleMode ? 'Informacion del Negocio' : 'Informacion de Contacto'}
                  </h2>
                  <div className="flex flex-col gap-2.5">
                    {isWholesaleMode && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Nombre del Negocio / Empresa
                          </label>
                          <Input
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Mi Tienda de Peluches"
                            required
                            className="rounded-xl h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            NIT / Cedula (opcional)
                          </label>
                          <Input
                            name="nit"
                            value={formData.nit}
                            onChange={handleInputChange}
                            placeholder="900.123.456-7"
                            className="rounded-xl h-9 text-sm"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Correo electronico
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                        className="rounded-xl h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">
                        Telefono / WhatsApp
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567"
                        required
                        className="rounded-xl h-9 text-sm"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    className={`w-full mt-4 h-9 text-sm ${isWholesaleMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#00bcd4] hover:bg-[#00acc1]'} text-white rounded-full`}
                  >
                    {isWholesaleMode ? 'Continuar' : 'Continuar al Envio'}
                  </Button>
                </div>
              )}

{/* Step 2: Shipping (both modes) */}
               {step === 2 && (
                 <div className="bg-card rounded-2xl p-4 border border-border">
                   <h2 className="text-base font-semibold text-foreground mb-4">
                     {isWholesaleMode ? 'Direccion de Entrega y Notas' : 'Direccion de Envio (Gratis en Cucuta o San Cristobal Rubio San Antonio)'}
                   </h2>

                   <div className="flex flex-col gap-2">
                     <div>
                       <label className="block text-xs font-medium text-foreground mb-1.5">Apellido</label>
                       <Input
                         name="lastName"
                         value={formData.lastName}
                         onChange={handleInputChange}
                         placeholder="Perez"
                         required
                         className="rounded-xl h-9 text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-foreground mb-1.5">Direccion</label>
                       <Input
                         name="address"
                         value={formData.address}
                         onChange={handleInputChange}
                         placeholder="Calle 123 #45-67"
                         required
                         className="rounded-xl h-9 text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-foreground mb-1.5">Apartamento, oficina, etc. (opcional)</label>
                       <Input
                         name="apartment"
                         value={formData.apartment}
                         onChange={handleInputChange}
                         placeholder="Apto 101 / Local 5"
                         className="rounded-xl h-9 text-sm"
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block text-xs font-medium text-foreground mb-1.5">Ciudad</label>
                         <Input
                           name="city"
                           value={formData.city}
                           onChange={handleInputChange}
                           placeholder="Bogota"
                           required
                           className="rounded-xl h-9 text-sm"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-medium text-foreground mb-1.5">Departamento</label>
                         <Input
                           name="department"
                           value={formData.department}
                           onChange={handleInputChange}
                           placeholder="Cundinamarca"
                           required
                           className="rounded-xl h-9 text-sm"
                         />
                       </div>
                     </div>
                    
                     {isWholesaleMode && (
                       <div>
                         <label className="block text-xs font-medium text-foreground mb-1.5">
                           Notas adicionales (opcional)
                         </label>
                         <textarea
                           name="notes"
                           value={formData.notes}
                           onChange={handleInputChange}
                           placeholder="Informacion adicional sobre tu pedido, preferencias de empaque, frecuencia de compra, etc."
                           className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring"
                         />
                       </div>
                     )}
                   </div>
                   <div className="flex gap-2 mt-4">
                     <Button 
                       type="button"
                       variant="outline"
                       onClick={() => setStep(1)}
                       className="flex-1 rounded-full h-9 text-sm"
                     >
                       Atras
                     </Button>
                     {isWholesaleMode ? (
                       <Button 
                         type="submit"
                         disabled={isSubmitting}
                         className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full h-9 text-sm"
                       >
                         {isSubmitting ? "Enviando..." : "Solicitar Cotizacion"}
                       </Button>
                     ) : (
                       <Button 
                         type="button"
                         onClick={() => setStep(3)}
                         className="flex-1 bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-full h-9 text-sm"
                       >
                         Continuar al Pago
                       </Button>
                     )}
                   </div>
                 </div>
               )}

              {/* Step 3: Payment (retail only) */}
              {step === 3 && !isWholesaleMode && (
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <h2 className="text-base font-semibold text-foreground mb-4">Metodo de Pago</h2>
                  
                   {/* Payment Methods */}
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4">
                     <button
                       type="button"
                       onClick={() => setPaymentMethod("daviplata")}
                       className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                         paymentMethod === "daviplata" 
                           ? 'border-[#ff0000] bg-[#ff0000]/5' 
                           : 'border-border bg-card hover:border-muted-foreground/50'
                       }`}
                     >
                       <Image src="/images/banderas/daviplata.svg" alt="Daviplata" width={32} height={32} className="h-8 w-8" />
                     </button>
                     <button
                       type="button"
                       onClick={() => setPaymentMethod("nequi")}
                       className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                         paymentMethod === "nequi" 
                           ? 'border-[#00c4cc] bg-[#00c4cc]/5' 
                           : 'border-border bg-card hover:border-muted-foreground/50'
                       }`}
                     >
                       <Image src="/images/banderas/nequi.svg" alt="Nequi" width={32} height={32} className="h-8 w-8" />
                     </button>
                     <button
                       type="button"
                       onClick={() => setPaymentMethod("bancolombia")}
                       className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                         paymentMethod === "bancolombia" 
                           ? 'border-[#003366] bg-[#003366]/5' 
                           : 'border-border bg-card hover:border-muted-foreground/50'
                       }`}
                     >
                       <Image src="/images/banderas/bancolombia.svg" alt="Bancolombia" width={32} height={32} className="h-8 w-8" />
                     </button>
                   </div>

                   <p className="text-[11px] text-muted-foreground -mt-1 mb-4">
                     Tambien aceptamos PayPal, Binance y Zelle. Escríbenos por WhatsApp para coordinar estos pagos.
                   </p>

{/* Payment Methods - All show reference field */}
                   <div className="grid gap-3">
                    
                    {/* Transportadoras - Step 3 */}
                    <div className="mb-5">
                      <p className="text-xs font-medium text-foreground mb-2">
                        Envio gratis a partir de $500.000 pesos
                      </p>
                      <p className="text-[11px] text-muted-foreground mb-2">Consulta por donde hacemos envios:</p>
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
                    </div>

                     <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Referencia de pago (# de transaccion)
                      </label>
                      <Input
                        name="paymentReference"
                        value={formData.paymentReference}
                        onChange={handleInputChange}
                        placeholder="Ingresa el numero de referencia"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Captura de pantalla del pago
                      </label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-muted-foreground/50 transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {selectedImage ? "Cambiar imagen" : "Subir captura de pantalla"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const form = new FormData()
                                form.append("file", file)
                                const result = await uploadScreenshotAction(form)
                                setSelectedImage(result.url)
                                setFormData(prev => ({ ...prev, paymentScreenshot: result.url }))
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {selectedImage && (
                          <div className="relative rounded-xl overflow-hidden border border-border">
                            <img 
                              src={selectedImage} 
                              alt="Captura" 
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImage(null)
                                setFormData(prev => ({ ...prev, paymentScreenshot: "" }))
                              }}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                  <div className={`p-3 rounded-xl border-2 border-dashed ${
                        paymentMethod === "nequi" ? 'bg-[#00c4cc]/10 border-[#00c4cc]/30' :
                        paymentMethod === "bancolombia" ? 'bg-[#003366]/10 border-[#003366]/30' :
                        'bg-[#ff0000]/10 border-[#ff0000]/30'
                      }`}>
                      <p className="text-[11px] text-muted-foreground mb-1.5">
                        {paymentMethod === "nequi" && "Transfiere a Nequi:"}
                        {paymentMethod === "bancolombia" && "Transfiere a Bancolombia: Cuenta de ahorros"}
                        {paymentMethod === "daviplata" && "Transfiere a Daviplata:"}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {paymentData[paymentMethod].label}
                          </p>
                          <p className="text-sm font-bold text-foreground mt-0.5">
                            {paymentData[paymentMethod].value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentData[paymentMethod].value)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-medium hover:bg-muted transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-green-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-5">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full h-10 text-sm"
                    >
                      Atras
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 rounded-full h-10 text-sm ${
                        paymentMethod === "daviplata" ? 'bg-[#ff0000] hover:bg-[#ff0000]/90' :
                        paymentMethod === "nequi" ? 'bg-[#00c4cc] hover:bg-[#00c4cc]/90' :
                        'bg-[#003366] hover:bg-[#003366]/90'
                      } text-white`}
                    >
                      {isSubmitting ? "Procesando..." : 
                        paymentMethod === "daviplata" ? `Pagar ${formatPrice(total)} (${formatUSD(total)})` :
                        paymentMethod === "nequi" ? `Confirmar ${formatPrice(total)} (${formatUSD(total)})` :
                        `Transferir ${formatPrice(total)} (${formatUSD(total)})`
                      }
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{isWholesaleMode ? 'Datos Seguros' : 'SSL Seguro'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Truck className="h-3.5 w-3.5" />
                  <span>{isWholesaleMode ? 'Envios Nacionales' : 'Envio Rastreable'}</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2">
            <div className={`bg-card rounded-2xl p-4 border ${isWholesaleMode ? 'border-green-200' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">
                  {isWholesaleMode ? 'Lista de Pedido' : 'Resumen del Pedido'}
                </h2>
                {isWholesaleMode && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {getTotalUnits()} unidades
                  </span>
                )}
              </div>
              
              {/* Cart Items */}
               <div className="flex flex-col gap-2.5 mb-5 max-h-60 overflow-y-auto">
                {displayItems.map((item) => (
                  <div key={item.id} className={`flex gap-2 p-2 ${isWholesaleMode ? 'bg-green-50' : 'bg-muted/30'} rounded-xl`}>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className={`absolute -top-1 -right-1 w-5 h-5 ${isWholesaleMode ? 'bg-green-600' : 'bg-[#5c2d91]'} text-white text-xs font-bold rounded-full flex items-center justify-center`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-xs leading-tight line-clamp-2">{item.name}</h4>
                      <p className={`text-xs font-bold mt-0.5 ${isWholesaleMode ? 'text-green-600' : 'text-[#e91e8c]'}`}>
                        {formatPrice((isWholesaleMode ? item.wholesalePrice : item.price) * item.quantity)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatUSD((isWholesaleMode ? item.wholesalePrice : item.price) * item.quantity)}
                      </p>
                      {isWholesaleMode && (
                        <p className="text-[10px] text-muted-foreground">
                          {formatPrice(item.wholesalePrice)} x {item.quantity} uds
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => isWholesaleMode ? removeFromWholesale(item.id) : removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => isWholesaleMode 
                            ? updateWholesaleQuantity(item.id, item.quantity - (isWholesaleMode ? 6 : 1)) 
                            : updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => isWholesaleMode 
                            ? updateWholesaleQuantity(item.id, item.quantity + (isWholesaleMode ? 6 : 1)) 
                            : updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code (retail only) */}
              {!isWholesaleMode && (
                <div className="flex gap-2 mb-6">
                  <Input placeholder="Codigo de descuento" className="rounded-xl" />
                  <Button variant="outline" className="rounded-xl px-6">
                    Aplicar
                  </Button>
                </div>
              )}

               {/* Totals */}
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatPrice(displayTotal)}</span>
                    <span className="block text-xs text-muted-foreground">{formatUSD(displayTotal)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#e91e8c]">
                      {formatPrice(total)}
                    </span>
                    <span className="block text-xs text-muted-foreground">{formatUSD(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
    )
  }

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
