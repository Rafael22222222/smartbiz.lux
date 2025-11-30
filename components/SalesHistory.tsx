"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { GlassCard } from "@/components/GlassCard"
import { useCurrency } from "@/components/currency-provider"
import { formatCurrency } from "@/lib/currency"
import { format } from "date-fns"
import { Calendar, Filter, ArrowUpRight, ArrowDownRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Sale {
    id: string
    product_id: string
    quantity: number
    unit_price: number
    total_price: number
    profit: number
    sale_date: string
    products: {
        name: string
    }
}

export function SalesHistory() {
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all") // all, today, yesterday, week, month
    const [searchTerm, setSearchTerm] = useState("")
    const { currency } = useCurrency()

    useEffect(() => {
        fetchSales()
    }, [filter])

    async function fetchSales() {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            let query = supabase
                .from("sales")
                .select(`
                    *,
                    products (
                        name
                    )
                `)
                .eq("user_id", user.id)
                .order("sale_date", { ascending: false })

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

            if (filter === "today") {
                query = query.gte("sale_date", today)
            } else if (filter === "yesterday") {
                const yesterday = new Date(now)
                yesterday.setDate(yesterday.getDate() - 1)
                yesterday.setHours(0, 0, 0, 0)
                const yesterdayEnd = new Date(now)
                yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)
                yesterdayEnd.setHours(23, 59, 59, 999)

                query = query.gte("sale_date", yesterday.toISOString())
                    .lte("sale_date", yesterdayEnd.toISOString())
            } else if (filter === "week") {
                const lastWeek = new Date(now)
                lastWeek.setDate(lastWeek.getDate() - 7)
                query = query.gte("sale_date", lastWeek.toISOString())
            } else if (filter === "month") {
                const lastMonth = new Date(now)
                lastMonth.setMonth(lastMonth.getMonth() - 1)
                query = query.gte("sale_date", lastMonth.toISOString())
            }

            const { data, error } = await query

            if (error) throw error
            setSales(data || [])
        } catch (error) {
            console.error("Error fetching sales:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredSales = sales.filter(sale =>
        sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total_price, 0)
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Sales History</h2>
                    <p className="text-muted-foreground">View and track your past transactions</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 w-full sm:w-[200px]"
                        />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-ocean">{formatCurrency(totalSales, currency)}</h3>
                    </div>
                    <div className="p-3 bg-ocean/10 rounded-full">
                        <ArrowUpRight className="w-6 h-6 text-ocean" />
                    </div>
                </GlassCard>
                <GlassCard className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Profit</p>
                        <h3 className="text-2xl font-bold text-emerald">{formatCurrency(totalProfit, currency)}</h3>
                    </div>
                    <div className="p-3 bg-emerald/10 rounded-full">
                        <TrendingUp className="w-6 h-6 text-emerald" />
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">Loading sales data...</td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">No sales found for this period.</td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                                            {format(new Date(sale.sale_date), "MMM d, yyyy h:mm a")}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium">{sale.products?.name || "Unknown Product"}</td>
                                        <td className="py-3 px-4 text-sm text-right">{sale.quantity}</td>
                                        <td className="py-3 px-4 text-sm text-right text-muted-foreground">
                                            {formatCurrency(sale.unit_price, currency)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-medium">
                                            {formatCurrency(sale.total_price, currency)}
                                        </td>
                                        <td className={`py-3 px-4 text-sm text-right font-medium ${sale.profit >= 0 ? "text-emerald" : "text-coral"
                                            }`}>
                                            {formatCurrency(sale.profit, currency)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}

function TrendingUp({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
