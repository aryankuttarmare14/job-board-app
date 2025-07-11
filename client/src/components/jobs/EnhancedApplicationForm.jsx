"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { applicationsApi } from "../../services/api"

const EnhancedApplicationForm = ({ jobId, jobTitle, companyName }) => {
  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [animation, setAnimation] = useState("")

  // Progress calculation
  const totalSteps = 4
  const progress = Math.round((currentStep / totalSteps) * 100)

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
      if (!formData.availability) newErrors.availability = "Please indicate your availability"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setAnimation("slide-out-left")
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setAnimation("slide-in-right")
      }, 300)
    }
  }

  const handlePrevStep = () => {
    setAnimation("slide-out-right")
    setTimeout(() => {
      setCurrentStep(currentStep - 1)
      setAnimation("slide-in-left")
    }, 300)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, resume: file })

      // Clear resume error if it exists
      if (errors.resume) {
        setErrors({ ...errors, resume: "" })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      setLoading(true)

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

        await applicationsApi.applyForJob(jobId, formDataToSend)

        setSuccess(true)
        setTimeout(() => {
          navigate("/dashboard")
        }, 3000)
      } catch (err) {
        setErrors({
          submit: err.response?.data?.error || "Failed to submit application. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // Reset animation after it completes
    const timer = setTimeout(() => {
      if (animation) setAnimation("")
    }, 500)

    return () => clearTimeout(timer)
  }, [animation])

  if (success) {
    return (
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-lg shadow-xl p-8 text-center border border-green-700 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-500 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-xl text-green-100 mb-6">
          Your application for <span className="font-semibold">{jobTitle}</span> at{" "}
          <span className="font-semibold">{companyName}</span> has been successfully submitted.
        </p>
        <p className="text-green-200 mb-8">
          We've sent a confirmation email with details about your application. The hiring team will review your
          application and get back to you soon.
        </p>
        <div className="animate-pulse text-green-300 mb-2">Redirecting to your dashboard...</div>
        <div className="w-full bg-green-700 rounded-full h-2 mb-6">
          <div className="bg-green-300 h-2 rounded-full animate-[grow_3s_ease-in-out]" style={{ width: "100%" }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden max-w-2xl mx-auto">
      {/* Header with progress bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Apply for: {jobTitle}</h2>
        <p className="text-blue-200 mb-4">{companyName}</p>

        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
          <div
            className="bg-blue-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-blue-300">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{progress}% Complete</span>
        </div>
      </div>

      {/* Form steps */}
      <div className="p-6">
        {errors.submit && (
          <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded-md mb-4" role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          <div className={`transition-all duration-300 ${animation} ${currentStep === 1 ? "block" : "hidden"}`}>
            <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(123) 456-7890"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Step 2: Resume & Cover Letter */}
          <div className={`transition-all duration-300 ${animation} ${currentStep === 2 ? "block" : "hidden"}`}>
            <h3 className="text-xl font-semibold text-white mb-4">Resume & Cover Letter</h3>

            <div className="mb-4">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-300 mb-1">
                Resume (PDF only) <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center hover:border-blue-500 transition-colors">
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
                    className="mx-auto h-12 w-12 text-gray-400"
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
                  <span className="mt-2 block text-sm font-medium text-gray-300">
                    {formData.resume ? formData.resume.name : "Click to upload your resume"}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">PDF up to 5MB</span>
                </label>
              </div>
              {errors.resume && <p className="mt-1 text-sm text-red-500">{errors.resume}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-300 mb-1">
                Cover Letter (optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us why you're a good fit for this position..."
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Step 3: Professional Information */}
          <div className={`transition-all duration-300 ${animation} ${currentStep === 3 ? "block" : "hidden"}`}>
            <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>

            <div className="mb-4">
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                LinkedIn Profile (optional)
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-1">
                Portfolio/Website (optional)
              </label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
                <option value="executive">Executive Level</option>
              </select>
              {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Step 4: Final Questions */}
          <div className={`transition-all duration-300 ${animation} ${currentStep === 4 ? "block" : "hidden"}`}>
            <h3 className="text-xl font-semibold text-white mb-4">Final Questions</h3>

            <div className="mb-4">
              <label htmlFor="heardFrom" className="block text-sm font-medium text-gray-300 mb-1">
                How did you hear about this position?
              </label>
              <select
                id="heardFrom"
                name="heardFrom"
                value={formData.heardFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an option</option>
                <option value="jobBoard">Job Board</option>
                <option value="companyWebsite">Company Website</option>
                <option value="socialMedia">Social Media</option>
                <option value="referral">Employee Referral</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-1">
                When can you start? <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your availability</option>
                <option value="immediately">Immediately</option>
                <option value="twoWeeks">2 Weeks Notice</option>
                <option value="oneMonth">1 Month Notice</option>
                <option value="other">Other (Specify in Cover Letter)</option>
              </select>
              {errors.availability && <p className="mt-1 text-sm text-red-500">{errors.availability}</p>}
            </div>

            <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-md border border-blue-800">
              <h4 className="text-blue-300 font-medium mb-2">Before You Submit</h4>
              <p className="text-gray-300 text-sm">
                By submitting this application, you confirm that all information provided is accurate and complete.
                We'll use this information to evaluate your candidacy for this position.
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
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
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnhancedApplicationForm
