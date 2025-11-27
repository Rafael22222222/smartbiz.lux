"use client"

import { useState } from "react"
import { Package, Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabaseClient"
import { useCurrency } from "@/components/currency-provider"

export function AddProductDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { currency } = useCurrency()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sku: "",
        cost_price: "",
        selling_price: "",
        quantity: "",
        low_stock_threshold: "5",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert("Please sign in to add products")
                setLoading(false)
                return
            }

            const { error } = await supabase.from("products").insert({
                user_id: user.id,
                name: formData.name,
                description: formData.description || null,
                sku: formData.sku || null,
                cost_price: parseFloat(formData.cost_price),
                selling_price: parseFloat(formData.selling_price),
                quantity: parseInt(formData.quantity),
                low_stock_threshold: parseInt(formData.low_stock_threshold),
            })

            if (error) throw error

            alert("Product added successfully!")
            setOpen(false)
            setFormData({
                name: "",
                description: "",
                sku: "",
                cost_price: "",
                selling_price: "",
                quantity: "",
                low_stock_threshold: "5",
            })
        } catch (error: any) {
            alert("Error adding product: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-emerald/10 to-emerald/5 hover:from-emerald/20 hover:to-emerald/10 text-emerald border border-emerald/20 transition-all group col-span-2 w-full">
                    <Package className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Add Product</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Add New Product
                        </DialogTitle>
                        <DialogDescription>
                            Add a new product to your inventory. All prices are in {currency}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Nike Air Force 1"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU (Optional)</Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="e.g., NK-AF1-001"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">Cost Price *</Label>
                                <Input
                                    id="cost_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.cost_price}
                                    onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="selling_price">Selling Price *</Label>
                                <Input
                                    id="selling_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.selling_price}
                                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Quantity *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="low_stock">Low Stock Alert</Label>
                                <Input
                                    id="low_stock"
                                    type="number"
                                    value={formData.low_stock_threshold}
                                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                    placeholder="5"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product details..."
                                rows={3}
                            />
                        </div>
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
                        <Button type="submit" disabled={loading} className="bg-emerald hover:bg-emerald/90">
                            {loading ? "Adding..." : "Add Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
