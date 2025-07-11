"\"use client"

import { useAuth } from "../../context/AuthContext"

const AuthDebug = () => {
  const { user, token, loading, error, isAuthenticated, isEmployer, isJobSeeker, isAdmin } = useAuth()

  return (
    <div className="bg-gray-800 text-white p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Auth Debug</h3>
      <p>
        <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
      </p>
      <p>
        <strong>User:</strong> {user ? JSON.stringify(user) : "No user data"}
      </p>
      <p>
        <strong>Token:</strong> {token ? token.substring(0, 20) + "..." : "No token"}
      </p>
      <p>
        <strong>Loading:</strong> {loading ? "Yes" : "No"}
      </p>
      <p>
        <strong>Error:</strong> {error || "No error"}
      </p>
      <p>
        <strong>Is Employer:</strong> {isEmployer ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Job Seeker:</strong> {isJobSeeker ? "Yes" : "No"}
      </p>
      <p>
        <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
      </p>
    </div>
  )
}

export default AuthDebug
