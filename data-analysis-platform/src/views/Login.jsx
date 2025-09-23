"use client"

import { useState } from "react"
import PageTitle from "../components/PageTitle.jsx"
import Card from "../components/Card.jsx"
import FormRow from "../components/FormRow.jsx"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { login } from "../lib/api.js"
import { setAuthToken, setAuthRole } from "../lib/storage.js"
import { showToast } from "../components/ToastHost.jsx"

export default function Login({ navigate, setAuth }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await login(formData)
      setAuthToken(response.token)
      setAuthRole(response.role)
      setAuth(response.token, response.role)

      showToast(response.message, "success")

      if (response.role === "admin") {
        navigate("adminDashboard")
      } else {
        navigate("userHome")
      }
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role) => {
    const demoToken = "demo-token"
    setAuthToken(demoToken)
    setAuthRole(role)
    setAuth(demoToken, role)

    showToast(`${role === "admin" ? "관리자" : "사용자"} 데모 모드로 로그인되었습니다`, "success")

    if (role === "admin") {
      navigate("adminDashboard")
    } else {
      navigate("userHome")
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8">
      <PageTitle>로그인</PageTitle>

      <div className="max-w-md mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormRow>
              <Label htmlFor="username">사용자명</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="사용자명을 입력하세요"
                required
              />
              <p className="text-xs text-slate-500">관리자 계정 힌트: admin</p>
            </FormRow>

            <FormRow>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </FormRow>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">데모 모드로 체험해보기</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleDemoLogin("admin")}>
                관리자로 데모 로그인
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleDemoLogin("user")}>
                사용자로 데모 로그인
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <button onClick={() => navigate("findId")} className="text-sm text-blue-600 hover:text-blue-700">
              아이디 찾기
            </button>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              계정이 없으신가요?{" "}
              <button onClick={() => navigate("signup")} className="text-blue-600 hover:text-blue-700">
                회원가입
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
