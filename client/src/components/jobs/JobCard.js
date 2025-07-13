import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"

const JobCard = ({ job }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            <Link to={`/jobs/${job._id}`} className="hover:text-blue-400 line-clamp-2">
              {job.title}
            </Link>
          </h3>
          <p className="text-blue-400 text-sm sm:text-base">{job.company}</p>
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 self-start ${
            job.type === "full-time"
              ? "bg-blue-900 text-blue-200"
              : job.type === "part-time"
                ? "bg-purple-900 text-purple-200"
                : job.type === "remote"
                  ? "bg-green-900 text-green-200"
                  : job.type === "contract"
                    ? "bg-yellow-900 text-yellow-200"
                    : "bg-gray-700 text-gray-300"
          }`}
        >
          {job.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>

        {job.salary && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="truncate">{job.salary}</span>
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
          {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
        </p>
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default JobCard
