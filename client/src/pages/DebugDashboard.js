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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🔍 Dashboard Debug Information</h1>

          {/* Authentication Status */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Authentication Status</h2>
            <div className="space-y-2">
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
          <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">API Test Results</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">GET /api/auth/me:</h3>
                {debugInfo.meTest ? (
                  <p className="text-green-600">✅ Success - User data retrieved</p>
                ) : (
                  <p className="text-red-600">❌ Failed</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">GET /api/applications/me:</h3>
                {debugInfo.applicationsTest ? (
                  <p className="text-green-600">
                    ✅ Success - {debugInfo.applicationsTest.data?.length || 0} applications found
                  </p>
                ) : (
                  <p className="text-red-600">❌ Failed</p>
                )}
              </div>

              {user?.role === "employer" && (
                <div>
                  <h3 className="font-semibold">GET /api/jobs/employer/myjobs:</h3>
                  {debugInfo.jobsTest ? (
                    <p className="text-green-600">✅ Success - {debugInfo.jobsTest.data?.length || 0} jobs found</p>
                  ) : (
                    <p className="text-red-600">❌ Failed</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* API Errors */}
          {debugInfo.errors.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-red-800">API Errors</h2>
              <ul className="space-y-2">
                {debugInfo.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    ❌ {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="mb-8 p-4 bg-purple-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Debug Actions</h2>
            <div className="space-y-4">
              <button
                onClick={runDebugTests}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
              >
                🔄 Re-run Tests
              </button>

              <button
                onClick={testDirectEndpoint}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-4"
              >
                🧪 Test Direct Endpoint
              </button>

              <button onClick={clearAllData} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                🗑️ Clear All Data & Reload
              </button>

              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
              >
                📊 Try Dashboard Again
              </button>
            </div>
          </div>

          {/* Backend Check Instructions */}
          <div className="mb-8 p-4 bg-orange-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-orange-800">Backend Check Instructions</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>1. Check if backend is running:</strong>
              </p>
              <code className="bg-gray-100 p-1 rounded">http://localhost:5000/api/applications/me</code>

              <p className="mt-4">
                <strong>2. Check server console for errors</strong>
              </p>

              <p className="mt-4">
                <strong>3. Verify route exists in applicationRoutes.js:</strong>
              </p>
              <code className="bg-gray-100 p-1 rounded">
                router.get("/me", [protect, authorize("job_seeker")], ...)
              </code>

              <p className="mt-4">
                <strong>4. Check server.js has:</strong>
              </p>
              <code className="bg-gray-100 p-1 rounded">app.use("/api/applications", applicationRoutes)</code>
            </div>
          </div>

          {/* Raw Debug Data */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Raw Debug Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(
                {
                  user,
                  isAuthenticated,
                  tokenExists: !!token,
                  debugInfo,
                  apiUrl: API_URL,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugDashboard
