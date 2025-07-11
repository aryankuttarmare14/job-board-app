"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"

const Navbar = () => {
  const { isAuthenticated, isEmployer, isJobSeeker, isAdmin, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleDashboardClick = (e) => {
    e.preventDefault()
    console.log("Dashboard clicked! Navigating to /dashboard")
    console.log("Current auth state:", { isAuthenticated, isJobSeeker, isEmployer, isAdmin })

    // Force navigation
    window.location.href = "/dashboard"
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <nav className="shadow-md border-b transition-colors duration-300 dark:bg-gray-900 dark:border-gray-800 bg-white border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-2xl font-bold dark:text-white text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
                JobBoard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/jobs"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive("/jobs")
                    ? "border-blue-500 dark:text-white text-gray-900"
                    : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900"
                } text-sm font-medium`}
              >
                Jobs
              </Link>
              <Link
                to="/companies"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive("/companies")
                    ? "border-blue-500 dark:text-white text-gray-900"
                    : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900"
                } text-sm font-medium`}
              >
                Companies
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive("/dashboard")
                      ? "border-blue-500 dark:text-white text-gray-900"
                      : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900"
                  } text-sm font-medium`}
                >
                  Dashboard
                </Link>
              )}
              {isEmployer && (
                <Link
                  to="/jobs/create"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive("/jobs/create")
                      ? "border-blue-500 dark:text-white text-gray-900"
                      : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900"
                  } text-sm font-medium`}
                >
                  Post Job
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive("/admin")
                      ? "border-blue-500 dark:text-white text-gray-900"
                      : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900"
                  } text-sm font-medium`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={toggleTheme}
              className="mr-4 p-2 rounded-md dark:text-gray-300 text-gray-600 dark:hover:text-white hover:text-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium dark:text-white text-gray-900 dark:bg-gray-800 bg-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium dark:text-white text-gray-900 dark:bg-gray-800 bg-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium dark:text-white text-gray-900 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden dark:bg-gray-900 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/jobs"
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                isActive("/jobs")
                  ? "dark:bg-gray-800 bg-gray-100 border-blue-500 dark:text-white text-gray-900"
                  : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
              } text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className={`block pl-3 pr-4 py-2 border-l-4 ${
                isActive("/companies")
                  ? "dark:bg-gray-800 bg-gray-100 border-blue-500 dark:text-white text-gray-900"
                  : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
              } text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  isActive("/dashboard")
                    ? "dark:bg-gray-800 bg-gray-100 border-blue-500 dark:text-white text-gray-900"
                    : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                } text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isEmployer && (
              <Link
                to="/jobs/create"
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  isActive("/jobs/create")
                    ? "dark:bg-gray-800 bg-gray-100 border-blue-500 dark:text-white text-gray-900"
                    : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                } text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Post Job
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`block pl-3 pr-4 py-2 border-l-4 ${
                  isActive("/admin")
                    ? "dark:bg-gray-800 bg-gray-100 border-blue-500 dark:text-white text-gray-900"
                    : "border-transparent dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                } text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t dark:border-gray-800 border-gray-200">
            <div className="mt-3 space-y-1">
              <button
                onClick={toggleTheme}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium dark:text-gray-300 text-gray-600 dark:hover:bg-gray-800 hover:bg-gray-200 dark:hover:border-gray-600 hover:border-gray-300 dark:hover:text-white hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
