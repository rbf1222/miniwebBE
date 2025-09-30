"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
// UserCog 아이콘을 새로 import 합니다.
import { Plus, Upload, Languages, MessageSquare, UserCog } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore()

  if (!user) return null

  const actions = [
    // --- 기존 코드 시작 ---
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
    // --- 기존 코드 끝 ---

    // ▼▼▼ [추가된 코드] 개인정보 수정 버튼 객체 ▼▼▼
    {
      icon: UserCog, // 개인정보 수정을 나타내는 아이콘
      label: "개인정보 수정", // 버튼에 표시될 텍스트
      href: "/profile/edit", // 클릭 시 이동할 페이지 경로
      color: "bg-orange-500", // 버튼 색상
    },
    // ▲▲▲ [추가된 코드] 개인정보 수정 버튼 객체 ▲▲▲

    // --- 기존 코드 시작 ---
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
    // --- 기존 코드 끝 ---
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