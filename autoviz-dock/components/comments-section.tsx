"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentForm } from "@/components/comment-form"
import { CommentItem } from "@/components/comment-item"
import { MessageSquare } from "lucide-react"

interface Comment {
  id: number
  user: string
  content: string
  createdAt: string
}

interface CommentsSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev])
  }

  const handleCommentUpdated = (commentId: number, newContent: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, content: newContent } : comment)),
    )
  }

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId))
  }

  // Mock function to determine if user owns comment
  const isCommentOwner = (comment: Comment) => {
    // In a real app, this would check against the current user
    return comment.user === "현재 사용자" || Math.random() > 0.7 // Mock some comments as owned
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          댓글 ({comments.length})
        </CardTitle>
        <CardDescription>이 게시물에 대한 의견을 나누고 토론해보세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={isCommentOwner(comment)}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
