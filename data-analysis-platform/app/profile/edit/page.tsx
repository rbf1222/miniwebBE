"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth" // 1. useAuthStore를 import 합니다.

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Lock, Save, Loader2 } from "lucide-react"

export default function ProfileEditPage() {
  const router = useRouter()

  const {user} = useAuthStore()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

    const handleSaveChanges = async () => {
    // 1. 새 비밀번호가 입력되었는지 확인합니다.
    if (!newPassword) {
      alert("새로운 비밀번호를 입력해주세요.")
      return
    }
    // 2. 비밀번호 길이를 확인합니다.
    if (newPassword.length < 8) {
      alert("새 비밀번호는 8자 이상이어야 합니다.")
      return
    }
    // 3. 두 비밀번호가 일치하는지 확인합니다.
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }

    setIsLoading(true)

    try {
      // ▼▼▼ [수정된 부분] 실제 서버로 PUT 요청을 보냅니다. ▼▼▼
      const response = await fetch("http://여기에 IP주소 및 포트 입력/api/users/password", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 만약 인증 토큰이 필요하다면 아래와 같이 추가해야 합니다.
        'Authorization': `Bearer ${user?.token}`, 
        },
        body: JSON.stringify({
          newPassword: newPassword,
        }),
      });

      // 서버로부터 응답이 성공적이지 않은 경우 에러를 발생시킵니다.
      if (!response.ok) {
        // 서버에서 보낸 에러 메시지가 있다면 사용하고, 없다면 기본 메시지를 사용합니다.
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '서버와의 통신에 실패했습니다.');
      }

      // 성공적으로 응답을 받은 경우
      alert("비밀번호가 성공적으로 변경되었습니다.")
      router.back()
      // ▲▲▲ [수정된 부분] ▲▲▲

    } catch (error) {
      console.error("비밀번호 변경 실패:", error)
      // error가 Error 인스턴스인지 확인하여 타입스크립트 오류를 방지합니다.
      if (error instanceof Error) {
        alert(`비밀번호 변경 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false)
    }
  }

//   const handleSaveChanges = async () => {
//     // 1. 새 비밀번호가 입력되었는지 확인합니다.
//     if (!newPassword) {
//       alert("새로운 비밀번호를 입력해주세요.")
//       return
//     }
//     // 2. 비밀번호 길이를 확인합니다.
//     if (newPassword.length < 6) {
//       alert("새 비밀번호는 6자 이상이어야 합니다.")
//       return
//     }
//     // 3. 두 비밀번호가 일치하는지 확인합니다.
//     if (newPassword !== confirmPassword) {
//       alert("새 비밀번호가 일치하지 않습니다.")
//       return
//     }

//     setIsLoading(true)

//     try {
//       // 실제 서버와 통신하는 것을 시뮬레이션합니다.
//       await new Promise(resolve => setTimeout(resolve, 1500))

//       console.log("새로운 비밀번호가 백엔드로 전송되었습니다:", newPassword)
      
//       alert("비밀번호가 성공적으로 변경되었습니다.")

//       router.back()

//     } catch (error) { // ▼▼▼ [수정된 부분] catch 구문에 중괄호 { } 를 추가했습니다. ▼▼▼
//       console.error("비밀번호 변경 실패:", error)
//       alert("비밀번호 변경 중 오류가 발생했습니다.")
//     } finally { // ▲▲▲ [수정된 부분] ▲▲▲
//       setIsLoading(false)
//     }
//   }

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-8">
      <Card>
        <CardHeader>
          {/* 제목과 설명을 비밀번호 변경에 맞게 수정했습니다. */}
          <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
          <CardDescription>
            새로운 비밀번호를 설정해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 사진, 이름, 현재 비밀번호 입력란을 모두 제거했습니다. */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8자 이상의 새로운 비밀번호"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새로운 비밀번호를 다시 입력하세요"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "저장 중..." : "비밀번호 저장"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

