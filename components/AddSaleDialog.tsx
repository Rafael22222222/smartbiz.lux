"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useCurrency } from "./currency-provider"
import { formatCurrency } from "@/lib/currency"

interface Product {
    id: string
    name: string
    cost_price: number
    selling_price: number
    quantity: number
}

export function AddSaleDialog({ onSaleAdded }: { onSaleAdded?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProductId, setSelectedProductId] = useState("")
    const [quantity, setQuantity] = useState("")
    const [sellingPrice, setSellingPrice] = useState("")
    const { currency } = useCurrency()

    useEffect(() => {
        if (open) {
            fetchProducts()
        }
    }, [open])

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId)
            if (product) {
                setSellingPrice(product.selling_price.toString())
            }
        }
    }, [selectedProductId, products])

    async function fetchProducts() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from("products")
                .select("id, name, cost_price, selling_price, quantity")
                .eq("user_id", user.id)
                .gt("quantity", 0)
                .order("name")

            if (error) throw error
            setProducts(data || [])
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const product = products.find(p => p.id === selectedProductId)
            if (!product) throw new Error("Product not found")

            const saleQuantity = parseInt(quantity)
            const salePrice = parseFloat(sellingPrice)

            if (saleQuantity > product.quantity) {
                throw new Error(`Only ${product.quantity} units available in stock`)
            }

            const totalPrice = saleQuantity * salePrice
            const totalCost = saleQuantity * product.cost_price
            const profit = totalPrice - totalCost

            // Insert sale record
            const { error: saleError } = await supabase
                .from("sales")
                .insert({
                    user_id: user.id,
                    product_id: selectedProductId,
                    quantity: saleQuantity,
                    unit_price: salePrice,
                    total_price: totalPrice,
                    profit: profit,
                    sale_date: new Date().toISOString(),
                })

            if (saleError) throw saleError

            // Update product quantity
            const { error: updateError } = await supabase
                .from("products")
                .update({ quantity: product.quantity - saleQuantity })
                .eq("id", selectedProductId)

            if (updateError) throw updateError

            alert(`Sale recorded successfully! Profit: ${formatCurrency(profit, currency)}`)
            setOpen(false)
            resetForm()

            if (onSaleAdded) {
                onSaleAdded()
            }
        } catch (error: any) {
            alert("Error recording sale: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    function resetForm() {
        setSelectedProductId("")
        setQuantity("")
        setSellingPrice("")
    }

    const selectedProduct = products.find(p => p.id === selectedProductId)
    const calculatedProfit = selectedProduct && quantity && sellingPrice
        ? (parseFloat(sellingPrice) - selectedProduct.cost_price) * parseInt(quantity)
        : 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-600/20">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Record Sale
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record New Sale</DialogTitle>
                        <DialogDescription>
                            Select a product and enter sale details. Stock will be updated automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="product">Product *</Label>
                            <select
                                id="product"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-green-500 focus:outline-none"
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} ({product.quantity} in stock)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedProduct && (
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cost Price:</span>
                                    <span className="font-medium">{formatCurrency(selectedProduct.cost_price, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Available Stock:</span>
                                    <span className="font-medium">{selectedProduct.quantity} units</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity Sold *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={selectedProduct?.quantity || 999999}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Selling Price (per unit) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                placeholder="Enter selling price"
                                required
                            />
                        </div>

                        {calculatedProfit !== 0 && quantity && sellingPrice && (
                            <div className={`p-3 rounded-lg border ${calculatedProfit >= 0
                                ? 'bg-green-500/10 border-green-500/20'
                                : 'bg-red-500/10 border-red-500/20'
                                }`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        {calculatedProfit >= 0 ? 'Profit' : 'Loss'}:
                                    </span>
                                    <span className={`text-lg font-bold ${calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {formatCurrency(Math.abs(calculatedProfit), currency)}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Total: {formatCurrency(parseFloat(sellingPrice) * parseInt(quantity), currency)}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !selectedProductId || !quantity || !sellingPrice}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "Recording..." : "Record Sale"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
