"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiCallFormData } from "@/lib/auth"
import { Upload, FileSpreadsheet, X } from "lucide-react"

export default function NewPostPage() {
  const [title, setTitle] = useState("2025년 선박 데이터")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        toast({
          title: "파일 형식 오류",
          description: "Excel 파일(.xlsx)만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        toast({
          title: "파일 형식 오류",
          description: "Excel 파일(.xlsx)만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }
      setFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        title: "파일 선택 필요",
        description: "업로드할 Excel 파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("file", file)

      const response = await apiCallFormData("/admin/posts", formData)

      if (response.ok) {
        const data = await response.json()
        setUploadProgress(100)

        toast({
          title: "업로드 성공",
          description: data.message,
        })

        setTimeout(() => {
          router.push(`/app/posts/${data.postId}`)
        }, 1000)
      } else {
        const errorData = await response.json()
        toast({
          title: "업로드 실패",
          description: errorData.message || "게시물 업로드에 실패했습니다.",
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
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-background">
        <Navigation role="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">새 게시물 작성</h1>
            <p className="text-muted-foreground">Excel 파일을 업로드하여 새로운 데이터 시각화 게시물을 만드세요</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>게시물 정보 및 파일 업로드</CardTitle>
              <CardDescription>게시물 제목을 입력하고 Excel 파일을 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">게시물 제목</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="게시물 제목을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Excel 파일 업로드</Label>
                  {!file ? (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                      <p className="text-sm text-muted-foreground">Excel 파일(.xlsx)만 지원됩니다</p>
                      <input
                        id="file-input"
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={removeFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>업로드 진행률</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    취소
                  </Button>
                  <Button type="submit" disabled={isUploading || !file}>
                    {isUploading ? "업로드 중..." : "게시물 업로드"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
