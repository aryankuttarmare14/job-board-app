"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { adminApi } from "../../services/api"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats()
        setStats(res.data.data)
      } catch (err) {
        setError("Failed to fetch dashboard stats. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center my-8 sm:my-12">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Admin Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">👑 Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-blue-100">Welcome, Administrator! You have full control over the job board system.</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="bg-white/10 rounded p-3">
            <div className="font-semibold">🔧 System Control</div>
            <div className="text-blue-100">Manage all users and permissions</div>
          </div>
          <div className="bg-white/10 rounded p-3">
            <div className="font-semibold">💼 Job Management</div>
            <div className="text-blue-100">Oversee all job postings</div>
          </div>
          <div className="bg-white/10 rounded p-3">
            <div className="font-semibold">📊 Analytics</div>
            <div className="text-blue-100">Monitor platform performance</div>
          </div>
        </div>
      </div>

      {/* Rest of the existing dashboard content */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">System Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Total Users</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.userCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Employers</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.employerCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Job Seekers</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.jobSeekerCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Total Jobs</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.jobCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Applications</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.applicationCount}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link
          to="/admin/users"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Users</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">View, edit, and delete user accounts</p>
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Jobs</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">View, edit, and delete job listings</p>
        </Link>

        <Link
          to="/admin/applications"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-700 transition-colors"
        >
          <h2 className="text-sm sm:text-base lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Manage Applications</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">View and manage job applications</p>
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Recent Jobs</h2>
          <Link to="/admin/jobs" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Posted
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentJobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">{job.company}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.type === "full-time"
                          ? "bg-blue-900 text-blue-200"
                          : job.type === "part-time"
                            ? "bg-purple-900 text-purple-200"
                            : job.type === "remote"
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {job.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                      {new Date(job.postedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <Link to={`/jobs/${job._id}`} className="text-blue-400 hover:text-blue-300 mr-3">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
          <Link to="/admin/applications" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Job
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentApplications.map((application) => (
                <tr key={application._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{application.user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{application.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{application.job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{application.job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.status === "pending"
                          ? "bg-yellow-900 text-yellow-200"
                          : application.status === "reviewed"
                            ? "bg-blue-900 text-blue-200"
                            : application.status === "rejected"
                              ? "bg-red-900 text-red-200"
                              : application.status === "accepted"
                                ? "bg-green-900 text-green-200"
                                : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
