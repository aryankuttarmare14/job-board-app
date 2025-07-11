"use client"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth()

  console.log("AdminRoute check:", { user, isAdmin })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    console.log("AdminRoute: No user, redirecting to login")
    return <Navigate to="/login" />
  }

  if (!isAdmin) {
    console.log("AdminRoute: User is not admin, redirecting to home")
    return <Navigate to="/" />
  }

  console.log("AdminRoute: User is admin, allowing access")
  return <Outlet />
}

export default AdminRoute
