"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth"
import { LogOut, User, Settings } from "lucide-react"
import { translateText } from "../../src/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import { FloatingActionButton } from "./floating-action-button"


interface AppLayoutProps {
  children: React.ReactNode
  onChange: (value: string) => void;
  translateText?: (text: string, targetLang: string) => Promise<string>; // 추가
}

export function AppLayout({ children, onChange, translateText }: AppLayoutProps) {
  const { user, logout, initialize } = useAuthStore()
  const router = useRouter()
  const { t, i18n, ready } = useTranslation()

  const [language, setLanguage] = useState("ko") // 기본값 한국어

  useEffect(() => {
    console.log("현재 language 상태:", language);
  }, [language]);

  // i18n 초기화 후 언어 변경 로직을 분리
  useEffect(() => {
    initialize();
    if (ready && i18n?.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []); // initialize는 한 번만 실행

  useEffect(() => {
    if (ready && i18n?.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, ready, i18n, initialize]);

  // 드롭다운 변경 시 i18next만 변경 (단일 소스)
  const handleLangChange = (lang: string) => {
    localStorage.setItem("lang", lang);
    if (ready) i18n.changeLanguage(lang)
  }
  // useEffect(() => {
  //   initialize();

  //   if (i18n?.changeLanguage && ready) {
  //     i18n.changeLanguage(language);
  //   }
  // }, [i18n, ready, initialize, language]);

  const handleLogout = () => {
    try {
      logout()
    } finally {
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex-shrink-0 border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/posts" className="text-xl font-bold text-primary">
            DataViz Platform
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/posts">{t("posts")}</Link>
              </Button>

              <Select onValueChange={
                handleLangChange
                // (lang) => {
                // console.log(lang);

                // setLanguage(lang);
                // onChange(lang)

                // if (i18n && ready) {
                //   i18n.changeLanguage(lang);
                // }
                // }
              } >
                <SelectTrigger className="w-24 h-9 px-2 py-1 text-sm bg-transparent border-none shadow-none focus:ring-0 focus:outline-none transition-colors duration-200 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md">
                  <SelectValue placeholder="한국어" />
                </SelectTrigger>
                <SelectContent className="w-24">
                  <SelectItem className="w-24" value="ko">한국어</SelectItem>
                  <SelectItem className="w-24" value="en">English</SelectItem>
                  <SelectItem className="w-24" value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>


              {user?.role === "admin" && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">{t("admin")}</Link>
                </Button>
              )}
            </nav>

            {/* ✅ 상단바에 눈에 띄는 로그아웃 버튼 추가 */}
            <Button variant="secondary" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>

            {/* 아바타 드롭다운 (모바일/보조 용) */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* ▼▼▼ [수정 2] AvatarImage 태그를 추가하여 이미지를 표시합니다. ▼▼▼ */}
                      <AvatarImage src={user?.avatarUrl} alt="프로필 사진" />
                      <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem disabled className="opacity-100">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-semibold">{user?.username}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile/edit">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>프로필 수정</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 md:hidden">
                    <LogOut className="h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <FloatingActionButton />
    </div>
  )
}
