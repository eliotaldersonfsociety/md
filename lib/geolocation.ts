'use client'

import { useEffect, useState } from "react"

const COP_TO_USD_RATE = 0.00024

export function useGeolocation(vercelCountry?: string | null) {
  const [isColombia, setIsColombia] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [debug, setDebug] = useState<any>(null)

  useEffect(() => {
    let cancelled = false

    async function detect() {
      if (vercelCountry) {
        const detected = vercelCountry.toUpperCase() === "CO"
        const country = vercelCountry.toUpperCase()
        setIsColombia(detected)
        setDebug({
          country,
          source: "vercel",
          finalIsColombia: detected,
        })
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/geolocation")
        const data = await response.json()
        if (cancelled) return

        const fromIp = data.source !== "vercel"
        const country = data.country || ""
        const finalIsColombia = !!data.isColombia

        setIsColombia(finalIsColombia)
        setDebug({
          ip: data.debug?.ip || null,
          country,
          fromIp,
          source: data.source || "ipapi",
          finalIsColombia,
        })
      } catch (error) {
        if (cancelled) return
        setIsColombia(true)
        setDebug({
          ip: null,
          country: null,
          fromIp: false,
          source: null,
          finalIsColombia: true,
        })
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    detect()
    return () => {
      cancelled = true
    }
  }, [vercelCountry])

  return { isColombia, isLoading, debug }
}

export function formatPriceCurrency(price: number, isColombia: boolean) {
  const displayPrice = isColombia ? price : Math.round(price * COP_TO_USD_RATE)
  return new Intl.NumberFormat(isColombia ? "es-CO" : "en-US", {
    style: "currency",
    currency: isColombia ? "COP" : "USD",
    minimumFractionDigits: 0,
  }).format(displayPrice)
}
