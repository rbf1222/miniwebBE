"use client"
import PageTitle from "../components/PageTitle.jsx"
import Section from "../components/Section.jsx"
import Card from "../components/Card.jsx"
import { Button } from "../components/ui/button"

export default function Landing({ navigate }) {
  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8">
      <PageTitle>AutoViz Dock에 오신 것을 환영합니다</PageTitle>

      <Section title="데이터 시각화의 새로운 경험">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto">
                📊
              </div>
              <h3 className="text-xl font-semibold">Excel 업로드</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Excel 파일을 업로드하고 시트와 컬럼을 선택하여 즉시 차트를 생성하세요.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto">
                🍩
              </div>
              <h3 className="text-xl font-semibold">도넛 차트</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                데이터를 아름다운 도넛 차트로 시각화하고 인사이트를 발견하세요.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto">
                💬
              </div>
              <h3 className="text-xl font-semibold">협업 기능</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                댓글과 번역 기능으로 팀원들과 효과적으로 소통하세요.
              </p>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">지금 시작해보세요</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("signup")}>
              회원가입하기
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("login")}>
              로그인
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
