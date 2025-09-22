"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import type { RegisterResponse } from "@/lib/auth"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, phone, role }),
      })

      if (response.ok) {
        const data: RegisterResponse = await response.json()

        toast({
          title: "회원가입 성공",
          description: data.message,
        })

        router.push("/login")
      } else {
        const errorData = await response.json()
        toast({
          title: "회원가입 실패",
          description: errorData.message || "회원가입에 실패했습니다.",
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

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>새 계정을 만들어 AutoViz Dock을 시작하세요</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="전화번호를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select value={role} onValueChange={(value: "user" | "admin") => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="역할을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">사용자</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                이미 계정이 있으신가요? 로그인
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
