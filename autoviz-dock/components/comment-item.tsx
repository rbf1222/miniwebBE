"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { useToast } from "@/hooks/use-toast"
import { apiCall } from "@/lib/auth"
import { Edit, Trash2, Save, X, Languages, Copy } from "lucide-react"

interface Comment {
  id: number
  user: string
  content: string
  createdAt: string
}

interface CommentItemProps {
  comment: Comment
  isOwner: boolean
  onCommentUpdated: (commentId: number, newContent: string) => void
  onCommentDeleted: (commentId: number) => void
}

export function CommentItem({ comment, isOwner, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return

    setIsUpdating(true)

    try {
      const response = await apiCall(`/comments/${comment.id}`, {
        method: "PUT",
        body: JSON.stringify({ content: editContent.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        onCommentUpdated(comment.id, editContent.trim())
        setIsEditing(false)

        toast({
          title: "댓글 수정 완료",
          description: data.message,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "댓글 수정 실패",
          description: errorData.message || "댓글 수정에 실패했습니다.",
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
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await apiCall(`/comments/${comment.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const data = await response.json()
        onCommentDeleted(comment.id)

        toast({
          title: "댓글 삭제 완료",
          description: data.message,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "댓글 삭제 실패",
          description: errorData.message || "댓글 삭제에 실패했습니다.",
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

  const handleTranslate = async () => {
    setIsTranslating(true)

    try {
      const response = await apiCall("/translate", {
        method: "POST",
        body: JSON.stringify({
          text: comment.content,
          targetLang: "en",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTranslatedText(data.translatedText)
        setShowTranslation(true)
      } else {
        const errorData = await response.json()
        toast({
          title: "번역 실패",
          description: errorData.message || "번역에 실패했습니다.",
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
      setIsTranslating(false)
    }
  }

  const copyTranslation = () => {
    navigator.clipboard.writeText(translatedText)
    toast({
      title: "복사 완료",
      description: "번역된 텍스트가 클립보드에 복사되었습니다.",
    })
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">{comment.user}</span>
          {isOwner && (
            <Badge variant="secondary" className="text-xs">
              내 댓글
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {isOwner && !isEditing && (
            <>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isDeleting}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>댓글을 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 댓글이 영구적으로 삭제됩니다.
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
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              <X className="h-3 w-3 mr-1" />
              취소
            </Button>
            <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating || !editContent.trim()}>
              <Save className="h-3 w-3 mr-1" />
              {isUpdating ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{comment.content}</p>

          {showTranslation && translatedText && (
            <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">영어 번역</span>
                <Button variant="ghost" size="sm" onClick={copyTranslation}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-foreground text-sm leading-relaxed">{translatedText}</p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-transparent"
            >
              <Languages className="h-3 w-3 mr-1" />
              {isTranslating ? "번역 중..." : "영어로 번역"}
            </Button>
            {showTranslation && (
              <Button variant="ghost" size="sm" onClick={() => setShowTranslation(false)}>
                번역 숨기기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
