"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearAuth } from "@/lib/auth"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    clearAuth()
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>로그아웃 중...</p>
      </div>
    </div>
  )
}
