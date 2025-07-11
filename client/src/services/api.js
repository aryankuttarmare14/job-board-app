import axios from "axios"
import { API_URL } from "../config"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Jobs API
export const jobsApi = {
  // Get all jobs with optional filters
  getJobs: (params) => api.get("/api/jobs", { params }),

  // Get single job
  getJob: (id) => api.get(`/api/jobs/${id}`),

  // Create job (employers only)
  createJob: (jobData) => api.post("/api/jobs", jobData),

  // Update job (employers only)
  updateJob: (id, jobData) => api.put(`/api/jobs/${id}`, jobData),

  // Delete job (employers only)
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),

  // Get employer's jobs
  getEmployerJobs: () => api.get("/api/jobs/employer/myjobs"),
}

// Applications API
export const applicationsApi = {
  // Apply for a job (job seekers only)
  applyForJob: (jobId, formData) => {
    console.log("API call: Applying for job", jobId, "with form data:", formData)
    return api.post(`/api/applications/${jobId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Get applications for a job (employers only)
  getJobApplications: (jobId) => api.get(`/api/applications/jobs/${jobId}`),

  // Get user's applications (job seekers only)
  getUserApplications: () => api.get("/api/applications/me"),

  // Update application status (employers only)
  updateApplicationStatus: (id, status) => api.put(`/api/applications/${id}`, { status }),
}

// Admin API
export const adminApi = {
  // Get admin dashboard stats
  getStats: () => api.get("/api/admin/stats"),

  // Get all users
  getUsers: () => api.get("/api/admin/users"),

  // Update user role or admin status
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),

  // Delete user
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Get all jobs
  getJobs: () => api.get("/api/admin/jobs"),

  // Delete job
  deleteJob: (id) => api.delete(`/api/admin/jobs/${id}`),

  // Get all applications
  getApplications: () => api.get("/api/admin/applications"),
}

export default api
