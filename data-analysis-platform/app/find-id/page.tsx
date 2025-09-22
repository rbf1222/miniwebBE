"use client"

import type React from "react"

import { useState } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Copy, Check } from "lucide-react"
import Link from "next/link"

export default function FindIdPage() {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.findId({ phone })
      setResult(response.username)
      toast({
        title: "성공",
        description: "아이디를 찾았습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "아이디 찾기에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      toast({
        title: "복사됨",
        description: "아이디가 클립보드에 복사되었습니다.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>아이디 찾기</CardTitle>
            <CardDescription>등록된 전화번호로 아이디를 찾으세요</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="등록된 전화번호를 입력하세요"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "검색 중..." : "아이디 찾기"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">찾은 아이디</p>
                      <p className="text-lg font-semibold">{result}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "복사됨" : "복사"}
                    </Button>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/login">로그인하기</Link>
                </Button>
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                로그인으로 돌아가기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
