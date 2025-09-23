"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Edit, Trash2, Search, RefreshCcw } from "lucide-react"

// Post 타입
interface Post {
  id: string | number
  title: string
  username: string
  created_at: string
}

export function PostTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [editDialog, setEditDialog] = useState<{ open: boolean; post: Post | null }>({ open: false, post: null })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; post: Post | null }>({ open: false, post: null })
  const [editTitle, setEditTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()

  // 날짜 포맷 함수
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "-"
    
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("ko-KR", { 
          year: "numeric", 
          month: "2-digit", 
          day: "2-digit", 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      }
    } catch (e) {}
    
    const cleanDateString = dateString.replace(/[- :T]/g, '')
    if (cleanDateString.length >= 12) {
      const year = cleanDateString.substring(0, 4)
      const month = cleanDateString.substring(4, 6)
      const day = cleanDateString.substring(6, 8)
      const hour = cleanDateString.substring(8, 10)
      const minute = cleanDateString.substring(10, 12)
      return `${year}/${month}/${day} ${hour}:${minute}`
    }
    return "-"
  }, [])

  /** 실제 목록 불러오기 */
  const fetchPosts = useCallback(async () => {
    setIsFetching(true)
    try {
      const rawList = await apiClient.getPosts()
      console.log("rawList", rawList)
      setPosts(rawList ?? [])
    } catch (e: any) {
      toast({ title: "오류", description: e.message || "게시물을 불러오지 못했습니다.", variant: "destructive" })
    } finally {
      setIsFetching(false)
    }
  }, [toast])

  /** 1️⃣ 초기 마운트 시 게시물 불러오기 */
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  /** 2️⃣ 업로드 성공 브로드캐스트 수신 → 자동 새로고침 */
  useEffect(() => {
    const onUpdated = () => fetchPosts()
    window.addEventListener("posts:updated", onUpdated as EventListener)
    return () => window.removeEventListener("posts:updated", onUpdated as EventListener)
  }, [fetchPosts])

  /** 필터/정렬 */
  useEffect(() => {
    const filtered = posts
      .filter((p) => p.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aDate = new Date(a.created_at)
        const bDate = new Date(b.created_at)
        const aT = isNaN(aDate.getTime()) ? 0 : aDate.getTime()
        const bT = isNaN(bDate.getTime()) ? 0 : bDate.getTime()
        return sortBy === "newest" ? bT - aT : aT - bT
      })
    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy])

  /** 제목 수정 */
  const handleEdit = async () => {
    if (!editDialog.post || !editTitle.trim()) return
    setIsLoading(true)
    try {
      await apiClient.updatePost(String(editDialog.post.id), { title: editTitle })
      setPosts((prev) => prev.map((p) => (String(p.id) === String(editDialog.post!.id) ? { ...p, title: editTitle } : p)))
      toast({ title: "성공", description: "게시물이 수정되었습니다." })
      setEditDialog({ open: false, post: null })
      setEditTitle("")
    } catch (e: any) {
      toast({ title: "오류", description: e.message || "수정에 실패했습니다.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  /** 삭제 */
  const handleDelete = async () => {
    if (!deleteDialog.post) return
    setIsLoading(true)
    try {
      await apiClient.deletePost(String(deleteDialog.post.id))
      setPosts((prev) => prev.filter((p) => String(p.id) !== String(deleteDialog.post!.id)))
      toast({ title: "성공", description: "게시물이 삭제되었습니다." })
      setDeleteDialog({ open: false, post: null })
    } catch (e: any) {
      toast({ title: "오류", description: e.message || "삭제에 실패했습니다.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>게시물 관리</CardTitle>
              <CardDescription>업로드된 게시물을 관리하세요</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPosts} disabled={isFetching}>
              <RefreshCcw className="h-4 w-4 mr-2" /> {isFetching ? "새로고침 중..." : "새로고침"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* 검색/정렬 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="제목으로 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={sortBy} onValueChange={(v: "newest" | "oldest") => setSortBy(v)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 테이블 */}
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
                      {isFetching ? "불러오는 중..." : searchTerm ? "검색 결과가 없습니다." : "게시물이 없습니다."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={String(post.id)}>
                      <TableCell className="font-mono text-sm">{post.id}</TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.username}</TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setEditDialog({ open: true, post }); setEditTitle(post.title) }}
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

      {/* 수정 다이얼로그 */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, post: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
            <DialogDescription>게시물 제목을 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-title">제목</Label>
            <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="게시물 제목" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, post: null })}>취소</Button>
            <Button onClick={handleEdit} disabled={isLoading || !editTitle.trim()}>
              {isLoading ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 다이얼로그 */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, post: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 삭제</DialogTitle>
            <DialogDescription>
              정말로 "{deleteDialog.post?.title}" 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, post: null })}>취소</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
