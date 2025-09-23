"use client"

import { useState, useEffect } from "react"
import { clearAuth } from "./lib/storage.js" // Import clearAuth instead of individual functions
import TopNav from "./components/TopNav.jsx"
import DemoBanner from "./components/DemoBanner.jsx"
import ToastHost from "./components/ToastHost.jsx"

// Views
import Landing from "./views/Landing.jsx"
import Signup from "./views/Signup.jsx"
import Login from "./views/Login.jsx"
import FindId from "./views/FindId.jsx"
import AdminDashboard from "./views/AdminDashboard.jsx"
import AdminPostNew from "./views/AdminPostNew.jsx"
import AdminPostEdit from "./views/AdminPostEdit.jsx"
import UserHome from "./views/UserHome.jsx"
import PostsList from "./views/PostsList.jsx"
import PostDetail from "./views/PostDetail.jsx"

export default function App() {
  const [currentView, setCurrentView] = useState("landing")
  const [viewParams, setViewParams] = useState({})
  const [authToken, setAuthToken] = useState(null)
  const [authRole, setAuthRole] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token")
      const role = localStorage.getItem("auth_role")

      if (token && role) {
        setAuthToken(token)
        setAuthRole(role)
        setIsDemoMode(token === "demo-token")

        // Navigate to appropriate dashboard
        if (role === "admin") {
          setCurrentView("adminDashboard")
        } else {
          setCurrentView("userHome")
        }
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error)
      clearAuth()
    }
  }, [])

  const navigate = (view, params = {}) => {
    setCurrentView(view)
    setViewParams(params)
  }

  const setAuth = (token, role) => {
    setAuthToken(token)
    setAuthRole(role)
    setIsDemoMode(token === "demo-token")
  }

  const logout = () => {
    clearAuth()
    setAuthToken(null)
    setAuthRole(null)
    setIsDemoMode(false)
    navigate("landing")
  }

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <Landing navigate={navigate} />
      case "signup":
        return <Signup navigate={navigate} />
      case "login":
        return <Login navigate={navigate} setAuth={setAuth} />
      case "findId":
        return <FindId navigate={navigate} />
      case "adminDashboard":
        return <AdminDashboard navigate={navigate} />
      case "adminPostNew":
        return <AdminPostNew navigate={navigate} />
      case "adminPostEdit":
        return <AdminPostEdit navigate={navigate} params={viewParams} />
      case "userHome":
        return <UserHome navigate={navigate} />
      case "postsList":
        return <PostsList navigate={navigate} />
      case "postDetail":
        return <PostDetail navigate={navigate} params={viewParams} />
      default:
        return <Landing navigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {isDemoMode && <DemoBanner />}
      <TopNav navigate={navigate} authRole={authRole} logout={logout} />
      <main>{renderView()}</main>
      <ToastHost />
    </div>
  )
}
