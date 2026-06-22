"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { formatUSDPrice } from "@/lib/utils"

interface ExchangeRateContextValue {
  rate: number
  loading: boolean
  refresh: () => Promise<void>
}

const ExchangeRateContext = createContext<ExchangeRateContextValue>({ rate: 0.00025, loading: true, refresh: async () => {} })

const STORAGE_KEY = "exchangeRate"
const CACHE_TTL = 12 * 60 * 60 * 1000 // 12h

function getValidCachedRate(): number | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.rate || !parsed?.fetchedAt) return null
    if (Date.now() - Number(parsed.fetchedAt) > CACHE_TTL) return null
    return Number(parsed.rate)
  } catch {
    return null
  }
}

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [rate, setRate] = useState<number>(() => getValidCachedRate() ?? 0.00025)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch("/api/exchange-rate", { cache: "no-store" })
      const data = await res.json()
      if (data.rate) {
        setRate(data.rate)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate: data.rate, fetchedAt: Date.now() }))
      }
    } catch {
      // keep current rate on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const cached = getValidCachedRate()
    if (cached) {
      setRate(cached)
      setLoading(false)
    } else {
      refresh()
    }

    const interval = setInterval(() => {
      if (!active) return
      refresh()
    }, CACHE_TTL)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return (
    <ExchangeRateContext.Provider value={{ rate, loading, refresh }}>
      {children}
    </ExchangeRateContext.Provider>
  )
}

export function useExchangeRate() {
  return useContext(ExchangeRateContext)
}

export function useUSDPrice() {
  const { rate, loading, refresh } = useExchangeRate()
  return {
    rate,
    loading,
    refresh,
    formatUSD: (priceCOP: number) => `${formatUSDPrice(priceCOP, rate)} USD`,
  }
}
