"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PremiumLayout } from "@/components/layouts/premium-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { CheckCircle, Shield, Users, Zap, Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    role: "user" as "user" | "admin",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<{ userId: string } | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password.length < 8) {
      toast({
        title: "오류",
        description: "비밀번호는 8자 이상이어야 합니다.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await apiClient.register(formData)
      setSuccess({ userId: result.userId })
      toast({
        title: "성공",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "회원가입에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <PremiumLayout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="glass text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-brand/10" />
              <CardHeader className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-brand rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl bg-gradient-to-r from-success to-brand bg-clip-text text-transparent">
                  회원가입 완료!
                </CardTitle>
                <CardDescription className="text-lg">
                  사용자 ID: <span className="font-mono font-semibold">{success.userId}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full gradient-btn text-white" asChild>
                    <Link href="/login">
                      <Sparkles className="w-4 h-4 mr-2" />
                      로그인하기
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PremiumLayout>
    )
  }

  return (
    <PremiumLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent mb-4">
                AI 데이터 분석의 새로운 시작
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                엑셀 데이터를 업로드하고 AI가 분석한 인사이트를 팀과 공유하세요
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Shield,
                  title: "안전한 데이터 보호",
                  description: "엔터프라이즈급 보안으로 데이터를 안전하게 보호합니다",
                  gradient: "from-brand/20 to-brand/5",
                },
                {
                  icon: Users,
                  title: "팀 협업 기능",
                  description: "실시간 댓글과 공유 기능으로 팀원들과 협업하세요",
                  gradient: "from-brand-2/20 to-brand-2/5",
                },
                {
                  icon: Zap,
                  title: "빠른 AI 분석",
                  description: "OpenAI 기반 분석으로 즉시 인사이트를 얻으세요",
                  gradient: "from-accent-premium/20 to-accent-premium/5",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}>
                    <benefit.icon className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">회원가입</CardTitle>
                <CardDescription className="text-base">새 계정을 만들어 시작하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="username" className="text-sm font-medium">
                      사용자명
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="glass border-white/20 focus:border-brand/50"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="password" className="text-sm font-medium">
                      비밀번호 (최소 8자)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="glass border-white/20 focus:border-brand/50"
                      required
                      minLength={8}
                    />
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>비밀번호 강도</span>
                          <span
                            className={
                              passwordStrength >= 75
                                ? "text-success"
                                : passwordStrength >= 50
                                  ? "text-yellow-500"
                                  : "text-danger"
                            }
                          >
                            {passwordStrength >= 75 ? "강함" : passwordStrength >= 50 ? "보통" : "약함"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              passwordStrength >= 75
                                ? "bg-success"
                                : passwordStrength >= 50
                                  ? "bg-yellow-500"
                                  : "bg-danger"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="phone" className="text-sm font-medium">
                      전화번호
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="glass border-white/20 focus:border-brand/50"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="role" className="text-sm font-medium">
                      역할
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "user" | "admin") => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/20">
                        <SelectItem value="user">사용자</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" className="w-full gradient-btn text-white" disabled={isLoading}>
                      {isLoading ? "처리 중..." : "회원가입"}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  className="mt-6 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-brand hover:text-brand-2 font-medium transition-colors">
                    로그인
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PremiumLayout>
  )
}
