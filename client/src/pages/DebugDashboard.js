"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config"

const DebugDashboard = () => {
  const { user, token, isAuthenticated } = useAuth()
  const [debugInfo, setDebugInfo] = useState({
    authTest: null,
    applicationsTest: null,
    jobsTest: null,
    meTest: null,
    errors: [],
  })

  useEffect(() => {
    runDebugTests()
  }, [])

  const runDebugTests = async () => {
    const errors = []

    try {
      // Test 1: Check /api/auth/me
      const meResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDebugInfo((prev) => ({ ...prev, meTest: meResponse.data }))
    } catch (error) {
      errors.push(`/api/auth/me failed: ${error.response?.data?.error || error.message}`)
    }

    try {
      // Test 2: Check applications endpoint - FIXED TO USE /me
      const appResponse = await axios.get(`${API_URL}/api/applications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDebugInfo((prev) => ({ ...prev, applicationsTest: appResponse.data }))
    } catch (error) {
      errors.push(`/api/applications/me failed: ${error.response?.data?.error || error.message}`)
    }

    try {
      // Test 3: Check employer jobs if employer
      if (user?.role === "employer") {
        const jobsResponse = await axios.get(`${API_URL}/api/jobs/employer/myjobs`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDebugInfo((prev) => ({ ...prev, jobsTest: jobsResponse.data }))
      }
    } catch (error) {
      errors.push(`/api/jobs/employer/myjobs failed: ${error.response?.data?.error || error.message}`)
    }

    setDebugInfo((prev) => ({ ...prev, errors }))
  }

  const testDirectEndpoint = async () => {
    try {
      console.log("Testing direct endpoint with token:", token)
      const response = await fetch(`${API_URL}/api/applications/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        alert("✅ Direct test successful! Check console for details.")
      } else {
        alert(`❌ Direct test failed: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Direct test error:", error)
      alert(`❌ Direct test error: ${error.message}`)
    }
  }

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload
    } catch (error) {
      return { error: "Invalid token format" }
    }
  }

  const clearAllData = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8">🔍 Dashboard Debug Information</h1>

          {/* Authentication Status */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800 dark:text-blue-200">Authentication Status</h2>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <p>
                <strong>Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>User ID:</strong> {user?.id || "Not available"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Not available"}
              </p>
              <p>
                <strong>Role:</strong> {user?.role || "Not available"}
              </p>
              <p>
                <strong>Company:</strong> {user?.company || "N/A"}
              </p>
              <p>
                <strong>Is Admin:</strong> {user?.isAdmin ? "Yes" : "No"}
              </p>
              <p>
                <strong>Token Exists:</strong> {token ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>

          {/* API Test Results */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-yellow-800 dark:text-yellow-200">API Test Results</h2>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <div>
                <h3 className="font-semibold">GET /api/auth/me:</h3>
                {debugInfo.meTest ? (
                  <p className="text-green-600 dark:text-green-400">✅ Success - User data retrieved</p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">❌ Failed</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">GET /api/applications/me:</h3>
                {debugInfo.applicationsTest ? (
                  <p className="text-green-600 dark:text-green-400">
                    ✅ Success - {debugInfo.applicationsTest.data?.length || 0} applications found
                  </p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">❌ Failed</p>
                )}
              </div>

              {user?.role === "employer" && (
                <div>
                  <h3 className="font-semibold">GET /api/jobs/employer/myjobs:</h3>
                  {debugInfo.jobsTest ? (
                    <p className="text-green-600 dark:text-green-400">✅ Success - {debugInfo.jobsTest.data?.length || 0} jobs found</p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400">❌ Failed</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* API Errors */}
          {debugInfo.errors.length > 0 && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-red-800 dark:text-red-200">API Errors</h2>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                {debugInfo.errors.map((error, index) => (
                  <li key={index} className="text-red-600 dark:text-red-400">
                    ❌ {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-purple-800 dark:text-purple-200">Debug Actions</h2>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={runDebugTests}
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 mr-2 sm:mr-4 text-xs sm:text-sm"
              >
                🔄 Re-run Tests
              </button>

              <button
                onClick={testDirectEndpoint}
                className="bg-purple-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-purple-600 mr-2 sm:mr-4 text-xs sm:text-sm"
              >
                🧪 Test Direct Endpoint
              </button>

              <button
                onClick={clearAllData}
                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 text-xs sm:text-sm"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>

          {/* Token Decoder */}
          {token && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">Token Decoder</h2>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                <pre className="text-gray-800 dark:text-gray-200">
                  {JSON.stringify(decodeToken(token), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugDashboard
