interface User {
  username: string
  role: "admin" | "user"
  token: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (token: string, role: "admin" | "user", username: string) => void
  logout: () => void
  initialize: () => void
}

import { create } from "zustand"

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (token: string, role: "admin" | "user", username: string) => {
    const user = { username, role, token }
    localStorage.setItem("auth_token", token)
    localStorage.setItem("auth_role", role)
    localStorage.setItem("auth_username", username)
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_role")
    localStorage.removeItem("auth_username")
    set({ user: null, isAuthenticated: false })
  },

  initialize: () => {
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("auth_role") as "admin" | "user" | null
    const username = localStorage.getItem("auth_username")

    console.log(`token ${token}`);
    console.log(`role ${role}`);
    console.log(`username ${username}`);

    if (token && role && username) {
      // ✅ 저장된 로그인 정보가 있다면
      set({
        user: { username, role, token },
        isAuthenticated: true, // ✅ 여기서도 true로 설정됩니다 (자동 로그인)
        isInitializing: false,
      })
    } else {
      // ⛔ 로그인 정보 없으면 로그인 상태 아님
      set({
        isInitializing: false,
      })
    }
  },
}))
