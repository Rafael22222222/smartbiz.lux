"use client"

import { useState } from "react"
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
import { CreditCard } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useCurrency } from "./currency-provider"
import { formatCurrency } from "@/lib/currency"

export function AddExpenseDialog({ onExpenseAdded }: { onExpenseAdded?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const { currency } = useCurrency()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const expenseAmount = parseFloat(amount)

            // Insert expense record
            const { error } = await supabase
                .from("expenses")
                .insert({
                    user_id: user.id,
                    description: description,
                    amount: expenseAmount,
                    category: category || "other",
                    expense_date: new Date().toISOString(),
                })

            if (error) throw error

            alert(`Expense recorded successfully! Amount: ${formatCurrency(expenseAmount, currency)}`)
            setOpen(false)
            resetForm()

            if (onExpenseAdded) {
                onExpenseAdded()
            }
        } catch (error: any) {
            alert("Error recording expense: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    function resetForm() {
        setDescription("")
        setAmount("")
        setCategory("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-coral to-coral/80 hover:from-coral/90 hover:to-coral/70 text-white border-0">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record New Expense</DialogTitle>
                        <DialogDescription>
                            Track your business expenses to monitor profitability.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., Office supplies, Rent, Utilities..."
                                required
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category (Optional)</Label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-coral focus:outline-none"
                            >
                                <option value="">Select category</option>
                                <option value="rent">Rent</option>
                                <option value="utilities">Utilities</option>
                                <option value="stock">Stock/Inventory</option>
                                <option value="transport">Transportation</option>
                                <option value="salaries">Salaries</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {amount && (
                            <div className="p-3 rounded-lg bg-coral/10 border border-coral/20">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Expense:</span>
                                    <span className="text-lg font-bold text-coral">
                                        {formatCurrency(parseFloat(amount), currency)}
                                    </span>
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
                            disabled={loading || !description || !amount}
                            className="bg-coral hover:bg-coral/90"
                        >
                            {loading ? "Recording..." : "Record Expense"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
