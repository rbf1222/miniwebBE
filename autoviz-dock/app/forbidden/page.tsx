"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Home, ArrowLeft } from "lucide-react"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle className="text-2xl text-destructive">관리자 권한 필요</CardTitle>
          <CardDescription>이 페이지는 관리자만 접근할 수 있습니다. 관리자 권한이 필요한 기능입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/app">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              사용자 홈으로 이동
            </Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 페이지로
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
