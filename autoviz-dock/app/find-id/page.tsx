"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/auth-guard"
import { Copy } from "lucide-react"
import type { FindIdResponse } from "@/lib/auth"

export default function FindIdPage() {
  const [phone, setPhone] = useState("")
  const [foundUsername, setFoundUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      })

      if (response.ok) {
        const data: FindIdResponse = await response.json()
        setFoundUsername(data.username)

        toast({
          title: "아이디 찾기 성공",
          description: "아이디를 찾았습니다.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "아이디 찾기 실패",
          description: errorData.message || "해당 전화번호로 등록된 계정을 찾을 수 없습니다.",
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(foundUsername)
    toast({
      title: "복사 완료",
      description: "아이디가 클립보드에 복사되었습니다.",
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">아이디 찾기</CardTitle>
            <CardDescription>등록된 전화번호로 아이디를 찾을 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            {!foundUsername ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="등록된 전화번호를 입력하세요"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "검색 중..." : "아이디 찾기"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm font-medium">찾은 아이디</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold">{foundUsername}</span>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="ml-2 bg-transparent">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setFoundUsername("")
                    setPhone("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  다시 찾기
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
