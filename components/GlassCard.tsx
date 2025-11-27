import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/10",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
