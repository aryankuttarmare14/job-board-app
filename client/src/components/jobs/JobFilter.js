"use client"

import { useState } from "react"

const JobFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    sort: "newest",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      sort: "newest",
    })
    onFilter({
      search: "",
      location: "",
      type: "",
      sort: "newest",
    })
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Filter Jobs</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Job title or keyword"
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="City or remote"
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Job Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="deadline">Application Deadline</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobFilter
