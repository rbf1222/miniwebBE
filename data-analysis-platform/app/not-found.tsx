import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <CardTitle>페이지를 찾을 수 없습니다</CardTitle>
            <CardDescription>요청하신 페이지가 존재하지 않거나 이동되었습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
