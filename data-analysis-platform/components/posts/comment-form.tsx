"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment: any) => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await apiClient.addComment(postId, { content: content.trim() })

      // Create optimistic comment
      const newComment = {
        id: result.commentId,
        user: "현재 사용자", // This would come from auth context
        content: content.trim(),
        createdAt: new Date().toISOString(),
      }

      onCommentAdded(newComment)
      setContent("")

      toast({
        title: "성공",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "댓글 작성에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !content.trim()}>
          {isLoading ? "작성 중..." : "댓글 작성"}
        </Button>
      </div>
    </form>
  )
}
