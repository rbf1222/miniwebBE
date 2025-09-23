"use client"

import { useState, useCallback } from "react"
import * as XLSX from "xlsx"
import PageTitle from "../components/PageTitle.jsx"
import Section from "../components/Section.jsx"
import Card from "../components/Card.jsx"
import FormRow from "../components/FormRow.jsx"
import FileDropzone from "../components/FileDropzone.jsx"
import ChartPreview from "../components/ChartPreview.jsx"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Checkbox } from "../components/ui/checkbox"
import { uploadPost, analyzePost } from "../lib/api.js"
import { showToast } from "../components/ToastHost.jsx"

export default function AdminPostNew({ navigate }) {
  const [title, setTitle] = useState("2025년 선박 데이터")
  const [file, setFile] = useState(null)
  const [workbook, setWorkbook] = useState(null)
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState("")
  const [columns, setColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState([])
  const [postId, setPostId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    setSelectedSheet("")
    setColumns([])
    setSelectedColumns([])
    setAnalysisResult(null)

    // Parse Excel file immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: "array" })
        setWorkbook(wb)
        setSheetNames(wb.SheetNames)

        if (wb.SheetNames.length > 0) {
          setSelectedSheet(wb.SheetNames[0])
          extractColumns(wb, wb.SheetNames[0])
        }
      } catch (error) {
        showToast("Excel 파일 파싱 중 오류가 발생했습니다", "error")
      }
    }
    reader.readAsArrayBuffer(selectedFile)
  }, [])

  const extractColumns = (wb, sheetName) => {
    try {
      const worksheet = wb.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length > 0) {
        const headers = jsonData[0].filter((header) => header && header.toString().trim())
        setColumns(headers)
        setSelectedColumns([])
      }
    } catch (error) {
      showToast("컬럼 추출 중 오류가 발생했습니다", "error")
    }
  }

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName)
    setSelectedColumns([])
    if (workbook) {
      extractColumns(workbook, sheetName)
    }
  }

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => (prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]))
  }

  const handlePublish = async () => {
    if (!file || !title.trim()) {
      showToast("제목과 파일을 모두 입력해주세요", "error")
      return
    }

    setLoading(true)
    try {
      const response = await uploadPost({ title, file })
      setPostId(response.postId)
      showToast(response.message, "success")
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleServerAnalysis = async () => {
    if (!postId || !selectedSheet || selectedColumns.length === 0) {
      showToast("게시물 발행 후 시트와 컬럼을 선택해주세요", "error")
      return
    }

    setAnalyzing(true)
    try {
      const response = await analyzePost({
        postId,
        sheet: selectedSheet,
        columns: selectedColumns,
      })
      setAnalysisResult(response)
      showToast("서버 분석이 완료되었습니다", "success")
    } catch (error) {
      showToast("서버 분석 중 오류가 발생했습니다", "error")
    } finally {
      setAnalyzing(false)
    }
  }

  const resetSelection = () => {
    setSelectedSheet("")
    setColumns([])
    setSelectedColumns([])
  }

  const getChartData = () => {
    if (!workbook || !selectedSheet || selectedColumns.length === 0) return null

    try {
      const worksheet = workbook.Sheets[selectedSheet]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      return selectedColumns.map((column) => {
        const values = jsonData.map((row) => row[column] || "NULL")
        const counts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1
          return acc
        }, {})

        // Sort by count and aggregate small categories
        const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1])
        const total = values.length
        const threshold = total * 0.03 // 3%

        const processedData = []
        let othersCount = 0

        sortedEntries.forEach(([label, count]) => {
          if (count >= threshold) {
            processedData.push({ label, count, percentage: (count / total) * 100 })
          } else {
            othersCount += count
          }
        })

        if (othersCount > 0) {
          processedData.push({
            label: "Others",
            count: othersCount,
            percentage: (othersCount / total) * 100,
          })
        }

        return {
          column,
          data: processedData,
          total,
        }
      })
    } catch (error) {
      console.error("Chart data generation error:", error)
      return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8">
      <PageTitle>새 게시물 작성</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <Card>
          <Section title="파일 업로드">
            <div className="space-y-4">
              <FormRow>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="게시물 제목을 입력하세요"
                />
              </FormRow>

              <FormRow>
                <Label>Excel 파일</Label>
                <FileDropzone onFileSelect={handleFileSelect} accept=".xlsx,.xls" selectedFile={file} />
              </FormRow>

              <Button onClick={handlePublish} disabled={loading || !file || !title.trim()} className="w-full">
                {loading ? "발행 중..." : "게시물 발행"}
              </Button>

              {postId && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ 게시물이 성공적으로 발행되었습니다 (ID: {postId})
                  </p>
                </div>
              )}
            </div>
          </Section>
        </Card>

        {/* Sheet & Column Panel */}
        <Card>
          <Section title="시트 & 컬럼 선택">
            {sheetNames.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <Label>시트 선택</Label>
                  <RadioGroup value={selectedSheet} onValueChange={handleSheetChange}>
                    {sheetNames.map((sheetName) => (
                      <div key={sheetName} className="flex items-center space-x-2">
                        <RadioGroupItem value={sheetName} id={sheetName} />
                        <Label htmlFor={sheetName} className="text-sm">
                          {sheetName}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {columns.length > 0 && (
                  <div>
                    <Label>컬럼 선택 (복수 선택 가능)</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {columns.map((column) => (
                        <div key={column} className="flex items-center space-x-2">
                          <Checkbox
                            id={column}
                            checked={selectedColumns.includes(column)}
                            onCheckedChange={() => handleColumnToggle(column)}
                          />
                          <Label htmlFor={column} className="text-sm">
                            {column}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={resetSelection} className="w-full bg-transparent">
                  선택 초기화
                </Button>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Excel 파일을 업로드하면 시트 목록이 표시됩니다</p>
            )}
          </Section>
        </Card>

        {/* Chart Preview Panel */}
        <Card>
          <Section title="차트 미리보기">
            {selectedColumns.length > 0 ? (
              <div className="space-y-4">
                <ChartPreview data={getChartData()} />

                {postId && process.env.VITE_ANALYZE_API_ENABLED && (
                  <Button
                    onClick={handleServerAnalysis}
                    disabled={analyzing}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    {analyzing ? "분석 중..." : "서버 분석 실행 (Python)"}
                  </Button>
                )}

                {analysisResult && (
                  <div className="space-y-2">
                    {analysisResult.imageUrl && (
                      <img
                        src={analysisResult.imageUrl || "/placeholder.svg"}
                        alt="Server Analysis Result"
                        className="w-full rounded-xl"
                      />
                    )}
                    {analysisResult.series && analysisResult.labels && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-sm text-blue-700 dark:text-blue-300">서버 분석 결과가 반환되었습니다</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">컬럼을 선택하면 차트 미리보기가 표시됩니다</p>
            )}
          </Section>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={() => navigate("adminDashboard")}>
          대시보드로 돌아가기
        </Button>
      </div>
    </div>
  )
}
