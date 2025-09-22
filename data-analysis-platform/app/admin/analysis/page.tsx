import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { AIAnalysisStepper } from "@/components/ai/ai-analysis-stepper"

export default function AdminAnalysisPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-accent-premium bg-clip-text text-transparent">
              AI 데이터 분석
            </h1>
            <p className="text-muted-foreground mt-2">
              업로드된 Excel 파일을 OpenAI로 분석하여 인사이트와 시각화를 생성합니다.
            </p>
          </div>
          <AIAnalysisStepper />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
