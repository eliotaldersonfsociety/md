"use client"

import { Button } from "@/components/ui/button"

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function WhatsAppModal({ isOpen, onClose, message }: WhatsAppModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 space-y-3">
        <p className="text-center font-semibold text-lg">Elige tu país</p>
        <a
          href={`https://wa.me/573112814787?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
        >
          <span className="text-xl">🇨🇴</span>
          <span className="font-medium">Colombia</span>
          <span className="ml-auto text-sm text-muted-foreground">+57 311 281 4787</span>
        </a>
        <a
          href={`https://wa.me/584221782843?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
        >
          <span className="text-xl">🇻🇪</span>
          <span className="font-medium">Venezuela</span>
          <span className="ml-auto text-sm text-muted-foreground">+58 422 178 2843</span>
        </a>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
