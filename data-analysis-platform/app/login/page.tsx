
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogIn, Sparkles, User, Lock, ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import '../../src/lib/i18n';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuthStore()
  const router = useRouter()
  const { t, i18n, ready } = useTranslation()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await apiClient.login(formData)
      login(result.token, result.role, formData.username)
      toast({ title: "성공", description: result.message, duration: 2000})
       

      // Redirect based on role 
      if (result.role === "admin") { router.push("/admin") } else { router.push("/posts") }
    } catch (error) { toast({ title: "오류", description: error instanceof Error ? error.message : "로그인에 실패했습니다.", variant: "destructive", duration: 3000}) } finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 좌측 로고 */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AutoViz Dock
            </span>
          </Link>

          {/* 우측: 홈으로 버튼 + 언어선택 */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button variant="ghost" asChild className="text-gray-700 hover:text-purple-600">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t("home") || "홈으로"}
                </Link>
              </Button>
            </motion.div>

            {/* ✅ 언어 선택 드롭다운
            {ready && (
              <select
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                aria-label="언어 선택"
                className="ml-2 rounded-md border border-gray-300 bg-white py-1 px-2 text-sm text-gray-700 shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                defaultValue={i18n.language || "ko"}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            )} */}
          </div>
        </div>
      </nav>

      {/* 로그인 폼 */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("loginTitle")}</h1>
              <p className="text-gray-600">{t("loginDescription") || "계정에 로그인하세요"}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-gray-700 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t("username") || "사용자명"}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-100"
                  placeholder={t("usernamePlaceholder") || "사용자명을 입력하세요"}
                />
              </motion.div>

              {/* 비밀번호 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t("password") || "비밀번호"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-100"
                  placeholder={t("passwordPlaceholder") || "비밀번호를 입력하세요"}
                />
              </motion.div>

              {/* 로그인 버튼 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("processing")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      {t("login")}
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 space-y-4 text-center"
            >
              <Link
                href="/find-id"
                className="block text-purple-600 hover:text-purple-700 transition-colors duration-300 hover:underline"
              >
                {t("findId") || "아이디 찾기"}
              </Link>
              <div className="text-gray-600">
                {t("noAccount") || "계정이 없으신가요?"}{" "}
                <Link
                  href="/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300 hover:underline"
                >
                  {t("register") || "회원가입"}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
