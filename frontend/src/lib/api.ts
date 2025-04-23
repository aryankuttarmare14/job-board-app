import type { JobApplication, JobListing, User } from "./types"

// API base URL - use environment variable or default to localhost in development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function for API requests
const apiRequest = async (endpoint: string, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  // Get token from localStorage if available
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data
}

// Auth API functions
export async function registerUser(userData: any): Promise<User> {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
  return response.user
}

export async function loginUser(credentials: { email: string; password: string }): Promise<{
  user: User
  token: string
}> {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })

  // Store token in localStorage
  if (response.token) {
    localStorage.setItem("token", response.token)
  }

  return response
}

// Job API functions
export async function fetchFeaturedJobs(): Promise<JobListing[]> {
  const response = await apiRequest("/jobs/featured")
  return response.data
}

export async function fetchJobs(filters: any): Promise<JobListing[]> {
  // Convert filters to query string
  const queryParams = new URLSearchParams()

  if (filters.query) queryParams.append("q", filters.query)
  if (filters.location) queryParams.append("location", filters.location)
  if (filters.type && filters.type !== "any") queryParams.append("type", filters.type)
  if (filters.sort) queryParams.append("sort", filters.sort)

  const response = await apiRequest(`/jobs?${queryParams.toString()}`)
  return response.data
}

export async function fetchJobById(id: string): Promise<JobListing | null> {
  const response = await apiRequest(`/jobs/${id}`)
  return response.data
}

// Application API functions
export async function applyToJob(jobId: string, applicationData: any): Promise<JobApplication> {
  // For file uploads, we need to use FormData
  const formData = new FormData()
  formData.append("jobId", jobId)
  formData.append("coverLetter", applicationData.coverLetter)

  if (applicationData.resume) {
    formData.append("resume", applicationData.resume)
  }

  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data.data
}

export async function fetchJobSeekerApplications(): Promise<JobApplication[]> {
  const response = await apiRequest("/applications/me")
  return response.data
}

export async function fetchEmployerJobs(): Promise<JobListing[]> {
  const response = await apiRequest("/jobs/employer/me")
  return response.data
}

// Add the rest of your API functions here...
// ...

// Admin API functions
export async function fetchAdminStats() {
  const response = await apiRequest("/admin/stats")
  return response.data
}

export async function fetchAllUsers() {
  const response = await apiRequest("/admin/users")
  return response.data
}

export async function fetchAllJobs() {
  const response = await apiRequest("/admin/jobs")
  return response.data
}
