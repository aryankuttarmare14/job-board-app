"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set auth token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        console.log("No token found, user not authenticated")
        setLoading(false)
        return
      }

      try {
        console.log("Loading user from token...")

        // We'll use the token to get user data from the backend
        const tokenParts = token.split(".")
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          console.log("Token payload:", payload)

          // Check if token is expired
          if (payload.exp * 1000 < Date.now()) {
            console.log("Token expired, logging out")
            logout()
            return
          }

          // Set user from token payload
          const userData = {
            id: payload.id,
            role: payload.role,
            isAdmin: payload.isAdmin === true || payload.role === "admin",
          }

          setUser(userData)
          console.log("User loaded from token:", userData)
        }
      } catch (err) {
        console.error("Error loading user:", err)
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
      }

      return res.data
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", { email })
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      console.log("Login response:", res.data)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        setToken(res.data.token)

        // Also set user from response
        if (res.data.user) {
          setUser(res.data.user)
          console.log("User set from login response:", res.data.user)
        }
      }

      return res.data
    } catch (err) {
      console.error("Login error:", err)
      const errorMessage = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Login failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setError(null)
    delete axios.defaults.headers.common["Authorization"]
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const authValues = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated: !!user && !!token,
    isEmployer: user?.role === "employer",
    isJobSeeker: user?.role === "job_seeker",
    isAdmin: user?.isAdmin === true || user?.role === "admin",
  }

  console.log("Auth context values:", {
    isAuthenticated: !!user && !!token,
    isJobSeeker: user?.role === "job_seeker",
    isEmployer: user?.role === "employer",
    isAdmin: user?.isAdmin === true || user?.role === "admin",
    user,
    userRole: user?.role,
  })

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
}
