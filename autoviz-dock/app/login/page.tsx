"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { setAuth } from "@/lib/auth"
import { AuthGuard } from "@/components/auth-guard"
import type { AuthResponse } from "@/lib/auth"

const demoMode = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("192.168.0.165:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        setAuth(data.token, data.role)

        toast({
          title: "로그인 성공",
          description: data.message,
        })

        // Redirect based on role
        if (data.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/app")
        }
      } else {
        const errorData = await response.json()
        toast({
          title: "로그인 실패",
          description: errorData.message || "로그인에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "user") => {
    setAuth("DEMO", role)

    toast({
      title: "데모 로그인 성공",
      description: `${role === "admin" ? "관리자" : "사용자"} 계정으로 로그인되었습니다.`,
    })

    // Redirect based on role
    if (role === "admin") {
      router.push("/admin")
    } else {
      router.push("/app")
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AutoViz Dock</CardTitle>
            <CardDescription>계정에 로그인하여 데이터 시각화 플랫폼을 이용하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">사용자명</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="사용자명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {demoMode && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <h3 className="text-sm font-semibold text-center mb-3 text-muted-foreground">데모 로그인</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleDemoLogin("admin")}
                  >
                    관리자로 로그인 (데모)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleDemoLogin("user")}
                  >
                    사용자로 로그인 (데모)
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">관리자 계정 아이디는 admin 입니다.</p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/signup" className="text-primary hover:underline">
                  회원가입
                </Link>
                <Link href="/find-id" className="text-primary hover:underline">
                  아이디 찾기
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
