"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

// Pages
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import JobListings from "./pages/jobs/JobListings"
import JobDetails from "./pages/jobs/JobDetails"
import CreateJob from "./pages/jobs/CreateJob"
import EditJob from "./pages/jobs/EditJob"
import SeekerDashboard from "./pages/dashboard/SeekerDashboard"
import EmployerDashboard from "./pages/dashboard/EmployerDashboard"
import JobApplications from "./pages/jobs/JobApplications"
import Companies from "./pages/companies/Companies"
import CompanyDetails from "./pages/companies/CompanyDetails"
import NotFound from "./pages/NotFound"
import ApplyJob from "./pages/jobs/ApplyJob"
import DebugDashboard from "./pages/DebugDashboard"

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import UserManagement from "./pages/admin/UserManagement"
import JobManagement from "./pages/admin/JobManagement"
import ApplicationManagement from "./pages/admin/ApplicationManagement"

function App() {
  const { loading, isAdmin, isAuthenticated, isJobSeeker, isEmployer, user } = useAuth()

  console.log("App.js - Auth State:", {
    loading,
    isAuthenticated,
    isJobSeeker,
    isEmployer,
    isAdmin,
    userRole: user?.role,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:name" element={<CompanyDetails />} />

          {/* DEBUG ROUTE */}
          <Route path="/debug" element={<DebugDashboard />} />

          {/* Job application route */}
          <Route
            path="/jobs/:id/apply"
            element={isAuthenticated && isJobSeeker ? <ApplyJob /> : !isAuthenticated ? <Login /> : <NotFound />}
          />

          {/* DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                user?.role === "admin" ? (
                  <AdminDashboard />
                ) : user?.role === "employer" ? (
                  <EmployerDashboard />
                ) : user?.role === "job_seeker" ? (
                  <SeekerDashboard />
                ) : (
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      <h2 className="font-bold">Dashboard Access Issue</h2>
                      <p>User role: {user?.role}</p>
                      <p>Is Admin: {user?.isAdmin}</p>
                      <p>Expected: job_seeker, employer, or admin</p>
                    </div>
                  </div>
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              isAuthenticated && (user?.role === "admin" || user?.isAdmin) ? (
                <AdminDashboard />
              ) : isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Protected Routes */}
          {isAuthenticated && user?.role === "employer" && (
            <>
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/jobs/edit/:id" element={<EditJob />} />
              <Route path="/jobs/:id/applications" element={<JobApplications />} />
            </>
          )}

          {isAuthenticated && (user?.role === "admin" || user?.isAdmin) && (
            <>
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/jobs" element={<JobManagement />} />
              <Route path="/admin/applications" element={<ApplicationManagement />} />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
