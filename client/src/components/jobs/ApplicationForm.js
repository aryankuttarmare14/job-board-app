"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { applicationsApi } from "../../services/api"

const ApplicationForm = ({ jobId }) => {
  const [coverLetter, setCoverLetter] = useState("")
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resume) {
      setError("Please upload your resume")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("resume", resume)

      if (coverLetter.trim()) {
        formData.append("coverLetter", coverLetter)
      }

      await applicationsApi.applyForJob(jobId, formData)

      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline"> Your application has been submitted successfully.</span>
        <p className="mt-2">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Resume (PDF only) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">Please upload your resume in PDF format (max 5MB)</p>
        </div>

        <div className="mb-4">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter (optional)
          </label>
          <textarea
            id="coverLetter"
            rows="5"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're a good fit for this position..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
