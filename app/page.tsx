"use client"

import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { ArrowUpRight, ArrowDownRight, Package, DollarSign, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/currency-provider";
import { formatCurrency } from "@/lib/currency";
import { AddProductDialog } from "@/components/AddProductDialog";
import AuthProvider from "@/components/AuthProvider";
import { useDashboardStats, useLowStockProducts } from "@/hooks/useDashboardData";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { currency } = useCurrency();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { products: lowStockProducts, loading: productsLoading } = useLowStockProducts();

  return (
    <AuthProvider>
      <DashboardLayout>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6 sm:mb-8"
        >
          {/* Total Sales Card */}
          <motion.div variants={item}>
            <GlassCard className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-24 h-24 text-ocean" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-ocean/10">
                    <DollarSign className="w-4 h-4 text-ocean" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Sales Today</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-foreground">
                    {statsLoading ? "..." : formatCurrency(stats.totalSales, currency)}
                  </span>
                  <span className={`text-sm font-medium flex items-center px-2 py-1 rounded-full ${stats.salesChange >= 0 ? 'text-emerald bg-emerald/10' : 'text-coral bg-coral/10'
                    }`}>
                    {stats.salesChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stats.salesChange >= 0 ? '+' : ''}{stats.salesChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Compared to yesterday</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Profit Card */}
          <motion.div variants={item}>
            <GlassCard className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24 text-emerald" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <TrendingUp className="w-4 h-4 text-emerald" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Profit</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-foreground">
                    {statsLoading ? "..." : formatCurrency(stats.netProfit, currency)}
                  </span>
                  <span className={`text-sm font-medium flex items-center px-2 py-1 rounded-full ${stats.profitChange >= 0 ? 'text-emerald bg-emerald/10' : 'text-coral bg-coral/10'
                    }`}>
                    {stats.profitChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stats.profitChange >= 0 ? '+' : ''}{stats.profitChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Profit margin: {stats.totalSales > 0 ? ((stats.netProfit / stats.totalSales) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Expenses Card */}
          <motion.div variants={item}>
            <GlassCard className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-24 h-24 text-coral" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-coral/10">
                    <CreditCard className="w-4 h-4 text-coral" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expenses</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-foreground">
                    {statsLoading ? "..." : formatCurrency(stats.expenses, currency)}
                  </span>
                  <span className={`text-sm font-medium flex items-center px-2 py-1 rounded-full ${stats.expensesChange <= 0 ? 'text-emerald bg-emerald/10' : 'text-coral bg-coral/10'
                    }`}>
                    {stats.expensesChange <= 0 ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {stats.expensesChange >= 0 ? '+' : ''}{stats.expensesChange}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.expensesChange <= 0 ? 'Lower than yesterday' : 'Higher than yesterday'}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2"
        >
          {/* Quick Actions */}
          <GlassCard className="h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-ocean to-emerald rounded-full" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("New Sale feature coming soon! This will allow you to record sales transactions.")}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-ocean/10 to-ocean/5 hover:from-ocean/20 hover:to-ocean/10 text-ocean border border-ocean/20 transition-all group"
              >
                <DollarSign className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">New Sale</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Add Expense feature coming soon! This will allow you to track business expenses.")}
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 hover:from-coral/20 hover:to-coral/10 text-coral border border-coral/20 transition-all group"
              >
                <CreditCard className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Add Expense</span>
              </motion.button>
              <div className="col-span-1 sm:col-span-2">
                <AddProductDialog />
              </div>
            </div>
          </GlassCard>

          {/* Low Stock Alert */}
          <GlassCard className="h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-coral to-gold rounded-full" />
                Low Stock Alert
              </h3>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-coral/10 text-coral border border-coral/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {lowStockProducts.length} Items
              </span>
            </div>
            <div className="space-y-3">
              {productsLoading ? (
                <p className="text-center text-muted-foreground py-4">Loading...</p>
              ) : lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">All products are well stocked!</p>
                </div>
              ) : (
                lowStockProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-white/5 to-white/0 dark:from-white/5 dark:to-transparent border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku || 'No SKU'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-coral text-sm">{product.quantity} left</p>
                      <p className="text-xs text-muted-foreground">Restock soon</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </DashboardLayout>
    </AuthProvider >
  );
}
