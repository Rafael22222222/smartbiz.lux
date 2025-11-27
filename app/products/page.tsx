"use client"

import AuthProvider from "@/components/AuthProvider"
import DashboardLayout from "@/components/DashboardLayout"
import { ProductsList } from "@/components/ProductsList"

export default function ProductsPage() {
    return (
        <AuthProvider>
            <DashboardLayout>
                <ProductsList />
            </DashboardLayout>
        </AuthProvider>
    )
}
