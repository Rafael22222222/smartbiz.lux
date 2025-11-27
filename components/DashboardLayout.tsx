"use client"

import { GlassCard } from "./GlassCard"
import { ModeToggle } from "./mode-toggle"
import { CurrencySelector } from "./currency-selector"
import { ProfileDropdown } from "./ProfileDropdown"
import Link from "next/link"
import { Home, Package } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver dark:from-graphite dark:via-slate dark:to-graphite p-3 sm:p-4 md:p-6 lg:p-8 font-sans text-foreground transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 py-2">
                    <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-8 w-full md:w-auto">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-graphite to-slate dark:from-white dark:to-silver">
                                SmartBiz Lux
                            </h1>
                            <p className="text-muted-foreground mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">Your business at a glance</p>
                        </div>
                        <nav className="flex gap-1.5 sm:gap-2 md:gap-4 overflow-x-auto w-full md:w-auto justify-center md:justify-start pb-1 md:pb-0 scrollbar-hide">
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 md:px-4 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap text-xs sm:text-sm"
                            >
                                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <Link
                                href="/products"
                                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 md:px-4 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap text-xs sm:text-sm"
                            >
                                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="font-medium">Products</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex gap-2 sm:gap-3 items-center w-full md:w-auto justify-center md:justify-end">
                        <CurrencySelector />
                        <ModeToggle />
                        <ProfileDropdown />
                    </div>
                </header>
                <main className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    {children}
                </main>
            </div>
        </div>
    )
}
