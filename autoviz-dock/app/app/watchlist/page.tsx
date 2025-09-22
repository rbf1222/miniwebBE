"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { Eye, Construction } from "lucide-react"

export default function WatchlistPage() {
  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">관심목록</h1>
            <p className="text-muted-foreground">저장한 게시물과 최근 활동을 확인하세요</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                관심목록 기능
              </CardTitle>
              <CardDescription>사용자 맞춤 기능 (개발 예정)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">기능 개발 중</p>
                <p className="text-muted-foreground">
                  관심목록 및 최근 댓글 기능은 향후 업데이트에서 제공될 예정입니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
