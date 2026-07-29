"use client"

import { X, Minus, Plus, Trash2, Package, FileText, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatPriceCurrency } from "@/lib/geolocation"
import { useGeolocation } from "@/lib/geolocation"

interface WholesaleDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function WholesaleDrawer({ isOpen, onClose }: WholesaleDrawerProps) {
  const { 
    wholesaleItems, 
    updateWholesaleQuantity, 
    removeFromWholesale, 
    clearWholesale,
    getWholesaleTotal,
    getTotalUnits
  } = useCart()
  const { isColombia } = useGeolocation()

  const generateWhatsAppMessage = () => {
    let message = "Hola! Me interesa hacer un pedido al por mayor:\n\n"
    
    wholesaleItems.forEach((item) => {
      message += `- ${item.name}: ${item.quantity} unidades x ${formatPriceCurrency(item.wholesalePrice, isColombia)} = ${formatPriceCurrency(item.wholesalePrice * item.quantity, isColombia)}\n`
    })
    
    message += `\nTotal unidades: ${getTotalUnits()}`
    message += `\nTotal estimado: ${formatPriceCurrency(getWholesaleTotal(), isColombia)}`
    message += "\n\nQuedo atento a confirmar disponibilidad y coordinar el envio."
    
    return encodeURIComponent(message)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-card shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-green-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Pedido Mayorista</h2>
                <p className="text-sm text-green-100">
                  {wholesaleItems.length} referencias - {getTotalUnits()} unidades
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {wholesaleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Package className="w-12 h-12 text-green-300" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Tu pedido esta vacio
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Selecciona "Al Mayor" y agrega productos a tu lista de pedido mayorista
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wholesaleItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-green-600 font-semibold">
                        {formatPriceCurrency(item.wholesalePrice, isColombia)} c/u
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Subtotal: {formatPriceCurrency(item.wholesalePrice * item.quantity, isColombia)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 rounded-full"
                          onClick={() => updateWholesaleQuantity(item.id, item.quantity - 6)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-semibold min-w-[50px] text-center">
                          {item.quantity} uds
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-7 h-7 rounded-full"
                          onClick={() => updateWholesaleQuantity(item.id, item.quantity + 6)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-full text-destructive hover:bg-destructive/10 ml-auto"
                          onClick={() => removeFromWholesale(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wholesaleItems.length > 0 && (
            <div className="border-t border-border p-4 bg-muted/30">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Referencias</span>
                  <span className="font-medium">{wholesaleItems.length} productos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total unidades</span>
                  <span className="font-medium">{getTotalUnits()} unidades</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-border">
                  <span className="font-semibold">Total Estimado</span>
<span className="font-bold text-green-600">
                      {formatPriceCurrency(getWholesaleTotal(), isColombia)}
                    </span>
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-green-700">
                  Los precios mayoristas estan sujetos a disponibilidad. Un asesor confirmara tu pedido y te enviara la cotizacion final.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/573112814787?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Pedido por WhatsApp
                  </Button>
                </a>
                <Link href="/checkout?mode=wholesale" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={onClose}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Solicitar Cotizacion Formal
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-destructive"
                  onClick={clearWholesale}
                >
                  Vaciar Lista
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
