"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Edit, Trash2, Search } from "lucide-react"

interface Post {
  id: string
  title: string
  author: string
  createdAt: string
}

export function PostTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [editDialog, setEditDialog] = useState<{ open: boolean; post: Post | null }>({
    open: false,
    post: null,
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: Post | null }>({
    open: false,
    post: null,
  })
  const [editTitle, setEditTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for now since we don't have the actual API
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "2024년 매출 데이터",
        author: "admin",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        title: "고객 만족도 조사",
        author: "admin",
        createdAt: "2024-01-14T14:20:00Z",
      },
      {
        id: "3",
        title: "제품 판매 현황",
        author: "admin",
        createdAt: "2024-01-13T09:15:00Z",
      },
    ]
    setPosts(mockPosts)
  }, [])

  // Filter and sort posts
  useEffect(() => {
    const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy])

  const handleEdit = async () => {
    if (!editDialog.post || !editTitle.trim()) return

    setIsLoading(true)
    try {
      await apiClient.updatePost(editDialog.post.id, { title: editTitle })

      setPosts((prev) => prev.map((post) => (post.id === editDialog.post!.id ? { ...post, title: editTitle } : post)))

      toast({
        title: "성공",
        description: "게시물이 수정되었습니다.",
      })

      setEditDialog({ open: false, post: null })
      setEditTitle("")
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "수정에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.post) return

    setIsLoading(true)
    try {
      await apiClient.deletePost(deleteDialog.post.id)

      setPosts((prev) => prev.filter((post) => post.id !== deleteDialog.post!.id))

      toast({
        title: "성공",
        description: "게시물이 삭제되었습니다.",
      })

      setDeleteDialog({ open: false, post: null })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "삭제에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>게시물 관리</CardTitle>
          <CardDescription>업로드된 게시물을 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Sort */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: "newest" | "oldest") => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "검색 결과가 없습니다." : "게시물이 없습니다."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-mono text-sm">{post.id}</TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditDialog({ open: true, post })
                              setEditTitle(post.title)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeleteDialog({ open: true, post })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, post: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
            <DialogDescription>게시물 제목을 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">제목</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="게시물 제목"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, post: null })}>
              취소
            </Button>
            <Button onClick={handleEdit} disabled={isLoading || !editTitle.trim()}>
              {isLoading ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, post: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{deleteDialog.post?.title}" 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, post: null })}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
