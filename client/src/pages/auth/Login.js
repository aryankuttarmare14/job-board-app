"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [formErrors, setFormErrors] = useState({})
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, isAdmin, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin || user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    }
  }, [isAuthenticated, isAdmin, navigate, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
    setLoginError("")
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format"
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
    } catch (err) {
      setLoginError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>

          {loginError && (
            <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-2 rounded">
              {loginError}
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${formErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {formErrors.email && <p className="text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${formErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {formErrors.password && <p className="text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white ${isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
