"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Upload, FileSpreadsheet, BarChart3, LineChart, PieChart, AreaChart } from "lucide-react"
import * as XLSX from "xlsx"

// ★ Flask 서버 베이스 URL (환경에 맞게 변경)
const FLASK_BASE = "http://여기에 IP주소 및 포트 입력"


interface UploadWizardProps {
  onSuccess?: () => void
}

interface FilePreview {
  headers: string[]
  data: any[][]
  fileName: string
}

interface ChartConfig {
  xAxis: string
  yAxis: string
  aggregation: "sum" | "avg" | "min" | "max" | "count"
  groupBy?: string
  chartType: "line" | "bar" | "pie" | "area"
}

interface UploadWizardProps {
  onSuccess?: () => void
}

export function UploadWizard({ onSuccess }: UploadWizardProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Flask에서 받아온 컬럼들 + 사용자가 고른 컬럼들
  const [allColumns, setAllColumns] = useState<string[]>([])
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  const [loadingColumns, setLoadingColumns] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 파일 선택 → Flask로 전송 → 컬럼 배열 수신
  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (!selectedFile) return

      // 1) 형식/용량 검사
      const okTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ]
      if (!okTypes.includes(selectedFile.type)) {
        toast({ title: "오류", description: "지원: .xlsx, .xls, .csv", variant: "destructive" })
        return
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast({ title: "오류", description: "파일 크기는 20MB 이하여야 합니다.", variant: "destructive" })
        return
      }

      setFile(selectedFile)
      setAllColumns([])
      setSelectedColumns([])
      setLoadingColumns(true)

      try {
        const fd = new FormData()
        fd.append("file", selectedFile)

        const res = await fetch(`${FLASK_BASE}/columns-from-file`, { method: "POST", body: fd })
        const text = await res.text()
        let json: any = {}
        try { json = JSON.parse(text) } catch { json = { error: text } }

        if (!res.ok || !Array.isArray(json.columns)) {
          throw new Error(json?.error || `Flask 오류 (HTTP ${res.status})`)
        }

        setAllColumns(json.columns)
        toast({ title: "컬럼 로드 완료", description: `${json.columns.length}개 컬럼을 확인했습니다.` })
      } catch (e: any) {
        toast({ title: "컬럼 읽기 실패", description: e?.message || "Flask 서버 오류", variant: "destructive" })
        setFile(null)
      } finally {
        setLoadingColumns(false)
      }
    },
    [toast],
  )

  // 체크박스 토글
  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  // 최종 업로드 (Node로 전송)
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: "오류", description: "제목을 입력해주세요.", variant: "destructive" })
      return
    }
    if (!file) {
      toast({ title: "오류", description: "파일을 선택해주세요.", variant: "destructive" })
      return
    }
    if (selectedColumns.length === 0) {
      toast({ title: "오류", description: "최소 1개 이상의 컬럼을 선택해주세요.", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      // 기존엔 title+file만 보냈지만, 이제 columns도 함께 보냄
      const fd = new FormData()
      fd.append("title", title)
      fd.append("file", file)
      fd.append("columns", JSON.stringify(selectedColumns)) // ★ JSON 배열로 전송

      // apiClient를 쓰지 않고 직접 호출해도 OK:
      // const res = await fetch("http://<NODE>:5000/api/admin/posts", { method:"POST", body:fd })
      // const json = await res.json()
      // if(!res.ok) throw new Error(json?.message || "업로드 실패")

      const result = await apiClient.uploadPostWithColumns(fd) // ← apiClient에 이 메서드 추가 권장
      toast({ title: "성공", description: result?.message || "게시물이 등록되었습니다." })

      // 초기화
      setTitle("")
      setFile(null)
      setAllColumns([])
      setSelectedColumns([])
      onSuccess?.()
    } catch (e: any) {
      toast({ title: "업로드 실패", description: e?.message || "서버 오류", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 업로드 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            데이터 업로드
          </CardTitle>
          <CardDescription>엑셀 파일을 올리면 Flask가 컬럼 목록을 돌려줍니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">게시물 제목</Label>
            <Input
              id="title"
              placeholder="예) 2025년 1월 불량율 리포트"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">파일 선택</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                }}
              />
              <label htmlFor="file" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">파일을 선택하거나 드래그하세요</p>
                    <p className="text-xs text-muted-foreground">지원: .xlsx, .xls, .csv (≤ 20MB)</p>
                  </div>
                </div>
              </label>
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{file.name}</span>
                <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 차트 설정(= 컬럼 선택) */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              차트 설정
            </CardTitle>
            <CardDescription>
              원하는 컬럼을 체크하세요.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {loadingColumns ? (
              <div className="h-32 rounded-lg bg-muted animate-pulse" />
            ) : allColumns.length === 0 ? (
              <p className="text-sm text-muted-foreground">컬럼 목록을 불러오지 못했습니다.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {allColumns.map((col) => {
                  const checked = selectedColumns.includes(col)
                  return (
                    <label
                      key={col}
                      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${
                        checked ? "bg-primary/5 border-primary/50" : "hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleColumn(col)}
                        className="accent-primary"
                      />
                      <span className="text-sm truncate">{col}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 제출 */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitting || !file || !title.trim() || selectedColumns.length === 0}
          className="min-w-32"
        >
          {submitting ? "업로드 중..." : "게시물 생성"}
        </Button>
      </div>
    </div>
  )
}