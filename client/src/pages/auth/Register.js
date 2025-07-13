"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker",
    company: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [registerError, setRegisterError] = useState("")
  const { register, isAuthenticated, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }

    // Clear any previous errors
    clearError()
  }, [isAuthenticated, navigate, clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }

    // Clear register error when user types
    if (registerError) {
      setRegisterError("")
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (formData.role === "employer" && !formData.company.trim()) {
      errors.company = "Company name is required for employers"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registerData } = formData
        await register(registerData)
        // Redirect will happen automatically due to the useEffect
      } catch (err) {
        // Set specific register error message
        setRegisterError(err.response?.data?.error || "Registration failed. Please try again.")
        console.error("Registration failed:", err)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Create an Account</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Join our platform and start your journey</p>
          </div>

        {registerError && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm mb-4 sm:mb-6" role="alert">
              {registerError}
          </div>
        )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border text-sm sm:text-base rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  formErrors.name 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
              placeholder="John Doe"
            />
              {formErrors.name && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>}
          </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border text-sm sm:text-base rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  formErrors.email 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
              placeholder="your@email.com"
            />
              {formErrors.email && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>}
          </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border text-sm sm:text-base rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  formErrors.password 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
              placeholder="••••••••"
            />
              {formErrors.password && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>}
          </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border text-sm sm:text-base rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                  formErrors.confirmPassword 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
              placeholder="••••••••"
            />
              {formErrors.confirmPassword && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>}
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">Account Type</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="job_seeker"
                  checked={formData.role === "job_seeker"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Job Seeker</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="employer"
                  checked={formData.role === "employer"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Employer</span>
              </label>
            </div>
          </div>

          {formData.role === "employer" && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border text-sm sm:text-base rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    formErrors.company 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                placeholder="Acme Inc."
              />
                {formErrors.company && <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{formErrors.company}</p>}
            </div>
          )}

          <button
            type="submit"
              className="w-full py-2 sm:py-3 px-4 rounded-md text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Register
          </button>
        </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Login here
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
