"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
// ▼▼▼ [수정 1] AvatarImage를 import 목록에 추가합니다. ▼▼▼
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth"
import { LogOut, User, Settings } from "lucide-react"
import { FloatingActionButton } from "./floating-action-button" 

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex-shrink-0 border-b bg-background">
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

            <Button variant="secondary" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* ▼▼▼ [수정 2] AvatarImage 태그를 추가하여 이미지를 표시합니다. ▼▼▼ */}
                      <AvatarImage src={user?.avatarUrl} alt="프로필 사진" />
                      <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem disabled className="opacity-100">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-semibold">{user?.username}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile/edit">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>프로필 수정</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 md:hidden">
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">{children}</main>

      <FloatingActionButton />

    </div>
  )
}