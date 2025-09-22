"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Download, FileSpreadsheet, Brain, BarChart3 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  title: string
  author: string
  createdAt: string
}

interface Filter {
  col: string
  op: "eq" | "neq" | "in" | "gt" | "lt" | "gte" | "lte"
  value: string
}

interface AnalysisResult {
  summary: string
  spec: {
    chartType: "bar" | "line" | "pie"
    xKey: string
    yKey: string
    series?: string[]
  }
  data: Array<Record<string, any>>
}

export function AIAnalysisStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [csvPath, setCsvPath] = useState<string>("")
  const [columns, setColumns] = useState<string[]>([])
  const [analysisConfig, setAnalysisConfig] = useState({
    xCol: "",
    yCol: "",
    chartType: "bar" as "bar" | "line" | "pie",
    agg: "sum" as "sum" | "avg" | "max" | "min" | "count" | "ratio",
    groupBy: "",
    filters: [] as Filter[],
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const steps = [
    { number: 1, title: "게시물 선택", icon: FileSpreadsheet },
    { number: 2, title: "CSV 변환", icon: Brain },
    { number: 3, title: "컬럼 설정", icon: BarChart3 },
    { number: 4, title: "분석 결과", icon: Download },
  ]

  const loadPosts = async () => {
    try {
      const data = await apiClient.getPosts()
      setPosts(data)
    } catch (error) {
      toast({
        title: "오류",
        description: "게시물을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const convertToCSV = async () => {
    if (!selectedPost) return

    setLoading(true)
    try {
      const result = await apiClient.convertToCSV({
        postId: Number.parseInt(selectedPost.id),
      })
      setCsvPath(result.csvPath)

      // Load columns from the original file for preview
      const response = await fetch(`/api/posts/${selectedPost.id}`)
      const postData = await response.json()

      // Simulate loading Excel file to get column headers
      // In real implementation, you'd fetch the actual file
      const mockColumns = ["날짜", "제품명", "수량", "불량수", "총량", "카테고리", "지역"]
      setColumns(mockColumns)

      toast({
        title: "변환 완료",
        description: "Excel 파일이 CSV로 변환되었습니다.",
      })
      setCurrentStep(3)
    } catch (error) {
      toast({
        title: "변환 실패",
        description: "CSV 변환 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async () => {
    if (!selectedPost || !analysisConfig.xCol) return

    setLoading(true)
    try {
      const result = await apiClient.analyzeData({
        postId: Number.parseInt(selectedPost.id),
        csvPath,
        ...analysisConfig,
      })
      setAnalysisResult(result)
      setCurrentStep(4)
      toast({
        title: "분석 완료",
        description: "AI 분석이 완료되었습니다.",
      })
    } catch (error) {
      toast({
        title: "분석 실패",
        description: "AI 분석 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addFilter = () => {
    setAnalysisConfig((prev) => ({
      ...prev,
      filters: [...prev.filters, { col: "", op: "eq", value: "" }],
    }))
  }

  const removeFilter = (index: number) => {
    setAnalysisConfig((prev) => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
    }))
  }

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    setAnalysisConfig((prev) => ({
      ...prev,
      filters: prev.filters.map((filter, i) => (i === index ? { ...filter, [field]: value } : filter)),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <motion.div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.number
                  ? "bg-brand text-white border-brand"
                  : "bg-background border-border text-muted-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <step.icon className="w-5 h-5" />
            </motion.div>
            <div className="ml-3">
              <p className="text-sm font-medium">{step.title}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-brand" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Post Selection */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle>분석할 게시물을 선택하세요</CardTitle>
              <CardDescription>업로드된 Excel 파일 중 분석하고 싶은 데이터를 선택해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={loadPosts} variant="outline" className="w-full bg-transparent">
                게시물 목록 불러오기
              </Button>

              {posts.length > 0 && (
                <div className="grid gap-3">
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedPost?.id === post.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/50"
                      }`}
                      onClick={() => setSelectedPost(post)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.author} • {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedPost && (
                <Button onClick={() => setCurrentStep(2)} className="w-full gradient-btn">
                  다음 단계로
                </Button>
              )}
            </CardContent>
          </motion.div>
        )}

        {/* Step 2: CSV Conversion */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle>CSV 변환</CardTitle>
              <CardDescription>선택한 Excel 파일을 AI 분석을 위한 CSV 형식으로 변환합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPost && (
                <div className="p-4 bg-muted rounded-xl">
                  <h3 className="font-medium">{selectedPost.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPost.author} • {new Date(selectedPost.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              )}

              {!csvPath ? (
                <Button onClick={convertToCSV} disabled={loading} className="w-full gradient-btn">
                  {loading ? "변환 중..." : "CSV로 변환하기"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-success">
                    <Brain className="w-5 h-5" />
                    <span>변환 완료: {csvPath}</span>
                  </div>
                  <Button onClick={() => setCurrentStep(3)} className="w-full gradient-btn">
                    컬럼 설정하기
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}

        {/* Step 3: Column Configuration */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-6"
          >
            <CardHeader>
              <CardTitle>분석 설정</CardTitle>
              <CardDescription>차트에 사용할 컬럼과 분석 방법을 선택해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X축 (카테고리)</Label>
                  <Select
                    value={analysisConfig.xCol}
                    onValueChange={(value) => setAnalysisConfig((prev) => ({ ...prev, xCol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="컬럼 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Y축 (값)</Label>
                  <Select
                    value={analysisConfig.yCol}
                    onValueChange={(value) => setAnalysisConfig((prev) => ({ ...prev, yCol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="컬럼 선택 (선택사항)" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>집계 방법</Label>
                  <Select
                    value={analysisConfig.agg}
                    onValueChange={(value: any) => setAnalysisConfig((prev) => ({ ...prev, agg: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">합계</SelectItem>
                      <SelectItem value="avg">평균</SelectItem>
                      <SelectItem value="count">개수</SelectItem>
                      <SelectItem value="max">최대값</SelectItem>
                      <SelectItem value="min">최소값</SelectItem>
                      <SelectItem value="ratio">비율</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>차트 유형</Label>
                  <Select
                    value={analysisConfig.chartType}
                    onValueChange={(value: any) => setAnalysisConfig((prev) => ({ ...prev, chartType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">막대 차트</SelectItem>
                      <SelectItem value="line">선 차트</SelectItem>
                      <SelectItem value="pie">원형 차트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>그룹화 (선택사항)</Label>
                  <Select
                    value={analysisConfig.groupBy}
                    onValueChange={(value) => setAnalysisConfig((prev) => ({ ...prev, groupBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="컬럼 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>필터 조건</Label>
                  <Button onClick={addFilter} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    필터 추가
                  </Button>
                </div>

                {analysisConfig.filters.map((filter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 border rounded-lg"
                  >
                    <Select value={filter.col} onValueChange={(value) => updateFilter(index, "col", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="컬럼" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filter.op} onValueChange={(value: any) => updateFilter(index, "op", value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eq">같음</SelectItem>
                        <SelectItem value="neq">다름</SelectItem>
                        <SelectItem value="gt">초과</SelectItem>
                        <SelectItem value="gte">이상</SelectItem>
                        <SelectItem value="lt">미만</SelectItem>
                        <SelectItem value="lte">이하</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(index, "value", e.target.value)}
                      placeholder="값"
                      className="flex-1"
                    />

                    <Button onClick={() => removeFilter(index)} variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Button onClick={runAnalysis} disabled={loading || !analysisConfig.xCol} className="w-full gradient-btn">
                {loading ? "AI 분석 중..." : "OpenAI 분석 실행"}
              </Button>
            </CardContent>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && analysisResult && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <CardHeader>
                <CardTitle>분석 결과</CardTitle>
                <CardDescription>AI가 분석한 데이터 인사이트와 시각화 결과입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-r from-brand/10 to-accent-premium/10 rounded-xl border border-brand/20"
                >
                  <h3 className="font-semibold mb-2 text-brand">AI 분석 요약</h3>
                  <p className="text-sm leading-relaxed">{analysisResult.summary}</p>
                </motion.div>

                {/* Chart Placeholder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 border-2 border-dashed border-border rounded-xl text-center"
                >
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {analysisResult.spec.chartType === "bar" && "막대 차트"}
                    {analysisResult.spec.chartType === "line" && "선 차트"}
                    {analysisResult.spec.chartType === "pie" && "원형 차트"} 시각화 영역
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    X축: {analysisResult.spec.xKey} | Y축: {analysisResult.spec.yKey}
                  </p>
                </motion.div>

                {/* Download Options */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    CSV 조각 다운로드
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    JSON 결과 다운로드
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedPost(null)
                    setCsvPath("")
                    setAnalysisResult(null)
                    setAnalysisConfig({
                      xCol: "",
                      yCol: "",
                      chartType: "bar",
                      agg: "sum",
                      groupBy: "",
                      filters: [],
                    })
                  }}
                  variant="outline"
                  className="w-full"
                >
                  새로운 분석 시작
                </Button>
              </CardContent>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
