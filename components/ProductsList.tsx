"use client"

import { useEffect, useState } from "react"
import { Package, Edit, Trash2, Plus } from "lucide-react"
import { GlassCard } from "@/components/GlassCard"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { formatCurrency } from "@/lib/currency"
import { useCurrency } from "@/components/currency-provider"
import { AddProductDialog } from "@/components/AddProductDialog"
import { motion } from "framer-motion"

interface Product {
    id: string
    name: string
    description: string | null
    sku: string | null
    cost_price: number
    selling_price: number
    quantity: number
    low_stock_threshold: number
    created_at: string
}

export function ProductsList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { currency } = useCurrency()

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id)

            if (error) throw error

            // Refresh the list
            fetchProducts()
            alert("Product deleted successfully!")
        } catch (error: any) {
            alert("Error deleting product: " + error.message)
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <GlassCard className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-6">
                    Start by adding your first product to the inventory
                </p>
                <AddProductDialog />
            </GlassCard>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Product Inventory</h2>
                    <p className="text-muted-foreground">{products.length} products in stock</p>
                </div>
                <div className="w-full sm:w-auto">
                    <AddProductDialog />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <GlassCard className="h-full hover:scale-[1.02] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    {product.sku && (
                                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                                    )}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${product.quantity <= product.low_stock_threshold
                                    ? 'bg-coral/10 text-coral border border-coral/20'
                                    : 'bg-emerald/10 text-emerald border border-emerald/20'
                                    }`}>
                                    {product.quantity} in stock
                                </div>
                            </div>

                            {product.description && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                            )}

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cost Price:</span>
                                    <span className="font-medium">{formatCurrency(product.cost_price, currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Selling Price:</span>
                                    <span className="font-medium text-emerald">{formatCurrency(product.selling_price, currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Profit Margin:</span>
                                    <span className="font-medium">
                                        {((product.selling_price - product.cost_price) / product.selling_price * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => alert("Edit feature coming soon!")}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-coral hover:bg-coral/10"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
