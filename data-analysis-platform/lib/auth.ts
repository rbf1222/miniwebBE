interface User {
  username: string
  role: "admin" | "user"
  token: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, role: "admin" | "user", username: string) => void
  logout: () => void
  initialize: () => void
}

import { create } from "zustand"

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

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

    if (token && role && username) {
      set({
        user: { username, role, token },
        isAuthenticated: true,
      })
    }
  },
}))
