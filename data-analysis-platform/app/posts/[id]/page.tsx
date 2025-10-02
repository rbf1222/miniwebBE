"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layouts/app-layout"
import { CommentForm } from "@/components/posts/comment-form"
import { CommentItem } from "@/components/posts/comment-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, User, Calendar, MessageCircle, BarChart3, Sparkles } from "lucide-react"

const HOST = "http://여기에 IP주소 및 포트 입력"

interface ApiComment {
  id: number | string
  content: string
  username: string
  created_at: string
}
interface Post {
  id: number | string
  title: string
  username: string
  created_at: string
  excel_file: string
  visible_file: string
  comments: ApiComment[]
}

/** 상대/절대 어떤 경로든 절대 URL로 변환 */
const abs = (path?: string) => {
  if (!path) return ""
  try {
    new URL(path)
    return path
  } catch {
    const base = HOST.endsWith("/") ? HOST.slice(0, -1) : HOST
    const p = path.startsWith("/") ? path : `/${path}`
    return `${base}${p}`
  }
}

export default function PostDetailPage() {
  const { id } = useParams()
  const postId = String(id)
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const r = await fetch(`${HOST}/api/posts/${postId}`)
        if (!r.ok) throw new Error("게시물 로드 실패")
        const data: Post = await r.json()
        setPost(data)
      } catch (e) {
        console.error(e)
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [postId])

  const excelUrl = useMemo(() => abs(post?.excel_file), [post?.excel_file])
  const vizUrl = useMemo(() => abs(post?.visible_file), [post?.visible_file])

  /** 프론트만으로 가능한 ‘최선’ 다운로드: blob 시도 → 실패 시 새 탭 */
  const handleDownload = async () => {
    if (!excelUrl) return
    try {
      const res = await fetch(excelUrl, { mode: "cors" })
      if (!res.ok) throw new Error("fetch 실패")
      const blob = await res.blob()
      const name = excelUrl.split("/").pop() || "download.xlsx"
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      window.open(excelUrl, "_blank", "noopener,noreferrer")
    }
  }

  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
            <div className="h-28 rounded-2xl bg-muted animate-pulse" />
            <div className="h-64 rounded-2xl bg-muted animate-pulse" />
            <div className="h-56 rounded-2xl bg-muted animate-pulse" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  if (!post) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <Card>
              <CardContent className="py-16 text-center space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <CardTitle>게시물을 찾을 수 없습니다</CardTitle>
                <CardDescription>삭제되었거나 존재하지 않는 게시물입니다.</CardDescription>
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
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
          {/* Header */}
          <Card className="border shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  {post.title}
                  <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">게시물 #{post.id}</Badge>
                </CardTitle>
                <Badge className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> AutoViz
                </Badge>
              </div>
              <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.username}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {fmt(post.created_at)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={handleDownload}
                className="w-full md:w-auto group rounded-xl h-11 px-5 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white hover:from-zinc-800 hover:to-zinc-600"
              >
                <Download className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                파일 다운로드
              </Button>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card className="border shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" />
                데이터 시각화
              </CardTitle>
              <CardDescription>업로드된 데이터의 차트와 통계를 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Skeleton while loading image */}
              {!imgLoaded && (
                <div className="h-64 w-full rounded-xl bg-muted animate-pulse mb-3" />
              )}
              
              {vizUrl ? (
                <div className="rounded-xl border bg-white overflow-hidden">
                  <img
                    src= {vizUrl}
                    alt="데이터 시각화"
                    className={`w-full transition-opacity ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none"
                      const fb = document.getElementById("viz-fallback")
                      if (fb) fb.classList.remove("hidden")
                    }}
                  />
                </div>
              ) : null}

              {/* Fallback */}
              <div
                id="viz-fallback"
                className={`hidden rounded-xl border bg-muted/30 mt-3 p-6 text-center text-sm text-muted-foreground`}
              >
                시각화 이미지를 준비 중입니다. 조금 뒤 새로고침해 주세요.
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                댓글 ({post.comments?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CommentForm
                postId={String(post.id)}
                onCommentAdded={async () => {
                  const r = await fetch(`${HOST}/api/posts/${post.id}`)
                  if (r.ok) setPost(await r.json())
                }}
              />
              <Separator />
              {(post.comments?.length ?? 0) === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                    <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                    <p className="font-medium">아직 댓글이 없습니다</p>
                    <p className="text-sm text-muted-foreground">첫 번째 댓글을 남겨보세요!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(post.comments ?? []).map((c) => (
                    <CommentItem
                      key={String(c.id)}
                      comment={{ id: c.id as any, user: c.username, content: c.content, createdAt: c.created_at }}
                      onCommentUpdated={async (cid, content) => {
                        await fetch(`${HOST}/api/posts/${post.id}/comments/${cid}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ content }),
                        })
                        const r = await fetch(`${HOST}/api/posts/${post.id}`)
                        if (r.ok) setPost(await r.json())
                      }}
                      onCommentDeleted={async (cid) => {
                        await fetch(`${HOST}/api/posts/${post.id}/comments/${cid}`, { method: "DELETE" })
                        const r = await fetch(`${HOST}/api/posts/${post.id}`)
                        if (r.ok) setPost(await r.json())
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
