"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Sun, Moon, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "홈" },
  { href: "/posts", label: "게시물", auth: true },
  { href: "/translate", label: "번역", auth: true },
  { href: "/admin", label: "관리자", admin: true },
]

export function PremiumNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="w-8 h-8 rounded-lg gradient-1 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white font-bold text-sm">DA</span>
          </motion.div>
          <span className="font-bold text-lg">DataAnalyzer</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            if (item.auth && !user) return null
            if (item.admin && user?.role !== "admin") return null

            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href} className="relative">
                <motion.div
                  className={cn(
                    "px-4 py-2 rounded-lg transition-colors",
                    isActive ? "text-white" : "text-foreground/70 hover:text-foreground",
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 gradient-1 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="glass hover:bg-white/20 dark:hover:bg-white/10"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 glass">
                    <AvatarFallback className="bg-gradient-1 text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-white/20" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>설정</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="glass">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gradient-btn text-white">
                  회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
