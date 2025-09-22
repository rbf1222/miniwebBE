"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layouts/app-layout"
import { CommentForm } from "@/components/posts/comment-form"
import { CommentItem } from "@/components/posts/comment-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, User, Calendar, MessageCircle, BarChart3 } from "lucide-react"

interface Post {
  id: string
  title: string
  author: string
  fileUrl: string
  createdAt: string
  comments: Comment[]
}

interface Comment {
  id: string
  user: string
  content: string
  createdAt: string
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockPost: Post = {
      id: postId,
      title: "2024년 매출 데이터 분석",
      author: "admin",
      fileUrl: "/api/files/sample.xlsx",
      createdAt: "2024-01-15T10:30:00Z",
      comments: [
        {
          id: "1",
          user: "user1",
          content: "매우 유용한 데이터네요. 특히 Q4 성장률이 인상적입니다.",
          createdAt: "2024-01-15T14:20:00Z",
        },
        {
          id: "2",
          user: "admin",
          content: "감사합니다. 다음 분기 예측 데이터도 곧 업로드할 예정입니다.",
          createdAt: "2024-01-15T15:30:00Z",
        },
      ],
    }

    setTimeout(() => {
      setPost(mockPost)
      setIsLoading(false)
    }, 500)
  }, [postId])

  const handleCommentAdded = (newComment: Comment) => {
    setPost((prev) => (prev ? { ...prev, comments: [...prev.comments, newComment] } : null))
  }

  const handleCommentUpdated = (commentId: string, newContent: string) => {
    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: prev.comments.map((comment) =>
              comment.id === commentId ? { ...comment, content: newContent } : comment,
            ),
          }
        : null,
    )
  }

  const handleCommentDeleted = (commentId: string) => {
    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: prev.comments.filter((comment) => comment.id !== commentId),
          }
        : null,
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-64 bg-muted rounded animate-pulse" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">게시물을 찾을 수 없습니다</CardTitle>
                <CardDescription>요청하신 게시물이 존재하지 않거나 삭제되었습니다.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Post Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="flex items-center gap-2">
                  <a href={post.fileUrl} download>
                    <Download className="h-4 w-4" />
                    파일 다운로드
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Data Visualization Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  데이터 시각화
                </CardTitle>
                <CardDescription>업로드된 데이터의 차트와 통계를 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">차트가 여기에 표시됩니다</p>
                    <p className="text-sm text-muted-foreground">백엔드에서 차트 설정을 제공하면 렌더링됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  댓글 ({post.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comment Form */}
                <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

                <Separator />

                {/* Comments List */}
                {post.comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">아직 댓글이 없습니다</p>
                    <p className="text-sm text-muted-foreground">첫 번째 댓글을 작성해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onCommentUpdated={handleCommentUpdated}
                        onCommentDeleted={handleCommentDeleted}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
