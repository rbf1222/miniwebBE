"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Upload,
  Users,
  MessageSquare,
  Settings,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Bell,
  UserCheck,
} from "lucide-react"

/* ----------------------------- Navigation ----------------------------- */

function Navigation() {
  return (
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

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="gradient-primary text-white border-0" asChild>
                <Link href="/register">시작하기</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

/* ----------------------------- Hero Section ----------------------------- */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-background" />

      {/* Floating animated elements */}
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

      {/* Sparkle effects */}
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

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-balance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <motion.span
              className="text-foreground inline-block"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              AI 기반
            </motion.span>{" "}
            <motion.span
              className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent inline-block"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              데이터 분석
            </motion.span>{" "}
            <motion.span
              className="text-foreground inline-block"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              플랫폼
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            엑셀 업로드부터 AI 분석, 시각화, SMS 알림까지
            <br className="hidden md:block" />
            모든 데이터 워크플로우를 하나의 플랫폼에서
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button size="lg" className="gradient-primary text-white border-0 px-8 py-6 text-lg shadow-lg" asChild>
                <Link href="/register">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                  </motion.div>
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg glass-effect bg-transparent" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: "10K+", label: "활성 사용자" },
              { number: "1M+", label: "분석된 데이터" },
              { number: "99.9%", label: "업타임" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1.5 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center"
              >
                <motion.div
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(var(--primary), 0)",
                      "0 0 10px rgba(var(--primary), 0.3)",
                      "0 0 0px rgba(var(--primary), 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------- Features Section ----------------------------- */

function FeaturesSection() {
  const features = [
    {
      icon: Settings,
      title: "어드민 관리",
      description: "엑셀 업로드로 자동 시각화, 게시글 관리, 사용자/어드민 뷰 전환이 가능합니다.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "사용자 시스템",
      description: "게시물 조회, 검색, 댓글 작성 및 관리 기능을 제공합니다.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: UserCheck,
      title: "회원 관리",
      description: "안전한 회원가입, 로그인, JWT 인증, 아이디 찾기 기능을 지원합니다.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Bell,
      title: "SMS 알림",
      description: "새로운 게시물 발행 시 자동으로 SMS 알림을 전송합니다.",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section id="features" className="py-24 bg-accent/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">강력한 기능들</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            데이터 분석 워크플로우를 혁신하는 핵심 기능들을 만나보세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -10,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <Card className="h-full glass-effect hover:shadow-2xl transition-all duration-500 group border-0 bg-background/50">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-125 transition-all duration-500`}
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Process Section ----------------------------- */

function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "회원가입/로그인",
      description: "안전한 인증 시스템으로 계정을 생성하고 로그인",
      icon: UserCheck,
    },
    {
      number: "02",
      title: "데이터 업로드",
      description: "어드민이 엑셀 파일을 업로드하고 컬럼을 선택",
      icon: Upload,
    },
    {
      number: "03",
      title: "자동 시각화",
      description: "선택된 데이터로 자동으로 차트와 그래프 생성",
      icon: BarChart3,
    },
    {
      number: "04",
      title: "커뮤니티 참여",
      description: "게시물 조회, 댓글 작성으로 데이터 인사이트 공유",
      icon: MessageSquare,
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">간단한 4단계 프로세스</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            복잡한 데이터 분석을 누구나 쉽게 할 수 있도록 설계했습니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(var(--primary), 0.3)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <step.icon className="w-10 h-10 text-primary" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                >
                  {step.number}
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- CTA Section ----------------------------- */

function CTASection() {
  return (
    <section className="py-24 bg-accent/30 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-balance"
            animate={{
              textShadow: [
                "0 0 0px rgba(var(--primary), 0)",
                "0 0 20px rgba(var(--primary), 0.2)",
                "0 0 0px rgba(var(--primary), 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            지금 바로 시작하세요
          </motion.h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            복잡한 데이터 분석을 간단하게, AI의 힘으로 더 스마트하게
            <br className="hidden md:block" />
            AutoViz Dock과 함께 데이터의 진정한 가치를 발견하세요
          </p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                y: -5,
                boxShadow: "0 10px 30px rgba(var(--primary), 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button size="lg" className="gradient-primary text-white border-0 px-8 py-6 text-lg shadow-xl" asChild>
                <Link href="/register">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    }}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                  </motion.div>
                  무료로 시작하기
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { icon: Shield, text: "보안 인증" },
              { icon: Clock, text: "24/7 지원" },
              { icon: Sparkles, text: "무료 체험" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 2,
                    ease: "linear",
                  }}
                >
                  <item.icon className="w-4 h-4" />
                </motion.div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------- Footer ----------------------------- */

function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">AutoViz Dock</span>
          </motion.div>

          <p className="text-sm text-muted-foreground">© 2025 AutoViz Dock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------- Main Page ----------------------------- */

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  )
}
