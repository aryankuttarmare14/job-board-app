"use client"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const RoleRoute = ({ role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Allow admin access to all role-specific routes
  if (user.isAdmin) {
    return <Outlet />
  }

  return user.role === role ? <Outlet /> : <Navigate to="/" />
}

export default RoleRoute
