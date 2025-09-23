"use client"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, BarChart3, Sparkles, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(
    [],
  )

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-brand/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="relative text-center mb-16 gradient-mesh rounded-3xl p-12 overflow-hidden">
          <ParticleBackground />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-brand via-brand-2 to-accent-premium bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI 기반 데이터 분석 플랫폼
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              엑셀 업로드 → 데이터 시각화 → OpenAI 분석 → 통계 요약
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button size="lg" className="gradient-btn" asChild>
                <Link href="/register">
                  <Sparkles className="w-4 h-4 mr-2" />
                  회원가입
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="glass bg-transparent" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              icon: Upload,
              title: "간편한 업로드",
              description: "엑셀 파일을 드래그 앤 드롭으로 쉽게 업로드하세요",
              gradient: "from-brand/20 to-brand/5",
              delay: 0,
            },
            {
              icon: Brain,
              title: "AI 분석",
              description: "OpenAI가 데이터를 분석하여 최적의 인사이트를 제공합니다",
              gradient: "from-brand-2/20 to-brand-2/5",
              delay: 0.2,
            },
            {
              icon: BarChart3,
              title: "시각화 & 협업",
              description: "팀원들과 실시간으로 데이터를 공유하고 협업하세요",
              gradient: "from-accent-premium/20 to-accent-premium/5",
              delay: 0.4,
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + feature.delay }}
              whileHover={{ y: -5 }}
              className="tilt-hover"
            >
              <Card className="text-center glass h-full">
                <CardHeader>
                  <motion.div
                    className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-8 w-8 text-brand" />
                  </motion.div>
                  <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center glass rounded-3xl p-12 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-brand-2/5 to-accent-premium/5 rounded-3xl" />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">
                지금 시작해보세요
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                AI 기반 데이터 분석의 새로운 경험을 만나보세요
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gradient-btn text-lg px-8 py-6" asChild>
                  <Link href="/register">
                    <Zap className="w-5 h-5 mr-2" />
                    회원가입
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  )
}
