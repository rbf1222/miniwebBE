"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiCall } from "@/lib/auth"
import { Search, FileText, User, Calendar, ExternalLink } from "lucide-react"

interface Post {
  id: number
  title: string
  author: string
  createdAt: string
}

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiCall("/posts")
        if (response.ok) {
          const postsData: Post[] = await response.json()
          setPosts(postsData)
          setFilteredPosts(postsData)
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

    fetchPosts()
  }, [toast])

  useEffect(() => {
    const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

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
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">게시물 목록</h1>
            <p className="text-muted-foreground">업로드된 데이터 시각화 게시물을 탐색하고 분석하세요</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                모든 게시물
              </CardTitle>
              <CardDescription>제목으로 검색하여 원하는 게시물을 찾아보세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="게시물 제목으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">제목</TableHead>
                        <TableHead className="w-[20%]">작성자</TableHead>
                        <TableHead className="w-[25%]">작성일</TableHead>
                        <TableHead className="w-[15%] text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link
                              href={`/app/posts/${post.id}`}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {post.author}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {formatDate(post.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/app/posts/${post.id}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                열기
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  {searchQuery ? (
                    <>
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        모든 게시물 보기
                      </Button>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">아직 게시물이 없습니다.</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
