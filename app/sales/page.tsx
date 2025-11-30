"use client"

import DashboardLayout from "@/components/DashboardLayout"
import AuthProvider from "@/components/AuthProvider"
import { SalesHistory } from "@/components/SalesHistory"

export default function SalesPage() {
    return (
        <AuthProvider>
            <DashboardLayout>
                <SalesHistory />
            </DashboardLayout>
        </AuthProvider>
    )
}
