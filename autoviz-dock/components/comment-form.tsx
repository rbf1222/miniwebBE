"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiCall } from "@/lib/auth"
import { Send } from "lucide-react"

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment: any) => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await apiCall(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: content.trim() }),
      })

      if (response.ok) {
        const data = await response.json()

        // Create optimistic comment object
        const newComment = {
          id: data.commentId,
          user: "현재 사용자", // This would normally come from auth context
          content: content.trim(),
          createdAt: new Date().toISOString(),
        }

        onCommentAdded(newComment)
        setContent("")

        toast({
          title: "댓글 작성 완료",
          description: data.message,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "댓글 작성 실패",
          description: errorData.message || "댓글 작성에 실패했습니다.",
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
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="comment">댓글 작성</Label>
        <Textarea
          id="comment"
          placeholder="이 게시물에 대한 의견을 남겨주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "작성 중..." : "댓글 작성"}
        </Button>
      </div>
    </form>
  )
}
