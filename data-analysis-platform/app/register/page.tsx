"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { CheckCircle, Shield, Sparkles, BarChart3, ArrowLeft, Brain, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function RegisterPage() {
  const { t, i18n, ready } = useTranslation()
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
        title: t("error"),
        description: t("validation.password_length"),
        variant: "destructive",
      })
      return
    }

    if (formData.phone.length !== 11) {
      toast({
        title: t("error"),
        description: t("validation.phone_length"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await apiClient.register(formData)
      setSuccess({ userId: result.userId })
      toast({
        title: t("success"),
        description: result.message,
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("register_failed"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="container mx-auto px-4 py-16 max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="glass-effect border-0 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10" />
              <CardHeader className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 gradient-primary rounded-full flex items-center justify-center mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-2">
                  {t("register_success")}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {t("user_id")}: <span className="font-mono font-semibold text-foreground">{success.userId}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button className="w-full gradient-primary text-white border-0 py-6 text-lg shadow-xl" asChild>
                    <Link href="/login">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                      </motion.div>
                      {t("go_login")}
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + i * 8}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">AutoViz Dock</span>
            </motion.div>

             {/* 우측: 홈으로 + 언어선택 */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button variant="ghost" asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    {t("go_home")}
                  </Link>
                </Button>
              </motion.div>

              {/* ✅ 언어 선택 드롭다운 추가 */}
              {ready && (
                <select
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  aria-label="언어 선택"
                  className="ml-2 rounded-md border border-gray-300 bg-white py-1 px-2 text-sm text-gray-700 shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  defaultValue={i18n.language || "ko"}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6 text-balance"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-foreground">{t("aiDataAnalysis")}</span>{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  {t("newBeginning")}
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground leading-relaxed text-pretty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t("excelInsight")}
              </motion.p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Shield,
                  title: t("adminSystem"),
                  description: t("excelFeature"),
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: Brain,
                  title: t("communityPlatform"),
                  description: t("communityFeature"),
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: TrendingUp,
                  title: t("smsService"),
                  description: t("smsFeature"),
                  color: "from-green-500 to-green-600",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-start space-x-4 group"
                >
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-r ${benefit.color} shadow-lg group-hover:shadow-xl transition-all duration-500`}
                    whileHover={{
                      rotate: [0, -5, 5, -5, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <benefit.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="glass-effect border-0 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5" />
              <CardHeader className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <CardTitle className="text-3xl font-bold mb-2">{t("signUp")}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {t("register_subtitle")}
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Label htmlFor="username" className="text-sm font-medium">
                      {t("username")}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="glass-effect border-0 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("password")} {t("passwordMinLength")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="glass-effect border-0 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      required
                      minLength={8}
                    />
                    {formData.password && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between text-xs">
                          <span>{t("passwordStrength")}</span>
                          <span
                            className={
                              passwordStrength >= 75
                                ? "text-green-500"
                                : passwordStrength >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }
                          >
                            {passwordStrength >= 75 ? t("strengthStrong") : passwordStrength >= 50 ? t("strengthMedium") : t("strengthWeak")}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full ${
                              passwordStrength >= 75
                                ? "bg-green-500"
                                : passwordStrength >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t("phone")} ({t("phoneLength")})
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, "")
                        setFormData({ ...formData, phone: numericValue })
                      }}
                      className="glass-effect border-0 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      required
                      maxLength={11}
                      minLength={11}
                      pattern="[0-9]{11}"
                      inputMode="numeric"
                      placeholder="01012345678"
                    />
                    {formData.phone && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between text-xs">
                          <span>{t("phoneNumberLength")}</span>
                          <span className={formData.phone.length === 11 ? "text-green-500" : "text-red-500"}>
                            {formData.phone.length}/11
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full ${
                              formData.phone.length === 11 ? "bg-green-500" : "bg-red-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((formData.phone.length / 11) * 100, 100)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Label htmlFor="role" className="text-sm font-medium">
                     {t("role")}
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "user" | "admin") => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="glass-effect border-0 focus:ring-2 focus:ring-primary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-effect border-0">
                        <SelectItem value="user">{t("role_user")}</SelectItem>
                        <SelectItem value="admin">{t("role_admin")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full gradient-primary text-white border-0 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                        </motion.div>
                      )}
                       {isLoading ? t("loading") : t("register")}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  className="mt-6 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {t("already_have_account")}{" "}
                  <Link href="/login" className="text-primary hover:text-chart-2 font-medium transition-colors">
                    {t("login")}
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
