"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserX, Home, LogIn } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <UserX className="h-16 w-16 text-destructive mx-auto mb-4" />
          <CardTitle className="text-2xl text-destructive">접근 권한이 없습니다</CardTitle>
          <CardDescription>
            이 페이지에 접근할 권한이 없습니다. 로그인하거나 적절한 권한을 확인해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login">
            <Button className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              로그인
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
