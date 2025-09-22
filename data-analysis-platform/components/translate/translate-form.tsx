"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { Languages, ArrowRight } from "lucide-react"

interface TranslateFormProps {
  onTranslationResult: (result: { text: string; translatedText: string; targetLang: string }) => void
}

const languages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
]

export function TranslateForm({ onTranslationResult }: TranslateFormProps) {
  const [text, setText] = useState("")
  const [targetLang, setTargetLang] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      toast({
        title: "오류",
        description: "번역할 텍스트를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await apiClient.translate({
        text: text.trim(),
        targetLang,
      })

      onTranslationResult({
        text: text.trim(),
        translatedText: result.translatedText,
        targetLang,
      })

      toast({
        title: "성공",
        description: "번역이 완료되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "번역에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedLanguage = languages.find((lang) => lang.code === targetLang)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          텍스트 번역
        </CardTitle>
        <CardDescription>텍스트를 다양한 언어로 번역하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">번역할 텍스트</Label>
            <Textarea
              id="text"
              placeholder="번역하고 싶은 텍스트를 입력하세요..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">{text.length} 글자</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <div className="text-sm font-medium text-muted-foreground">원본 언어</div>
              <div className="text-lg font-semibold">자동 감지</div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <Label htmlFor="targetLang">번역 언어</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !text.trim()}>
            {isLoading ? "번역 중..." : `${selectedLanguage?.name}로 번역`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
