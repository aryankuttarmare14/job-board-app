"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { jobsApi } from "../../services/api"

const EditJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    salary: "",
    requirements: "",
    deadline: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJob(id)
        const job = res.data.data

        // Format date for input field (YYYY-MM-DD)
        const deadline = new Date(job.deadline).toISOString().split("T")[0]

        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salary: job.salary || "",
          requirements: job.requirements || "",
          deadline,
        })
      } catch (err) {
        setError("Failed to fetch job details. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const validateForm = () => {
    const errors = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!formData.title.trim()) {
      errors.title = "Job title is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required"
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }

    if (!formData.deadline) {
      errors.deadline = "Application deadline is required"
    } else {
      const deadlineDate = new Date(formData.deadline)
      if (deadlineDate < today) {
        errors.deadline = "Deadline cannot be in the past"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setSubmitting(true)
      setError("")

      try {
        await jobsApi.updateJob(id, formData)
        navigate(`/jobs/${id}`)
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.errors?.[0]?.msg ||
            "Failed to update job. Please try again.",
        )
        setSubmitting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Job</h1>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-input ${formErrors.title ? "border-red-500" : ""}`}
              placeholder="e.g. Frontend Developer"
            />
            {formErrors.title && <p className="form-error">{formErrors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className={`form-input ${formErrors.description ? "border-red-500" : ""}`}
              placeholder="Provide a detailed description of the job..."
            ></textarea>
            {formErrors.description && <p className="form-error">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="location" className="form-label">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${formErrors.location ? "border-red-500" : ""}`}
                placeholder="e.g. New York, NY or Remote"
              />
              {formErrors.location && <p className="form-error">{formErrors.location}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="form-label">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="form-input">
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="remote">Remote</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="salary" className="form-label">
                Salary (optional)
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. $60,000 - $80,000 or Competitive"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deadline" className="form-label">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`form-input ${formErrors.deadline ? "border-red-500" : ""}`}
              />
              {formErrors.deadline && <p className="form-error">{formErrors.deadline}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="requirements" className="form-label">
              Requirements (optional)
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows="4"
              value={formData.requirements}
              onChange={handleChange}
              className="form-input"
              placeholder="List the requirements for this position..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/jobs/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditJob
