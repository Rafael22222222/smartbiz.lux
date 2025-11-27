"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"
import { CURRENCIES, CurrencyCode } from "@/lib/currency"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CurrencySelector() {
    const { currency, setCurrency } = useCurrency()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
                >
                    {CURRENCIES[currency].symbol} {currency}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/10">
                {Object.entries(CURRENCIES).map(([code, info]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setCurrency(code as CurrencyCode)}
                        className="flex items-center justify-between"
                    >
                        <span>{info.symbol} {info.name}</span>
                        {currency === code && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
