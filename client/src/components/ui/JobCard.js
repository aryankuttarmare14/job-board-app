import React from "react"
import { Link } from "react-router-dom"

const JobCard = ({ job }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "full-time":
        return "from-blue-500 to-blue-600"
      case "part-time":
        return "from-purple-500 to-purple-600"
      case "remote":
        return "from-green-500 to-green-600"
      case "contract":
        return "from-yellow-500 to-yellow-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2">
              {job.title}
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(job.type)} text-white shadow-sm`}>
            {job.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{job.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Posted {formatDate(job.postedAt)}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deadline {formatDate(job.deadline)}
            </div>
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard 