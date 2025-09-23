"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { PremiumNavbar } from "./premium-navbar"
import { FloatingActionButton } from "./floating-action-button"

interface PremiumLayoutProps {
  children: React.ReactNode
}

export function PremiumLayout({ children }: PremiumLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen gradient-mesh">
      <PremiumNavbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <FloatingActionButton />
    </div>
  )
}
