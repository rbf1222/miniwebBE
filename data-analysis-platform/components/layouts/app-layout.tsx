"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth"
import { LogOut, User } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleLogout = () => {
    try {
      logout()
    } finally {
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/posts" className="text-xl font-bold text-primary">
            DataViz Platform
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/posts">게시물</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/translate">번역</Link>
              </Button>
              {user?.role === "admin" && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">관리자</Link>
                </Button>
              )}
            </nav>

            {/* ✅ 상단바에 눈에 띄는 로그아웃 버튼 추가 */}
            <Button variant="secondary" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>

            {/* 아바타 드롭다운 (모바일/보조 용) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 md:hidden">
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
