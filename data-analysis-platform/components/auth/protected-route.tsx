"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, initialize, isInitializing } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isInitializing) return

    // TODO
    if (!isAuthenticated) {
      router.push("/login")      
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push("/posts")
      return
    }
  }, [isAuthenticated, user, requiredRole, router, isInitializing])

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
