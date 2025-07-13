"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { jobsApi } from "../../services/api"

const JobListings = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    sort: "newest",
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  })

  const fetchJobs = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const res = await jobsApi.getJobs({
        ...filters,
        page,
        limit: 10,
      })

      // Process jobs to ensure user property is properly handled
      const processedJobs = res.data.data.map((job) => ({
        ...job,
        // Convert user object to ID string if it's an object
        user: typeof job.user === "object" ? job.user._id : job.user,
      }))

      setJobs(processedJobs)
      setPagination({
        current: res.data.pagination.current,
        pages: res.data.pagination.pages,
        total: res.data.total,
      })
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(1) // Reset to first page when filters change
    setShowFilters(false) // Hide filters on mobile after search
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePageChange = (page) => {
    fetchJobs(page)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Find Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover thousands of opportunities from top companies around the world
        </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white"
          >
            <span>Filters</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6 lg:mb-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleInputChange}
                  placeholder="Job title or keyword"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Any location"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">Any type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  value={filters.sort}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="deadline">Application Deadline</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {error && (
            <div
              className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">No jobs found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Try adjusting your search filters to find more results.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
                Found {pagination.total} job{pagination.total !== 1 ? "s" : ""}
              </p>

              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {job.title}
                          </h2>
                          <p className="text-blue-400 mb-2 text-sm sm:text-base">{job.company}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-semibold flex-shrink-0 self-start shadow-sm ${
                            job.type === "full-time"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              : job.type === "part-time"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : job.type === "remote"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  : job.type === "contract"
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                          }`}
                        >
                          {job.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{job.location}</span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                        {job.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0 sm:space-x-4 sm:flex">
                          <span className="block sm:inline">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                          <span className="block sm:inline">
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold text-center flex-shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-6 sm:mt-8">
                  <nav className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="px-2 sm:px-3 py-2 rounded-l-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-2 sm:px-3 py-2 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-medium transition-colors ${
                          pagination.current === i + 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.pages}
                      className="px-2 sm:px-3 py-2 rounded-r-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobListings
