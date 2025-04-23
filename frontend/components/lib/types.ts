export interface User {
  _id: string
  name: string
  email: string
  role: "jobseeker" | "employer"
}

export interface JobListing {
  _id: string
  title: string
  company: string
  location: string
  type: string
  description: string
  requirements: string[]
  responsibilities: string[]
  deadline: string
  createdAt: string
  updatedAt: string
  applications: number
}

export interface JobApplication {
  _id: string
  job: JobListing
  coverLetter: string
  resumeUrl: string
  status: "pending" | "accepted" | "rejected"
  feedback?: string
  createdAt: string
  updatedAt: string
}
