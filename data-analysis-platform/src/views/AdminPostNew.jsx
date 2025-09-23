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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { uploadPost, analyzePost, getPost } from "../lib/api.js"
import { showToast } from "../components/ToastHost.jsx"

export default function AdminPostNew({ navigate }) {
  const [title, setTitle] = useState("2025년 선박 데이터")
  const [file, setFile] = useState(null)
  const [workbook, setWorkbook] = useState(null)
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState(undefined)
  const [columns, setColumns] = useState([])
  const [selectedColumn, setSelectedColumn] = useState(undefined) // Single column selection for X-axis
  const [postId, setPostId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    setSelectedSheet(undefined) // Reset to undefined instead of empty string
    setColumns([])
    setSelectedColumn(undefined) // Reset single column selection
    setAnalysisResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: "array" })
        setWorkbook(wb)
        setSheetNames(wb.SheetNames)

        showToast("Excel 파일이 성공적으로 로드되었습니다", "success")
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
        const rawHeaders = jsonData[0] || []
        const cleanHeaders = rawHeaders
          .map((header, index) => {
            if (!header || header.toString().trim() === "") {
              return `UNNAMED_COL_${index + 1}`
            }
            return header.toString().trim()
          })
          .filter(Boolean)

        setColumns(cleanHeaders)
        setSelectedColumn(undefined) // Reset column selection when sheet changes
      }
    } catch (error) {
      showToast("컬럼 추출 중 오류가 발생했습니다", "error")
    }
  }

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName)
    setSelectedColumn(undefined) // Reset column selection
    if (workbook) {
      extractColumns(workbook, sheetName)
    }
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

      let retryCount = 0
      const maxRetries = 3
      const retryInterval = 500

      const fetchPostDetail = async () => {
        try {
          await getPost(response.postId)
          navigate("postDetail", { id: response.postId })
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++
            setTimeout(fetchPostDetail, retryInterval)
          } else {
            showToast("게시물 상세 정보를 불러오는데 실패했습니다", "error")
            navigate("postsList")
          }
        }
      }

      fetchPostDetail()
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleServerAnalysis = async () => {
    if (!postId || !selectedSheet || !selectedColumn) {
      showToast("게시물 발행 후 시트와 컬럼을 선택해주세요", "error")
      return
    }

    setAnalyzing(true)
    try {
      const response = await analyzePost({
        postId,
        sheet: selectedSheet,
        column: selectedColumn, // Send single column name directly
      })
      setAnalysisResult(response)
      showToast("서버 분석이 완료되었습니다", "success")
    } catch (error) {
      showToast("서버 분석 중 오류가 발생했습니다", "error")
    } finally {
      setAnalyzing(false)
    }
  }

  const getChartData = () => {
    if (!workbook || !selectedSheet || !selectedColumn) return null

    try {
      const worksheet = workbook.Sheets[selectedSheet]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const values = jsonData.map((row) => {
        const value = row[selectedColumn]
        return value === undefined || value === null || value === "" ? "NULL" : value.toString()
      })

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

      return [
        {
          column: selectedColumn,
          data: processedData,
          total,
        },
      ]
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
                {file && <p className="text-xs text-slate-600 dark:text-slate-400">선택된 파일: {file.name}</p>}
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
          <Section title="시트 & X축 컬럼 선택">
            {sheetNames.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <Label>1단계: 시트 선택</Label>
                  <Select value={selectedSheet} onValueChange={handleSheetChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="시트를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {sheetNames.map((sheetName) => (
                        <SelectItem key={sheetName} value={sheetName}>
                          {sheetName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {columns.length > 0 && (
                  <div>
                    <Label>2단계: X축 컬럼 선택 (도넛 차트용)</Label>
                    <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                      <SelectTrigger>
                        <SelectValue placeholder="컬럼을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column.startsWith("UNNAMED_COL_") ? `(Unnamed Column ${column.split("_")[2]})` : column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">Y축은 도넛 차트에서 사용되지 않습니다</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSheet(undefined)
                    setColumns([])
                    setSelectedColumn(undefined)
                  }}
                  className="w-full bg-transparent"
                >
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
          <Section title="도넛 차트 미리보기">
            {selectedColumn ? (
              <div className="space-y-4">
                <ChartPreview data={getChartData()} />

                {postId && import.meta.env.VITE_ANALYZE_API_ENABLED && (
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
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Python 분석 결과:</p>
                        <img
                          src={analysisResult.imageUrl || "/placeholder.svg"}
                          alt="Python Analysis Result"
                          className="w-full rounded-xl border"
                          onError={(e) => {
                            e.target.style.display = "none"
                            showToast("이미지를 불러올 수 없습니다", "error")
                          }}
                        />
                      </div>
                    )}
                    {analysisResult.series && !analysisResult.imageUrl && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Python 분석 데이터:</p>
                        <ChartPreview
                          data={[
                            {
                              column: selectedColumn,
                              data: analysisResult.series.map((item) => ({
                                label: item.label,
                                count: item.value,
                                percentage: (item.value / analysisResult.total) * 100,
                              })),
                              total: analysisResult.total,
                            },
                          ]}
                        />
                      </div>
                    )}
                    {analysisResult.error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <p className="text-sm text-red-700 dark:text-red-300">분석 오류: {analysisResult.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">시트와 X축 컬럼을 선택하면 도넛 차트 미리보기가 표시됩니다</p>
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
