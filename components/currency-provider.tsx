"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { CurrencyCode, DEFAULT_CURRENCY } from '@/lib/currency'

type CurrencyContextType = {
    currency: CurrencyCode
    setCurrency: (currency: CurrencyCode) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)

    useEffect(() => {
        // Load currency from localStorage
        const saved = localStorage.getItem('smartbiz-currency')
        if (saved && ['NGN', 'USD', 'EUR', 'GBP'].includes(saved)) {
            setCurrencyState(saved as CurrencyCode)
        }
    }, [])

    const setCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency)
        localStorage.setItem('smartbiz-currency', newCurrency)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}
