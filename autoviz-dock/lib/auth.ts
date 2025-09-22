export interface User {
  username: string
  role: "admin" | "user"
}

export interface AuthResponse {
  message: string
  token: string
  role: "admin" | "user"
}

export interface RegisterResponse {
  message: string
  userId: string
}

export interface FindIdResponse {
  username: string
}

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export const getAuthRole = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_role")
}

export const setAuth = (token: string, role: string) => {
  localStorage.setItem("auth_token", token)
  localStorage.setItem("auth_role", role)

  // Also set cookies for middleware
  document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
  document.cookie = `auth_role=${role}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
}

export const clearAuth = () => {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("auth_role")

  // Clear cookies
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

export const isAdmin = (): boolean => {
  return getAuthRole() === "admin"
}

export const isUser = (): boolean => {
  return getAuthRole() === "user"
}

// Enhanced API call wrapper with better error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  })

  // Handle authentication errors
  if (response.status === 401) {
    clearAuth()
    window.location.href = "/login"
    throw new Error("Authentication required")
  }

  // Handle authorization errors
  if (response.status === 403) {
    window.location.href = "/forbidden"
    throw new Error("Access forbidden")
  }

  return response
}

// Multipart form data API call with auth and error handling
export const apiCallFormData = async (endpoint: string, formData: FormData): Promise<Response> => {
  const token = getAuthToken()
  const headers: HeadersInit = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  })

  // Handle authentication errors
  if (response.status === 401) {
    clearAuth()
    window.location.href = "/login"
    throw new Error("Authentication required")
  }

  // Handle authorization errors
  if (response.status === 403) {
    window.location.href = "/forbidden"
    throw new Error("Access forbidden")
  }

  return response
}

// Role-based route checker
export const canAccessRoute = (route: string, userRole: string | null): boolean => {
  if (!userRole) return false

  // Admin routes
  if (route.startsWith("/admin")) {
    return userRole === "admin"
  }

  // User routes
  if (route.startsWith("/app")) {
    return userRole === "admin" || userRole === "user"
  }

  // Public routes
  const publicRoutes = ["/", "/login", "/signup", "/find-id"]
  return publicRoutes.includes(route)
}
