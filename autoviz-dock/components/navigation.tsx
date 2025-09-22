"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAuthRole, clearAuth, isAuthenticated } from "@/lib/auth"
import { LogOut, Home, FileText, Plus, Users, Settings, User, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

interface NavigationProps {
  role?: "admin" | "user" | null
}

export function Navigation({ role }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setCurrentRole(role || getAuthRole())
    setIsAuth(isAuthenticated())
  }, [role])

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  // Don't render navigation if not authenticated
  if (!isAuth || !currentRole) return null

  const isActive = (path: string) => {
    if (path === "/admin" || path === "/app") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  // Guest navigation (shouldn't happen with auth guard, but for safety)
  if (!currentRole) {
    return (
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              AutoViz Dock
            </Link>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Admin navigation
  if (currentRole === "admin") {
    return (
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-primary">
                AutoViz Dock
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link href="/admin">
                  <Button variant={isActive("/admin") && pathname === "/admin" ? "default" : "ghost"} size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    대시보드
                  </Button>
                </Link>
                <Link href="/admin/posts/new">
                  <Button variant={isActive("/admin/posts/new") ? "default" : "ghost"} size="sm">
                    <Plus className="h-4 w-4 mr-2" />새 게시물
                  </Button>
                </Link>
                <Link href="/app/posts">
                  <Button variant={isActive("/app/posts") ? "default" : "ghost"} size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    게시물
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="hidden sm:inline-flex">
                관리자
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    계정
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/app" className="flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      사용자 홈
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Mobile menu for admin */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-1">
              <Link href="/admin">
                <Button variant={isActive("/admin") && pathname === "/admin" ? "default" : "ghost"} size="sm">
                  <Home className="h-4 w-4 mr-1" />
                  대시보드
                </Button>
              </Link>
              <Link href="/admin/posts/new">
                <Button variant={isActive("/admin/posts/new") ? "default" : "ghost"} size="sm">
                  <Plus className="h-4 w-4 mr-1" />새 게시물
                </Button>
              </Link>
              <Link href="/app/posts">
                <Button variant={isActive("/app/posts") ? "default" : "ghost"} size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  게시물
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // User navigation
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/app" className="text-xl font-bold text-primary">
              AutoViz Dock
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link href="/app">
                <Button variant={isActive("/app") && pathname === "/app" ? "default" : "ghost"} size="sm">
                  <Home className="h-4 w-4 mr-2" />홈
                </Button>
              </Link>
              <Link href="/app/posts">
                <Button variant={isActive("/app/posts") ? "default" : "ghost"} size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  게시물
                </Button>
              </Link>
              <Link href="/app/watchlist">
                <Button variant={isActive("/app/watchlist") ? "default" : "ghost"} size="sm" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  관심목록
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  계정
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  설정 (준비 중)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Mobile menu for users */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1">
            <Link href="/app">
              <Button variant={isActive("/app") && pathname === "/app" ? "default" : "ghost"} size="sm">
                <Home className="h-4 w-4 mr-1" />홈
              </Button>
            </Link>
            <Link href="/app/posts">
              <Button variant={isActive("/app/posts") ? "default" : "ghost"} size="sm">
                <FileText className="h-4 w-4 mr-1" />
                게시물
              </Button>
            </Link>
            <Link href="/app/watchlist">
              <Button variant={isActive("/app/watchlist") ? "default" : "ghost"} size="sm" disabled>
                <Users className="h-4 w-4 mr-1" />
                관심목록
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
