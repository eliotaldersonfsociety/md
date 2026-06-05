"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Truck, Shield, Minus, Plus, Trash2, CheckCircle2, Package, Building2, FileText, Wallet, Banknote, Smartphone, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createOrderAction, uploadScreenshotAction } from "@/db/actions"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const isWholesaleMode = searchParams.get('mode') === 'wholesale'
  
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
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"daviplata" | "paypal" | "nequi" | "bancolombia" | "binance" | "zelle">("daviplata")
  
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

  // Determinar que items mostrar
  const displayItems = isWholesaleMode ? wholesaleItems : items
  const displayTotal = isWholesaleMode ? getWholesaleTotal() : getCartTotal()
  const displayClear = isWholesaleMode ? clearWholesale : clearCart
  
  const shippingCost = isWholesaleMode ? 0 : (displayTotal >= 150000 ? 0 : 12000)
  const total = displayTotal + shippingCost

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
      shippingCost,
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
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Wholesale Banner */}
        {isWholesaleMode && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Solicitud de Cotizacion Mayorista</h3>
              <p className="text-sm text-green-700">
                Completa tus datos y un asesor confirmara disponibilidad y precio final en 24 horas.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleSubmit}>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-8">
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
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {isWholesaleMode ? 'Informacion del Negocio' : 'Informacion de Contacto'}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {isWholesaleMode && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Nombre del Negocio / Empresa
                          </label>
                          <Input
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Mi Tienda de Peluches"
                            required
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            NIT / Cedula (opcional)
                          </label>
                          <Input
                            name="nit"
                            value={formData.nit}
                            onChange={handleInputChange}
                            placeholder="900.123.456-7"
                            className="rounded-xl"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Correo electronico
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Telefono / WhatsApp
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+57 300 123 4567"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    className={`w-full mt-6 ${isWholesaleMode ? 'bg-green-600 hover:bg-green-700' : 'bg-[#00bcd4] hover:bg-[#00acc1]'} text-white rounded-full`}
                  >
                    {isWholesaleMode ? 'Continuar' : 'Continuar al Envio'}
                  </Button>
                </div>
              )}

              {/* Step 2: Shipping (both modes) */}
              {step === 2 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {isWholesaleMode ? 'Direccion de Entrega y Notas' : 'Direccion de Envio'}
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Juan"
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Apellido</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Perez"
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Direccion</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Calle 123 #45-67"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Apartamento, oficina, etc. (opcional)</label>
                      <Input
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        placeholder="Apto 101 / Local 5"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Ciudad</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Bogota"
                          required
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Departamento</label>
                        <Input
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          placeholder="Cundinamarca"
                          required
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    
                    {isWholesaleMode && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Notas adicionales (opcional)
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Informacion adicional sobre tu pedido, preferencias de empaque, frecuencia de compra, etc."
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full"
                    >
                      Atras
                    </Button>
                    {isWholesaleMode ? (
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full"
                      >
                        {isSubmitting ? "Enviando..." : "Solicitar Cotizacion"}
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-full"
                      >
                        Continuar al Pago
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Payment (retail only) */}
              {step === 3 && !isWholesaleMode && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">Metodo de Pago</h2>
                  
                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("daviplata")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "daviplata" 
                          ? 'border-[#ff0000] bg-[#ff0000]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className={`h-5 w-5 ${paymentMethod === "daviplata" ? 'text-[#ff0000]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "daviplata" ? 'text-[#ff0000]' : 'text-muted-foreground'}`}>Daviplata</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "paypal" 
                          ? 'border-[#0070ba] bg-[#0070ba]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className={`h-5 w-5 ${paymentMethod === "paypal" ? 'text-[#0070ba]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "paypal" ? 'text-[#0070ba]' : 'text-muted-foreground'}`}>PayPal</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("nequi")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "nequi" 
                          ? 'border-[#00c4cc] bg-[#00c4cc]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className={`h-5 w-5 ${paymentMethod === "nequi" ? 'text-[#00c4cc]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "nequi" ? 'text-[#00c4cc]' : 'text-muted-foreground'}`}>Nequi</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bancolombia")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "bancolombia" 
                          ? 'border-[#003366] bg-[#003366]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className={`h-5 w-5 ${paymentMethod === "bancolombia" ? 'text-[#003366]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "bancolombia" ? 'text-[#003366]' : 'text-muted-foreground'}`}>Bancolombia</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("binance")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "binance" 
                          ? 'border-[#f3ba2d] bg-[#f3ba2d]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className={`h-5 w-5 ${paymentMethod === "binance" ? 'text-[#f3ba2d]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "binance" ? 'text-[#f3ba2d]' : 'text-muted-foreground'}`}>Binance</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("zelle")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === "zelle" 
                          ? 'border-[#001871] bg-[#001871]/5' 
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${paymentMethod === "zelle" ? 'text-[#001871]' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${paymentMethod === "zelle" ? 'text-[#001871]' : 'text-muted-foreground'}`}>Zelle</span>
                      </div>
                    </button>
                  </div>

                  {/* Payment Methods - All show reference field */}
                  <div className="grid gap-4">
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
                    
                    <div className={`p-4 rounded-xl ${
                        paymentMethod === "paypal" ? 'bg-[#0070ba]/10 border border-[#0070ba]/20' :
                        paymentMethod === "nequi" ? 'bg-[#00c4cc]/10 border border-[#00c4cc]/20' :
                        paymentMethod === "bancolombia" ? 'bg-[#003366]/10 border border-[#003366]/20' :
                        paymentMethod === "binance" ? 'bg-[#f3ba2d]/10 border border-[#f3ba2d]/20' :
                        paymentMethod === "daviplata" ? 'bg-[#ff0000]/10 border border-[#ff0000]/20' :
                        'bg-[#001871]/10 border border-[#001871]/20'
                      }`}>
                      <p className="text-xs text-muted-foreground">
                        {paymentMethod === "paypal" && "Envia el pago a: pagos@peluchesmundo.com"}
                        {paymentMethod === "nequi" && "Transfiere a Nequi: 300 123 4567"}
                        {paymentMethod === "bancolombia" && "Transfiere a Bancolombia: Cuenta de ahorros 123456789"}
                        {paymentMethod === "binance" && "Pago en Binance Pay: ID 12345678"}
                        {paymentMethod === "daviplata" && "Transfiere a Daviplata: 300 123 4567"}
                        {paymentMethod === "zelle" && "Pago por Zelle: pagos@peluchesmundo.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full"
                    >
                      Atras
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 rounded-full ${
                        paymentMethod === "daviplata" ? 'bg-[#ff0000] hover:bg-[#ff0000]/90' :
                        paymentMethod === "paypal" ? 'bg-[#0070ba] hover:bg-[#0070ba]/90' :
                        paymentMethod === "nequi" ? 'bg-[#00c4cc] hover:bg-[#00c4cc]/90' :
                        paymentMethod === "bancolombia" ? 'bg-[#003366] hover:bg-[#003366]/90' :
                        paymentMethod === "binance" ? 'bg-[#f3ba2d] hover:bg-[#f3ba2d]/90' :
                        'bg-[#001871] hover:bg-[#001871]/90'
                      } text-white`}
                    >
                      {isSubmitting ? "Procesando..." : 
                        paymentMethod === "daviplata" ? `Pagar con Daviplata ${formatPrice(total)}` :
                        paymentMethod === "paypal" ? `Pagar con PayPal ${formatPrice(total)}` :
                        paymentMethod === "nequi" ? `Confirmar pago Nequi ${formatPrice(total)}` :
                        paymentMethod === "bancolombia" ? `Confirmar transferencia ${formatPrice(total)}` :
                        paymentMethod === "binance" ? `Pagar con Binance ${formatPrice(total)}` :
                        `Pagar con Zelle ${formatPrice(total)}`
                      }
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mt-8 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>{isWholesaleMode ? 'Datos Seguros' : 'SSL Seguro'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>{isWholesaleMode ? 'Envios Nacionales' : 'Envio Rastreable'}</span>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2">
            <div className={`bg-card rounded-2xl p-6 border ${isWholesaleMode ? 'border-green-200' : 'border-border'} sticky top-8`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {isWholesaleMode ? 'Lista de Pedido' : 'Resumen del Pedido'}
                </h2>
                {isWholesaleMode && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {getTotalUnits()} unidades
                  </span>
                )}
              </div>
              
              {/* Cart Items */}
              <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto">
                {displayItems.map((item) => (
                  <div key={item.id} className={`flex gap-4 p-3 ${isWholesaleMode ? 'bg-green-50' : 'bg-muted/30'} rounded-xl`}>
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
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
                      <h4 className="font-medium text-foreground text-sm truncate">{item.name}</h4>
                      <p className={`text-sm font-bold ${isWholesaleMode ? 'text-green-600' : 'text-[#e91e8c]'}`}>
                        {formatPrice((isWholesaleMode ? item.wholesalePrice : item.price) * item.quantity)}
                      </p>
                      {isWholesaleMode && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.wholesalePrice)} x {item.quantity} uds
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between">
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
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium">{formatPrice(displayTotal)}</span>
                </div>
                {isWholesaleMode ? (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total unidades</span>
                    <span className="text-sm font-medium">{getTotalUnits()} uds</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Envio</span>
                      <span className={`text-sm ${shippingCost === 0 ? 'text-green-600 font-medium' : ''}`}>
                        {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Envio gratis en compras mayores a {formatPrice(150000)}
                      </p>
                    )}
                  </>
                )}
<div className="flex items-center justify-between pt-3 border-t border-border">
                   <span className="text-lg font-bold">{isWholesaleMode ? 'Total Estimado' : 'Total'}</span>
                   <span className={`text-xl font-bold ${isWholesaleMode ? 'text-green-600' : 'text-[#e91e8c]'}`}>
                     {formatPrice(total)}
                   </span>
                 </div>
                 {isWholesaleMode && (
                   <p className="text-xs text-muted-foreground mt-2">
                     * El precio final sera confirmado por nuestro equipo segun disponibilidad
                   </p>
                 )}
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
