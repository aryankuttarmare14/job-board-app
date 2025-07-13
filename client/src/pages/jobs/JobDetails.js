"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { jobsApi } from "../../services/api"
import { useAuth } from "../../context/AuthContext"

const JobDetails = () => {
  const { id } = useParams()
  const { isAuthenticated, isJobSeeker, isEmployer, user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJob(id)
        setJob(res.data.data)
      } catch (err) {
        setError("Failed to fetch job details. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.deleteJob(id)
        navigate("/dashboard")
      } catch (err) {
        setError("Failed to delete job. Please try again.")
        console.error(err)
      }
    }
  }

  const handleApply = () => {
    console.log("Apply button clicked")
    console.log("User authenticated:", isAuthenticated)
    console.log("User is job seeker:", isJobSeeker)
    console.log("Job ID:", id)

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login")
      navigate("/login")
      return
    }

    if (!isJobSeeker) {
      console.log("User is not a job seeker")
      alert("Only job seekers can apply for jobs.")
      return
    }

    console.log("Navigating to apply page:", `/jobs/${id}/apply`)
    navigate(`/jobs/${id}/apply`)
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8 sm:my-12">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded relative text-sm sm:text-base"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Job not found</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Browse Jobs
          </Link>
        </div>
      </div>
    )
  }

  const isJobOwner = isEmployer && user?.id === (typeof job.user === "object" ? job.user._id : job.user)
  const isDeadlinePassed = new Date(job.deadline) < new Date()

  // Parse requirements into an array for bullet points
  const requirementsList = job.requirements ? job.requirements.split("\n").filter((req) => req.trim()) : []

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link to="/jobs" className="text-blue-400 hover:text-blue-300 flex items-center text-sm sm:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
          <div className="flex items-center text-blue-400 mb-4 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {job.company}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
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
              {job.location}
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {job.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Deadline: {format(new Date(job.deadline), "MMM dd, yyyy")}
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Job Description</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {requirementsList.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Requirements</h2>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {requirementsList.map((req, index) => (
                  <li key={index}>{req.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white">Responsibilities</h2>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <li>Develop new user-facing features</li>
              <li>Build reusable components and libraries for future use</li>
              <li>Optimize applications for maximum speed and scalability</li>
              <li>Collaborate with other team members and stakeholders</li>
            </ul>
          </div>

          {/* Debug info */}
          <div className="mb-4 p-3 sm:p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-600">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Debug Info:</h3>
            <p className="text-xs text-gray-400">Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
            <p className="text-xs text-gray-400">Is Job Seeker: {isJobSeeker ? "Yes" : "No"}</p>
            <p className="text-xs text-gray-400">Is Employer: {isEmployer ? "Yes" : "No"}</p>
            <p className="text-xs text-gray-400">User ID: {user?.id || "None"}</p>
            <p className="text-xs text-gray-400">
              Job Owner ID: {typeof job.user === "object" ? job.user._id : job.user}
            </p>
            <p className="text-xs text-gray-400">Is Job Owner: {isJobOwner ? "Yes" : "No"}</p>
            <p className="text-xs text-gray-400">Deadline Passed: {isDeadlinePassed ? "Yes" : "No"}</p>
          </div>

          {isJobOwner && (
            <div className="flex flex-col sm:flex-row mt-6 space-y-2 sm:space-y-0 sm:space-x-3">
              <Link
                to={`/jobs/edit/${job._id}`}
                className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-xs sm:text-sm text-center"
              >
                Edit Job
              </Link>
              <Link
                to={`/jobs/${job._id}/applications`}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm text-center"
              >
                View Applications
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm"
              >
                Delete Job
              </button>
            </div>
          )}

          {/* Apply button section */}
          <div className="mt-6 sm:mt-8">
            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Log in to apply
              </button>
            ) : isJobSeeker && !isDeadlinePassed ? (
              <button
                onClick={handleApply}
                className="w-full py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Apply Now
              </button>
            ) : isDeadlinePassed ? (
              <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900 rounded-lg border border-red-400 dark:border-red-800">
                <p className="text-red-700 dark:text-red-200 text-sm sm:text-base">The application deadline for this job has passed.</p>
              </div>
            ) : !isJobSeeker ? (
              <div className="p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-400 dark:border-yellow-800">
                <p className="text-yellow-700 dark:text-yellow-200 text-sm sm:text-base">Only job seekers can apply for jobs.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
