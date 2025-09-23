export const getAuthToken = () => {
  try {
    return localStorage.getItem("auth_token")
  } catch (error) {
    console.error("Failed to get auth token:", error)
    return null
  }
}

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("auth_token", token)
    } else {
      localStorage.removeItem("auth_token")
    }
  } catch (error) {
    console.error("Failed to set auth token:", error)
  }
}

export const getAuthRole = () => {
  try {
    return localStorage.getItem("auth_role")
  } catch (error) {
    console.error("Failed to get auth role:", error)
    return null
  }
}

export const setAuthRole = (role) => {
  try {
    if (role) {
      localStorage.setItem("auth_role", role)
    } else {
      localStorage.removeItem("auth_role")
    }
  } catch (error) {
    console.error("Failed to set auth role:", error)
  }
}

export const clearAuth = () => {
  try {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_role")
  } catch (error) {
    console.error("Failed to clear auth:", error)
  }
}
