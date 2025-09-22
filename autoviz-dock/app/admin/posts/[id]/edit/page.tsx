"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiCall } from "@/lib/auth"
import { Trash2 } from "lucide-react"

interface Post {
  id: number
  title: string
  author: string
  createdAt: string
}

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const postId = params.id as string

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiCall(`/posts/${postId}`)
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
          setTitle(postData.title)
        } else {
          toast({
            title: "오류",
            description: "게시물을 불러오는데 실패했습니다.",
            variant: "destructive",
          })
          router.push("/admin")
        }
      } catch (error) {
        toast({
          title: "오류",
          description: "네트워크 오류가 발생했습니다.",
          variant: "destructive",
        })
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router, toast])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await apiCall(`/admin/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "수정 완료",
          description: data.message,
        })
        router.push(`/app/posts/${postId}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "수정 실패",
          description: errorData.message || "게시물 수정에 실패했습니다.",
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
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await apiCall(`/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "삭제 완료",
          description: data.message,
        })
        router.push("/admin")
      } else {
        const errorData = await response.json()
        toast({
          title: "삭제 실패",
          description: errorData.message || "게시물 삭제에 실패했습니다.",
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
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requireAuth requireAdmin>
        <div className="min-h-screen bg-background">
          <Navigation role="admin" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-1/6"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation role="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">게시물 수정</h1>
            <p className="text-muted-foreground">게시물 정보를 수정하거나 삭제할 수 있습니다</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>게시물 정보 수정</CardTitle>
              <CardDescription>게시물 제목을 수정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">게시물 제목</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="게시물 제목을 입력하세요"
                  />
                </div>

                <div className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? "삭제 중..." : "게시물 삭제"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 게시물과 관련된 모든 데이터가 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      취소
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "저장 중..." : "변경사항 저장"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
