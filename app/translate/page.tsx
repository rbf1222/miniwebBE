"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layouts/app-layout"
import { TranslateForm } from "@/components/translate/translate-form"
import { TranslateResultCard } from "@/components/translate/translate-result-card"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Languages } from "lucide-react"

interface TranslationResult {
  text: string
  translatedText: string
  targetLang: string
}

export default function TranslatePage() {
  const [result, setResult] = useState<TranslationResult | null>(null)

  const handleTranslationResult = (translationResult: TranslationResult) => {
    setResult(translationResult)
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">번역 도구</h1>
              <p className="text-muted-foreground">텍스트를 다양한 언어로 번역하세요</p>
            </div>

            {/* Translation Form */}
            <TranslateForm onTranslationResult={handleTranslationResult} />

            {/* Translation Result */}
            {result && (
              <TranslateResultCard
                originalText={result.text}
                translatedText={result.translatedText}
                targetLang={result.targetLang}
              />
            )}

            {/* Help Card */}
            {!result && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">번역 도구 사용법</CardTitle>
                  <CardDescription className="max-w-md mx-auto">
                    위의 폼에 번역하고 싶은 텍스트를 입력하고 목표 언어를 선택한 후 번역 버튼을 클릭하세요. 번역 결과는
                    복사 버튼을 통해 클립보드에 복사할 수 있습니다.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
