const API_BASE = import.meta?.env?.VITE_API_BASE || "/api"

// Mock data for demo mode
const mockPosts = [
  {
    id: 1,
    title: "2025년 선박 데이터 분석",
    author: "admin",
    createdAt: "2025-01-15T10:30:00Z",
    fileUrl: "/demo-data.xlsx",
    comments: [
      {
        id: 1,
        user: "user1",
        content: "흥미로운 분석 결과네요!",
        createdAt: "2025-01-15T11:00:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "월별 매출 현황",
    author: "admin",
    createdAt: "2025-01-14T14:20:00Z",
    fileUrl: "/sales-data.xlsx",
    comments: [],
  },
]

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }
  return response.json()
}

const isDemoMode = () => {
  return localStorage.getItem("auth_token") === "demo-token"
}

export const get = async (endpoint) => {
  // Demo mode fallbacks
  if (isDemoMode()) {
    if (endpoint === "/posts") {
      return mockPosts.map(({ comments, ...post }) => post)
    }
    if (endpoint.startsWith("/posts/")) {
      const id = Number.parseInt(endpoint.split("/")[2])
      return mockPosts.find((p) => p.id === id) || mockPosts[0]
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export const post = async (endpoint, data) => {
  if (isDemoMode() && !endpoint.includes("/auth/")) {
    // Simulate success for demo mode
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (endpoint.includes("/comments")) {
      return { message: "댓글 작성 성공", commentId: Date.now() }
    }
    if (endpoint.includes("/translate")) {
      return { translatedText: "This is a demo translation result." }
    }

    throw new Error("데모 모드: 작업이 시뮬레이션되었습니다")
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export const put = async (endpoint, data) => {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    throw new Error("데모 모드: 작업이 시뮬레이션되었습니다")
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export const del = async (endpoint) => {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    throw new Error("데모 모드: 작업이 시뮬레이션되었습니다")
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export const upload = async (endpoint, formData) => {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return { message: "게시물 업로드 성공", postId: Date.now() }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  })
  return handleResponse(response)
}

// Specific API functions
export const register = (data) => post("/auth/register", data)
export const login = (data) => post("/auth/login", data)
export const findId = (data) => post("/auth/find-id", data)

export const uploadPost = ({ title, file }) => {
  const formData = new FormData()
  formData.append("title", title)
  formData.append("file", file)
  return upload("/admin/posts", formData)
}

export const editPost = (id, data) => put(`/admin/posts/${id}`, data)
export const deletePost = (id) => del(`/admin/posts/${id}`)

export const getPosts = () => get("/posts")
export const getPost = (id) => get(`/posts/${id}`)

export const createComment = (postId, data) => post(`/posts/${postId}/comments`, data)
export const editComment = (id, data) => put(`/comments/${id}`, data)
export const deleteComment = (id) => del(`/comments/${id}`)

export const translateText = (data) => post("/translate", data)

export const analyzePost = (data) => post("/admin/analyze-python", data)
