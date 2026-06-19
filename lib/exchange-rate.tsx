"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { formatUSDPrice } from "@/lib/utils"

interface ExchangeRateContextValue {
  rate: number
  loading: boolean
}

const ExchangeRateContext = createContext<ExchangeRateContextValue>({ rate: 0.00025, loading: true })

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [rate, setRate] = useState<number>(() => {
    if (typeof window === "undefined") return 0.00025
    const cached = localStorage.getItem("exchangeRate")
    return cached ? parseFloat(cached) : 0.00025
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data) => {
        if (data.rate) {
          setRate(data.rate)
          localStorage.setItem("exchangeRate", String(data.rate))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <ExchangeRateContext.Provider value={{ rate, loading }}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

export function useExchangeRate() {
  return useContext(ExchangeRateContext)
}

export function useUSDPrice() {
  const { rate, loading } = useExchangeRate()
  return {
    rate,
    loading,
    formatUSD: (priceCOP: number) => `${formatUSDPrice(priceCOP, rate)} USD`,
  }
}
