"use client"

import React from "react"

const EmployerDashboard = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">🏢 Welcome, Employer!</h1>
        <p className="text-sm sm:text-base text-yellow-100">Post jobs, manage your listings, and review applications from top talent.</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Your Dashboard</h2>
        <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <li>Create and manage job postings</li>
          <li>View and review job applications</li>
          <li>Update your company profile</li>
        </ul>
      </div>
    </div>
  )
}

export default EmployerDashboard
