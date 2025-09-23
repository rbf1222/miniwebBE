"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Edit, Trash2, User } from "lucide-react"

interface Comment {
  id: string
  user: string
  content: string
  createdAt: string
}

interface CommentItemProps {
  comment: Comment
  onCommentUpdated: (commentId: string, newContent: string) => void
  onCommentDeleted: (commentId: string) => void
}

export function CommentItem({ comment, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const { toast } = useToast()

  const canModify = user?.username === comment.user || user?.role === "admin"

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast({
        title: "오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await apiClient.updateComment(comment.id, { content: editContent.trim() })

      onCommentUpdated(comment.id, editContent.trim())
      setIsEditing(false)

      toast({
        title: "성공",
        description: "댓글이 수정되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "댓글 수정에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await apiClient.deleteComment(comment.id)

      onCommentDeleted(comment.id)
      setDeleteDialog(false)

      toast({
        title: "성공",
        description: "댓글이 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.",
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
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{comment.user}</p>
                <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
            {canModify && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  취소
                </Button>
                <Button size="sm" onClick={handleEdit} disabled={isLoading}>
                  {isLoading ? "수정 중..." : "수정"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 삭제</DialogTitle>
            <DialogDescription>정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
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
