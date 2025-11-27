"use client"

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface DashboardStats {
    totalSales: number
    netProfit: number
    expenses: number
    salesChange: number
    profitChange: number
    expensesChange: number
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        totalSales: 0,
        netProfit: 0,
        expenses: 0,
        salesChange: 0,
        profitChange: 0,
        expensesChange: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            // Fetch today's sales
            const { data: todaySales } = await supabase
                .from("sales")
                .select("total_price, profit")
                .eq("user_id", user.id)
                .gte("sale_date", today.toISOString())

            // Fetch yesterday's sales for comparison
            const { data: yesterdaySales } = await supabase
                .from("sales")
                .select("total_price, profit")
                .eq("user_id", user.id)
                .gte("sale_date", yesterday.toISOString())
                .lt("sale_date", today.toISOString())

            // Fetch today's expenses
            const { data: todayExpenses } = await supabase
                .from("expenses")
                .select("amount")
                .eq("user_id", user.id)
                .gte("expense_date", today.toISOString())

            // Fetch yesterday's expenses
            const { data: yesterdayExpenses } = await supabase
                .from("expenses")
                .select("amount")
                .eq("user_id", user.id)
                .gte("expense_date", yesterday.toISOString())
                .lt("expense_date", today.toISOString())

            const totalSales = todaySales?.reduce((sum, sale) => sum + Number(sale.total_price), 0) || 0
            const netProfit = todaySales?.reduce((sum, sale) => sum + Number(sale.profit), 0) || 0
            const expenses = todayExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

            const yesterdayTotalSales = yesterdaySales?.reduce((sum, sale) => sum + Number(sale.total_price), 0) || 0
            const yesterdayNetProfit = yesterdaySales?.reduce((sum, sale) => sum + Number(sale.profit), 0) || 0
            const yesterdayExpensesTotal = yesterdayExpenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

            const salesChange = yesterdayTotalSales === 0 ? 0 : ((totalSales - yesterdayTotalSales) / yesterdayTotalSales) * 100
            const profitChange = yesterdayNetProfit === 0 ? 0 : ((netProfit - yesterdayNetProfit) / yesterdayNetProfit) * 100
            const expensesChange = yesterdayExpensesTotal === 0 ? 0 : ((expenses - yesterdayExpensesTotal) / yesterdayExpensesTotal) * 100

            setStats({
                totalSales,
                netProfit,
                expenses,
                salesChange: Math.round(salesChange),
                profitChange: Math.round(profitChange),
                expensesChange: Math.round(expensesChange),
            })
        } catch (error) {
            console.error("Error fetching stats:", error)
        } finally {
            setLoading(false)
        }
    }

    return { stats, loading, refresh: fetchStats }
}

interface Product {
    id: string
    name: string
    sku: string
    quantity: number
    low_stock_threshold: number
}

export function useLowStockProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLowStockProducts()
    }, [])

    async function fetchLowStockProducts() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from("products")
                .select("id, name, sku, quantity, low_stock_threshold")
                .eq("user_id", user.id)
                .lte("quantity", supabase.rpc("low_stock_threshold"))
                .order("quantity", { ascending: true })
                .limit(5)

            if (error) {
                // If the RPC doesn't work, use a simple filter
                const { data: allProducts } = await supabase
                    .from("products")
                    .select("id, name, sku, quantity, low_stock_threshold")
                    .eq("user_id", user.id)
                    .order("quantity", { ascending: true })
                    .limit(10)

                const lowStock = allProducts?.filter(p => p.quantity <= p.low_stock_threshold)
                setProducts(lowStock || [])
            } else {
                setProducts(data || [])
            }
        } catch (error) {
            console.error("Error fetching low stock products:", error)
        } finally {
            setLoading(false)
        }
    }

    return { products, loading, refresh: fetchLowStockProducts }
}
