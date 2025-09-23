"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth"
import { LogOut, User, Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleLogout = () => {
    try {
      logout() // 내부에서 localStorage/상태 정리
    } finally {
      router.replace("/") // 메인으로
      router.refresh()
    }
  }

  // ❌ AI 분석 제거
  const sidebarItems = [
    { href: "/admin", icon: Upload, label: "업로드", exact: true },
    { href: "/admin/posts", icon: FileText, label: "게시물 관리" },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-primary">
            관리자 대시보드
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b bg-card">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">관리자 패널</h1>
              <p className="text-sm text-muted-foreground">데이터 업로드 및 게시물 관리</p>
            </div>

            <div className="flex items-center gap-3">
              {/* 사용자 뷰 이동 */}
              <Button variant="ghost" asChild>
                <Link href="/posts">사용자 뷰</Link>
              </Button>

              {/* ✅ 상단바에 눈에 띄는 로그아웃 버튼 추가 */}
              <Button variant="secondary" onClick={handleLogout} className="hidden md:inline-flex">
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>

              {/* 아바타 메뉴 (모바일/보조 용) */}
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

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
