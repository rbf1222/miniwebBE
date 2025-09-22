"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check, Languages } from "lucide-react"

interface TranslateResultCardProps {
  originalText: string
  translatedText: string
  targetLang: string
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

export function TranslateResultCard({ originalText, translatedText, targetLang }: TranslateResultCardProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      toast({
        title: "복사됨",
        description: "번역 결과가 클립보드에 복사되었습니다.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "오류",
        description: "복사에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const targetLanguage = languages.find((lang) => lang.code === targetLang)

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            번역 결과
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2 bg-transparent">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "복사됨" : "복사"}
          </Button>
        </CardTitle>
        <CardDescription>{targetLanguage?.name}로 번역된 결과입니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">원본 텍스트</div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm">{originalText}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-muted-foreground mb-2">번역 결과</div>
          <Textarea
            value={translatedText}
            readOnly
            rows={Math.max(3, Math.ceil(translatedText.length / 50))}
            className="resize-none bg-background"
          />
        </div>
      </CardContent>
    </Card>
  )
}
