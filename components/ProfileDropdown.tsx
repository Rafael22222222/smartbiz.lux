"use client"

import { useState, useEffect } from "react"
import { User, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        getUser()
    }, [])

    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    async function handleSignOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            router.push("/auth")
        } catch (error: any) {
            alert("Error signing out: " + error.message)
        }
    }

    if (!user) return null

    const userEmail = user.email || "User"
    const userName = user.user_metadata?.name || userEmail.split("@")[0]
    const initials = userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold border border-gold/30 hover:bg-gold/30 transition-colors cursor-pointer">
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/10 w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                    className="cursor-pointer text-coral focus:text-coral focus:bg-coral/10"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
