"use client"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth()

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

  return isAdmin ? <Outlet /> : <Navigate to="/" />
}

export default AdminRoute
