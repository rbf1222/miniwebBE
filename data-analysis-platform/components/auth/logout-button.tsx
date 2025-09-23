"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { className?: string };

export function LogoutButton({ className }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // (선택) 서버 세션이 있다면 호출
      // await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

      // 클라이언트 보관 토큰 제거
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_role");
      sessionStorage.clear(); // 혹시 사용 중이라면
    } catch (e) {
      // 실패해도 클라 토큰만 제거하면 UX상 문제 없음
    } finally {
      // 메인 페이지로 이동
      router.replace("/");
      // 캐시된 서버 컴포넌트 다시 로드
      router.refresh();
    }
  };

  return (
    <Button variant="secondary" onClick={handleLogout} className={className}>
      로그아웃
    </Button>
  );
}
