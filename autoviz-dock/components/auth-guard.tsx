"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { isAuthenticated, isAdmin, getAuthRole } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Lock, UserX } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false, redirectTo }: AuthGuardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [errorType, setErrorType] = useState<"unauthorized" | "forbidden" | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const admin = isAdmin()
      const role = getAuthRole()
      const redirectPath = searchParams.get("redirect")

      // If not authenticated but auth is required
      if (requireAuth && !authenticated) {
        setErrorType("unauthorized")
        setIsLoading(false)
        return
      }

      // If not admin but admin is required
      if (requireAdmin && !admin) {
        if (!authenticated) {
          setErrorType("unauthorized")
        } else {
          setErrorType("forbidden")
        }
        setIsLoading(false)
        return
      }

      // If authenticated but trying to access auth pages, redirect based on role
      if (authenticated && (window.location.pathname === "/login" || window.location.pathname === "/signup")) {
        if (redirectPath) {
          router.push(redirectPath)
        } else if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/app")
        }
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requireAuth, requireAdmin, redirectTo, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  if (errorType === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UserX className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">로그인이 필요합니다</CardTitle>
            <CardDescription>이 페이지에 접근하려면 로그인이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/login")} className="w-full">
              로그인 페이지로 이동
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (errorType === "forbidden") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">접근 권한이 없습니다</CardTitle>
            <CardDescription>이 페이지에 접근할 권한이 없습니다. 관리자 권한이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/app")} className="w-full">
              사용자 홈으로 이동
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              이전 페이지로
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">접근 오류</CardTitle>
            <CardDescription>페이지에 접근하는 중 오류가 발생했습니다.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} className="w-full">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
