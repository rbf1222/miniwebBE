"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiCall, getAuthRole } from "@/lib/auth"
import { FileText, MessageSquare, Eye, TrendingUp } from "lucide-react"

interface Post {
  id: number
  title: string
  author: string
  createdAt: string
}

export default function UserHomePage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const userRole = getAuthRole()

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await apiCall("/posts")
        if (response.ok) {
          const posts: Post[] = await response.json()
          setRecentPosts(posts.slice(0, 3)) // Get latest 3 posts for home page
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
    })
  }

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Navigation role="user" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  AutoViz Dock에 오신 것을 환영합니다
                  {userRole === "admin" && <Badge className="ml-3">관리자</Badge>}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">데이터 시각화와 협업을 통해 인사이트를 발견하세요</p>
                <div className="flex space-x-4">
                  <Link href="/app/posts">
                    <Button size="lg">
                      <FileText className="h-5 w-5 mr-2" />
                      게시물 목록 보기
                    </Button>
                  </Link>
                  <Link href="/app/watchlist">
                    <Button variant="outline" size="lg" disabled>
                      <Eye className="h-5 w-5 mr-2" />내 최근 댓글
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <TrendingUp className="h-24 w-24 text-primary/30" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 게시물</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentPosts.length}</div>
                <p className="text-xs text-muted-foreground">이용 가능한 데이터셋</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">내 활동</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">작성한 댓글 수</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">관심목록</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">저장된 게시물</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                최근 게시물
              </CardTitle>
              <CardDescription>최근에 업로드된 데이터 시각화 게시물을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
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
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground hover:text-primary">
                          <Link href={`/app/posts/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.author} • {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <Link href={`/app/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          보기
                        </Button>
                      </Link>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/app/posts">
                      <Button variant="outline">모든 게시물 보기</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 게시물이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
