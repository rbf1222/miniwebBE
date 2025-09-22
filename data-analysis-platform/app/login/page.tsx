"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await apiClient.login(formData)
      login(result.token, result.role, formData.username)

      toast({
        title: "성공",
        description: result.message,
      })

      // Redirect based on role
      if (result.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/posts")
      }
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "로그인에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>로그인</CardTitle>
            <CardDescription>계정에 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">사용자명</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "처리 중..." : "로그인"}
              </Button>
            </form>

            <div className="mt-4 space-y-2 text-center text-sm">
              <Link href="/find-id" className="text-primary hover:underline block">
                아이디 찾기
              </Link>
              <div>
                계정이 없으신가요?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  회원가입
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
