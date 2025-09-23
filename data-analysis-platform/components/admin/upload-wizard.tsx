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
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<FilePreview | null>(null)
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    xAxis: "",
    yAxis: "",
    aggregation: "sum",
    chartType: "bar",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (!selectedFile) return

      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ]

      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "오류",
          description: "지원되는 파일 형식: .xlsx, .xls, .csv",
          variant: "destructive",
        })
        return
      }

      // Validate file size (20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast({
          title: "오류",
          description: "파일 크기는 20MB 이하여야 합니다.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      try {
        const arrayBuffer = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length === 0) {
          toast({
            title: "오류",
            description: "파일에 데이터가 없습니다.",
            variant: "destructive",
          })
          return
        }

        const headers = jsonData[0] as string[]
        const data = jsonData.slice(1, 21) as any[][] // First 20 rows

        setPreview({
          headers,
          data,
          fileName: selectedFile.name,
        })

        // Reset chart config
        setChartConfig({
          xAxis: headers[0],
          yAxis: headers[1],
          aggregation: "sum",
          chartType: "bar",
        })
      } catch (error) {
        toast({
          title: "오류",
          description: "파일을 읽는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "오류",
        description: "제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!file) {
      toast({
        title: "오류",
        description: "파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await apiClient.uploadPost(title, file)
      toast({
        title: "성공",
        description: result.message,
      })

      // Reset form
      setTitle("")
      setFile(null)
      setPreview(null)
      setChartConfig({
        xAxis: "",
        yAxis: "",
        aggregation: "sum",
        chartType: "bar",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "업로드에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const chartIcons = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    area: AreaChart,
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            데이터 업로드
          </CardTitle>
          <CardDescription>엑셀 파일을 업로드하고 차트를 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">게시물 제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">파일 선택</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                id="file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    handleFileSelect(selectedFile)
                  }
                }}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">파일을 선택하거나 드래그하세요</p>
                    <p className="text-xs text-muted-foreground">지원 형식: .xlsx, .xls, .csv (최대 20MB)</p>
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

      {/* File Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>데이터 미리보기</CardTitle>
            <CardDescription>
              {preview.headers.length}개 컬럼, {preview.data.length}개 행 (최대 20행 표시)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {preview.headers.map((header, index) => (
                      <th key={index} className="text-left p-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.data.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-2">
                          {cell?.toString() || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart Configuration */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>차트 설정</CardTitle>
            <CardDescription>데이터 시각화를 위한 차트를 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X축 (카테고리)</Label>
                <Select
                  value={chartConfig.xAxis}
                  onValueChange={(value) => setChartConfig({ ...chartConfig, xAxis: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="X축 컬럼 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {preview.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Y축 (값)</Label>
                <Select
                  value={chartConfig.yAxis}
                  onValueChange={(value) => setChartConfig({ ...chartConfig, yAxis: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Y축 컬럼 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {preview.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>집계 방식</Label>
                <Select
                  value={chartConfig.aggregation}
                  onValueChange={(value: "sum" | "avg" | "min" | "max" | "count") =>
                    setChartConfig({ ...chartConfig, aggregation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">합계</SelectItem>
                    <SelectItem value="avg">평균</SelectItem>
                    <SelectItem value="min">최소값</SelectItem>
                    <SelectItem value="max">최대값</SelectItem>
                    <SelectItem value="count">개수</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>그룹화 (선택사항)</Label>
                <Select
                  value={chartConfig.groupBy || "none"}
                  onValueChange={(value) =>
                    setChartConfig({ ...chartConfig, groupBy: value === "none" ? undefined : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="그룹화 컬럼 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">없음</SelectItem>
                    {preview.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>차트 유형</Label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(chartIcons).map(([type, Icon]) => (
                  <Button
                    key={type}
                    variant={chartConfig.chartType === type ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-3"
                    onClick={() =>
                      setChartConfig({
                        ...chartConfig,
                        chartType: type as "line" | "bar" | "pie" | "area",
                      })
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs capitalize">{type}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading || !file || !title.trim()} className="min-w-32">
          {isLoading ? "업로드 중..." : "게시물 생성"}
        </Button>
      </div>
    </div>
  )
}
