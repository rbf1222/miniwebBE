"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layouts/app-layout"
import { PostCard } from "@/components/posts/post-card"
import { PostTableView } from "@/components/posts/post-table-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Search, Grid, List, FileText } from "lucide-react"

interface Post {
  id: string
  title: string
  author: string
  createdAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for now
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "2024년 매출 데이터 분석",
        author: "admin",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "고객 만족도 조사 결과",
        author: "admin",
        createdAt: "2024-01-14T14:20:00Z",
      },
      {
        id: "3",
        title: "제품 판매 현황 리포트",
        author: "admin",
        createdAt: "2024-01-13T09:15:00Z",
      },
      {
        id: "4",
        title: "마케팅 캠페인 성과 분석",
        author: "admin",
        createdAt: "2024-01-12T16:45:00Z",
      },
    ]

    setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 500)
  }, [])

  // Filter and sort posts
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">게시물</h1>
              <p className="text-muted-foreground">업로드된 데이터와 분석 결과를 확인하세요</p>
            </div>

            {/* Controls */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="제목이나 작성자로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "title") => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">최신순</SelectItem>
                      <SelectItem value="oldest">오래된순</SelectItem>
                      <SelectItem value="title">제목순</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "card" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("card")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">{searchTerm ? "검색 결과가 없습니다" : "게시물이 없습니다"}</CardTitle>
                  <CardDescription>
                    {searchTerm ? "다른 검색어를 시도해보세요" : "관리자가 데이터를 업로드하면 여기에 표시됩니다"}
                  </CardDescription>
                </CardContent>
              </Card>
            ) : viewMode === "card" ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <PostTableView posts={filteredPosts} />
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
