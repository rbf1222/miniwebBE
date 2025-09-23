"use client"
import { Button } from "./ui/button"

export default function TopNav({ navigate, authRole, logout }) {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("landing")}
              className="text-xl font-semibold text-slate-900 dark:text-white"
            >
              AutoViz Dock
            </button>

            {authRole === "admin" && (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("adminDashboard")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  대시보드
                </button>
                <button
                  onClick={() => navigate("adminPostNew")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  새 게시물
                </button>
              </div>
            )}

            {authRole === "user" && (
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("userHome")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  홈
                </button>
                <button
                  onClick={() => navigate("postsList")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  게시물 목록
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!authRole ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("login")}>
                  로그인
                </Button>
                <Button size="sm" onClick={() => navigate("signup")}>
                  회원가입
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={logout}>
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
