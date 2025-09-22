"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiCall } from "@/lib/auth"
import { Plus, FileText, Calendar, User } from "lucide-react"

interface Post {
  id: number
  title: string
  author: string
  createdAt: string
}

export default function AdminDashboard() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await apiCall("/posts")
        if (response.ok) {
          const posts: Post[] = await response.json()
          setRecentPosts(posts.slice(0, 5)) // Get latest 5 posts
        } else {
          toast({
            title: "오류",
            description: "최근 게시물을 불러오는데 실패했습니다.",
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

    fetchRecentPosts()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation role="admin" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">관리자 대시보드</h1>
            <p className="text-muted-foreground">AutoViz Dock 플랫폼을 관리하고 모니터링하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">역할</CardTitle>
                <Badge variant="default">관리자</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Admin</div>
                <p className="text-xs text-muted-foreground">시스템 전체 관리 권한</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 게시물</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentPosts.length}</div>
                <p className="text-xs text-muted-foreground">최근 업로드된 게시물</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">빠른 작업</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href="/admin/posts/new">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />새 게시물 작성
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                최근 업로드 게시물
              </CardTitle>
              <CardDescription>최근에 업로드된 게시물 5개를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{post.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span className="mr-4">{post.author}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <Link href={`/app/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          보기
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 업로드된 게시물이 없습니다.</p>
                  <Link href="/admin/posts/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />첫 번째 게시물 작성하기
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
