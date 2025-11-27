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
        <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver dark:from-graphite dark:via-slate dark:to-graphite p-4 md:p-6 lg:p-8 font-sans text-foreground transition-colors duration-500">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-graphite to-slate dark:from-white dark:to-silver">
                                SmartBiz Lux
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">Your business at a glance</p>
                        </div>
                        <nav className="flex gap-2 md:gap-4 overflow-x-auto w-full md:w-auto justify-center md:justify-start pb-2 md:pb-0">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                            >
                                <Home className="w-4 h-4" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link
                                href="/products"
                                className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                            >
                                <Package className="w-4 h-4" />
                                <span className="text-sm font-medium">Products</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex gap-3 items-center w-full md:w-auto justify-center md:justify-end">
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
