"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"

const CompanyDetails = () => {
  const { name } = useParams()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // In a real app, you'd have a dedicated API endpoint for company details
        // For now, we'll extract company info from jobs
        const res = await axios.get(`${API_URL}/api/jobs`)

        const jobsData = res.data.data
        const companyJobs = jobsData.filter((job) => job.company === name)

        if (companyJobs.length === 0) {
          setError("Company not found")
          return
        }

        setJobs(companyJobs)

        // Create mock company data
        setCompany({
          name,
          location: companyJobs[0].location,
          industry: getRandomIndustry(),
          founded: 2000 + Math.floor(Math.random() * 20), // Random year between 2000-2020
          employees: getRandomEmployeeCount(),
          website: `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
          description: `${name} is a leading company in the ${getRandomIndustry()} industry, focused on delivering innovative solutions to clients worldwide. With a team of talented professionals, we strive to create exceptional products and services that make a difference.`,
        })
      } catch (err) {
        setError("Failed to fetch company details. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [name])

  // Helper functions for mock data
  const getRandomIndustry = () => {
    const industries = [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Manufacturing",
      "Retail",
      "Media",
      "Consulting",
    ]
    return industries[Math.floor(Math.random() * industries.length)]
  }

  const getRandomEmployeeCount = () => {
    const counts = ["1-50", "51-200", "201-500", "501-1000", "1000+"]
    return counts[Math.floor(Math.random() * counts.length)]
  }

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4">
          <Link to="/companies" className="text-blue-400 hover:text-blue-300">
            Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-700">
          <h3 className="text-xl font-semibold mb-2 text-white">Company not found</h3>
          <p className="text-gray-400 mb-4">The company you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/companies"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Companies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/companies" className="text-blue-400 hover:text-blue-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Companies
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 mb-8">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mr-4">
              <span className="text-3xl font-bold text-white">{company.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{company.name}</h1>
              <p className="text-blue-400">{company.industry}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">About {company.name}</h2>
              <p className="text-gray-300">{company.description}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-white">Company Information</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">Industry:</span>
                  <span className="text-gray-300">{company.industry}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">Location:</span>
                  <span className="text-gray-300">{company.location}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">Founded:</span>
                  <span className="text-gray-300">{company.founded}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">Employees:</span>
                  <span className="text-gray-300">{company.employees}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {company.website}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Open Positions at {company.name}</h2>

        {jobs.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
            <p className="text-gray-400">No open positions at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-blue-400 mb-2">{job.company}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                  <div className="flex items-center text-gray-400 text-sm mt-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
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

                  <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyDetails
