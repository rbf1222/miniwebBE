import { useAuthStore } from "./auth"

const API_BASE = "http://여기에 IP주소 및 포트 입력"

interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string>
}



class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { user } = useAuthStore.getState()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }

    // Add auth header if user is authenticated
    if (user?.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${user.token}`,
      }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config)

    if (response.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = "/login"
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "An error occurred",
      }))
      throw new Error(error.message)
    }

    return response.json()
  }

  async uploadPostWithColumns(fd: FormData) {
    console.log("TRY")
    const { user } = useAuthStore.getState()
    console.log(user?.token)
    const res = await fetch("http://여기에 IP주소 및 포트 입력/api/admin/posts", {
      method: "POST",
      body: fd,
      // 인증이 필요하면 Authorization 헤더 추가
      headers: { Authorization: `Bearer ${user?.token}` }
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || "업로드 실패")
    return json
  }

  // Auth endpoints
  async register(data: {
    username: string
    password: string
    phone: string
    role: "admin" | "user"
  }) {
    return this.request<{ message: string; userId: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: { username: string; password: string }) {
    return this.request<{
      message: string
      token: string
      role: "admin" | "user"
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async findId(data: { phone: string }) {
    return this.request<{ username: string }>("/auth/find-id", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }



  // Admin endpoints
  async uploadPost(title: string, file: File) {
    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    const { user } = useAuthStore.getState()
    const response = await fetch(`${API_BASE}/admin/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: "Upload failed",
      }))
      throw new Error(error.message)
    }

    return response.json()
  }

  async updatePost(id: string, data: { title: string }) {
    return this.request<{ message: string }>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deletePost(id: string) {
    return this.request<{ message: string }>(`/admin/posts/${id}`, {
      method: "DELETE",
    })
  }

  // User endpoints
  async getPosts() {
    return this.request<
      Array<{
        id: string
        title: string
        author: string
        createdAt: string
      }>
    >("/posts")
  }

  async getPost(id: string) {
    return this.request<{
      id: string
      title: string
      author: string
      fileUrl: string
      createdAt: string
      comments: Array<{
        id: string
        user: string
        content: string
        createdAt: string
      }>
    }>(`/posts/${id}`)
  }

  async addComment(postId: string, data: { content: string }) {
    return this.request<{ message: string; commentId: string }>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateComment(id: string, data: { content: string }) {
    return this.request<{ message: string }>(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteComment(id: string) {
    return this.request<{ message: string }>(`/comments/${id}`, {
      method: "DELETE",
    })
  }

  // Utility endpoints
  async translate(data: { text: string; targetLang: string }) {
    return this.request<{ translatedText: string }>("/translate", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async convertToCSV(data: { postId: number; sheetIndex?: number }) {
    return this.request<{ message: string; csvPath: string }>("/ai/convert", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async analyzeData(data: {
    postId: number
    csvPath?: string
    xCol: string
    yCol?: string
    chartType: "bar" | "line" | "pie"
    agg?: "sum" | "avg" | "max" | "min" | "count" | "ratio"
    filters?: Array<{
      col: string
      op: "eq" | "neq" | "in" | "gt" | "lt" | "gte" | "lte"
      value: any
    }>
    groupBy?: string
  }) {
    return this.request<{
      summary: string
      spec: {
        chartType: "bar" | "line" | "pie"
        xKey: string
        yKey: string
        series?: string[]
      }
      data: Array<Record<string, any>>
    }>("/ai/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
