"use client"

import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import NavBar from "./components/NavBar.jsx"
import Protected from "./components/Protected.jsx"

// Pages
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import FindId from "./pages/FindId.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminPostNew from "./pages/AdminPostNew.jsx"
import AdminPostEdit from "./pages/AdminPostEdit.jsx"
import UserHome from "./pages/UserHome.jsx"
import PostsList from "./pages/PostsList.jsx"
import PostDetail from "./pages/PostDetail.jsx"
import NotFound from "./pages/NotFound.jsx"

const demoMode = true

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("auth_role")

    if (token && role) {
      setUser({ token, role })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {demoMode && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          데모 모드: 일부 기능이 제한될 수 있습니다.
        </div>
      )}

      <NavBar user={user} setUser={setUser} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} demoMode={demoMode} />} />
          <Route path="/find-id" element={<FindId />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <Protected requiredRole="admin" demoMode={demoMode}>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <Protected requiredRole="admin" demoMode={demoMode}>
                <AdminPostNew />
              </Protected>
            }
          />
          <Route
            path="/admin/posts/:id/edit"
            element={
              <Protected requiredRole="admin" demoMode={demoMode}>
                <AdminPostEdit />
              </Protected>
            }
          />

          {/* User routes */}
          <Route
            path="/app"
            element={
              <Protected demoMode={demoMode}>
                <UserHome />
              </Protected>
            }
          />
          <Route
            path="/app/posts"
            element={
              <Protected demoMode={demoMode}>
                <PostsList />
              </Protected>
            }
          />
          <Route
            path="/app/posts/:id"
            element={
              <Protected demoMode={demoMode}>
                <PostDetail />
              </Protected>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Login setUser={setUser} demoMode={demoMode} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
