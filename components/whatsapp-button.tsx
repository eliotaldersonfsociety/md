"use client"

import { MessageCircle } from "lucide-react"
import { useState } from "react"

export function WhatsAppButton() {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showOptions && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 bg-white rounded-2xl p-3 shadow-lg border border-border">
          <a 
            href="https://wa.me/573101234567" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors whitespace-nowrap"
            onClick={() => setShowOptions(false)}
          >
            <span className="text-lg">🇨🇴</span>
            <span className="text-sm font-medium">Colombia</span>
          </a>
          <a 
            href="https://wa.me/584121234567" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors whitespace-nowrap"
            onClick={() => setShowOptions(false)}
          >
            <span className="text-lg">🇻🇪</span>
            <span className="text-sm font-medium">Venezuela</span>
          </a>
        </div>
      )}
      <button 
        onClick={() => setShowOptions(!showOptions)}
        className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp Contact Options"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  )
}
