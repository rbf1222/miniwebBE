"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { forwardRef } from "react"

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "glass" | "default"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 font-semibold"

    const variants = {
      gradient: "gradient-btn text-white shadow-lg hover:shadow-xl hover:scale-105",
      glass: "glass text-foreground hover:bg-white/20 dark:hover:bg-white/10",
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)

PremiumButton.displayName = "PremiumButton"

export { PremiumButton }
