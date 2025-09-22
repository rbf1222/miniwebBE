"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Upload, Languages, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore()

  if (!user) return null

  const actions = [
    ...(user.role === "admin"
      ? [
          {
            icon: Upload,
            label: "새 게시물",
            href: "/admin",
            color: "bg-blue-500",
          },
        ]
      : []),
    {
      icon: Languages,
      label: "번역",
      href: "/translate",
      color: "bg-purple-500",
    },
    {
      icon: MessageSquare,
      label: "내 댓글",
      href: "/posts",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <motion.button
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-full text-white shadow-lg",
                      "glass hover:scale-105 transition-all duration-200",
                      action.color,
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 gradient-btn rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  )
}
