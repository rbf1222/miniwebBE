"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { CommentsSection } from "@/components/comments-section"
import { useToast } from "@/hooks/use-toast"
import { apiCall, getAuthRole } from "@/lib/auth"
import { Download, FileSpreadsheet, User, Calendar, Edit, BarChart3 } from "lucide-react"

interface Comment {
  id: number
  user: string
  content: string
  createdAt: string
}

interface Post {
  id: number
  title: string
  author: string
  fileUrl: string
  createdAt: string
  comments: Comment[]
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const { toast } = useToast()
  const postId = params.id as string
  const userRole = getAuthRole()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiCall(`/posts/${postId}`)
        if (response.ok) {
          const postData: Post = await response.json()
          setPost(postData)
        } else {
          toast({
            title: "오류",
            description: "게시물을 불러오는데 실패했습니다.",
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

    if (postId) {
      fetchPost()
    }
  }, [postId, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownload = () => {
    if (post?.fileUrl) {
      window.open(post.fileUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requireAuth>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!post) {
    return (
      <AuthGuard requireAuth>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">게시물을 찾을 수 없습니다.</p>
              <Link href="/app/posts">
                <Button className="mt-4">게시물 목록으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{post.title}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {userRole === "admin" && (
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                  </Link>
                )}
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드(원본 Excel)
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* File Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 mr-2" />
                    파일 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{post.title}.xlsx</p>
                        <p className="text-sm text-muted-foreground">Excel 스프레드시트</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Visualization Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    데이터 시각화
                  </CardTitle>
                  <CardDescription>데이터 분석 및 시각화 결과 (향후 구현 예정)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-12 text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">데이터 시각화 기능</p>
                    <p className="text-sm text-muted-foreground">
                      Excel 데이터를 기반으로 한 차트와 그래프가 여기에 표시됩니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">게시물 통계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">댓글 수</span>
                    <Badge variant="secondary">{post.comments.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">작성자</span>
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">업로드일</span>
                    <span className="font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">빠른 작업</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    원본 파일 다운로드
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    시각화 내보내기
                  </Button>
                  {userRole === "admin" && (
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        게시물 수정
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <Separator className="mb-6" />
            <CommentsSection postId={postId} initialComments={post.comments} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
