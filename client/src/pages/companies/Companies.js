"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // In a real app, you'd have a dedicated API endpoint for companies
        // For now, we'll extract unique companies from jobs
        const res = await axios.get(`${API_URL}/api/jobs`)
        
        // Extract unique companies from jobs
        const jobsData = res.data.data
        const uniqueCompanies = Array.from(new Set(jobsData.map(job => job.company)))
          .map(company => {
            const companyJobs = jobsData.filter(job => job.company === company)
            return {
              name: company,
              jobCount: companyJobs.length,
              location: companyJobs[0].location,
              industry: getRandomIndustry(), // In a real app, this would come from the API
              logo: `/placeholder.svg?height=80&width=80&text=${company.charAt(0)}`,
            }
          })
        
        setCompanies(uniqueCompanies)
      } catch (err) {
        setError("Failed to fetch companies. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Helper function to get random industry for demo purposes
  const getRandomIndustry = () => {
    const industries = [
      "Technology", "Finance", "Healthcare", "Education", 
      "Manufacturing", "Retail", "Media", "Consulting"
    ]
    return industries[Math.floor(Math.random() * industries.length)]
  }

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white">Companies</h1>
      <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">Discover top companies hiring now</p>

      <div className="mb-6 sm:mb-8">
        <div className="max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm sm:text-base"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-800 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded relative mb-4 text-sm sm:text-base" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8 sm:my-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">No companies found</h3>
          <p className="text-sm sm:text-base text-gray-400">Try adjusting your search term to find more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCompanies.map((company, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <span className="text-lg sm:text-2xl font-bold text-white">{company.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white">{company.name}</h2>
                    <p className="text-sm sm:text-base text-blue-400">{company.industry}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm mb-2">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs sm:text-sm">
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {company.jobCount} open position{company.jobCount !== 1 ? "s" : ""}
                  </div>
                </div>
                
                <Link
                  to={`/companies/${company.name}`}
                  className="block w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center text-xs sm:text-sm"
                >
                  View Company
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Companies
