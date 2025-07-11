"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { jobsApi, applicationsApi } from "../../services/api"

const ApplyJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    resume: null,
    experience: "",
    heardFrom: "",
    availability: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Progress calculation
  const totalSteps = 4
  const progress = Math.round((currentStep / totalSteps) * 100)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log("Fetching job with ID:", id)
        const res = await jobsApi.getJob(id)
        console.log("Job data received:", res.data)

        // Process job to ensure user property is properly handled
        const processedJob = {
          ...res.data.data,
          // Convert user object to ID string if it's an object
          user: typeof res.data.data.user === "object" ? res.data.data.user._id : res.data.data.user,
        }

        setJob(processedJob)
      } catch (err) {
        console.error("Error fetching job:", err)
        setError("Failed to fetch job details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    } else if (step === 2) {
      if (!formData.resume) newErrors.resume = "Resume is required"
      else if (formData.resume.type !== "application/pdf") {
        newErrors.resume = "Only PDF files are allowed"
      } else if (formData.resume.size > 5000000) {
        newErrors.resume = "File size should not exceed 5MB"
      }
    } else if (step === 3) {
      if (!formData.experience) newErrors.experience = "Please select your experience level"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    console.log("Next button clicked, current step:", currentStep)
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, resume: file })

      // Clear resume error if it exists
      if (formErrors.resume) {
        setFormErrors({ ...formErrors, resume: "" })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      setSubmitting(true)

      try {
        const formDataToSend = new FormData()

        // Add resume file
        formDataToSend.append("resume", formData.resume)

        // Add cover letter if provided
        if (formData.coverLetter.trim()) {
          formDataToSend.append("coverLetter", formData.coverLetter)
        }

        // Add additional fields as JSON
        const additionalFields = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
          experience: formData.experience,
          heardFrom: formData.heardFrom,
          availability: formData.availability,
        }

        formDataToSend.append("additionalInfo", JSON.stringify(additionalFields))

        await applicationsApi.applyForJob(id, formDataToSend)

        setSuccess(true)
        setTimeout(() => {
          navigate("/dashboard")
        }, 3000)
      } catch (err) {
        setFormErrors({
          submit: err.response?.data?.error || "Failed to submit application. Please try again.",
        })
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-medium text-blue-500">Loading</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4">
          <Link to="/jobs" className="text-blue-400 hover:text-blue-300">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Job not found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Browse Jobs
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Application Submitted!</h3>
          <p className="text-sm sm:text-base">Your application for "{job.title}" has been successfully submitted.</p>
          <p className="mt-2 text-sm sm:text-base">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link to={`/jobs/${id}`} className="text-blue-400 hover:text-blue-300 flex items-center text-sm sm:text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Job Details
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl mx-auto">
        {/* Header with progress bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Apply for: {job.title}</h2>
          <p className="text-blue-200 mb-4 text-sm sm:text-base">{job.company}</p>

          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-2.5 mb-1">
            <div
              className="bg-blue-400 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-blue-300">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{progress}% Complete</span>
          </div>
        </div>

        {/* Form steps */}
        <div className="p-4 sm:p-6">
          {formErrors.submit && (
            <div
              className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md mb-4"
              role="alert"
            >
              <span className="block sm:inline text-sm sm:text-base">{formErrors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="john.doe@example.com"
                    />
                    {formErrors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="(123) 456-7890"
                    />
                    {formErrors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Resume & Cover Letter */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Resume & Cover Letter
                </h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Resume (PDF only) <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 sm:p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
                          {formData.resume ? formData.resume.name : "Click to upload your resume"}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">PDF up to 5MB</span>
                      </label>
                    </div>
                    {formErrors.resume && <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.resume}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Cover Letter (optional)
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us why you're a good fit for this position..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base order-1 sm:order-2"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Professional Information */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Professional Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      LinkedIn Profile (optional)
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="portfolio"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Portfolio/Website (optional)
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select your experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (5+ years)</option>
                      <option value="executive">Executive Level</option>
                    </select>
                    {formErrors.experience && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{formErrors.experience}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base order-1 sm:order-2"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Final Questions */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Final Questions</h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="heardFrom"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      How did you hear about this position?
                    </label>
                    <select
                      id="heardFrom"
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select an option</option>
                      <option value="jobBoard">Job Board</option>
                      <option value="companyWebsite">Company Website</option>
                      <option value="socialMedia">Social Media</option>
                      <option value="referral">Employee Referral</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
                    >
                      When can you start?
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select your availability</option>
                      <option value="immediately">Immediately</option>
                      <option value="twoWeeks">2 Weeks Notice</option>
                      <option value="oneMonth">1 Month Notice</option>
                      <option value="other">Other (Specify in Cover Letter)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 bg-opacity-30 rounded-md border border-blue-200 dark:border-blue-800">
                  <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-2 text-sm sm:text-base">
                    Before You Submit
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    By submitting this application, you confirm that all information provided is accurate and complete.
                    We'll use this information to evaluate your candidacy for this position.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base order-1 sm:order-2"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Sending...</span>
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplyJob
