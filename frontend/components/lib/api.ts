import type { JobApplication, JobListing, User } from "./types"

// Mock data for development
const mockJobs: JobListing[] = [
  {
    _id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "New York, NY",
    type: "full-time",
    description:
      "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user interfaces for our web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong knowledge of JavaScript, HTML, and CSS",
      "Experience with state management libraries like Redux",
      "Experience with TypeScript",
    ],
    responsibilities: [
      "Develop new user-facing features",
      "Build reusable components and libraries for future use",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with other team members and stakeholders",
    ],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applications: 12,
  },
  {
    _id: "2",
    title: "Backend Developer",
    company: "DataSystems",
    location: "Remote",
    type: "full-time",
    description:
      "We are seeking a Backend Developer to design and implement server-side applications. You will work with databases, APIs, and server architecture.",
    requirements: [
      "3+ years of experience with Node.js",
      "Experience with MongoDB or other NoSQL databases",
      "Knowledge of RESTful API design",
      "Familiarity with cloud services (AWS, Azure, or GCP)",
    ],
    responsibilities: [
      "Design and implement server-side applications",
      "Create and maintain databases",
      "Develop and document APIs",
      "Ensure high performance and responsiveness of applications",
    ],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applications: 8,
  },
  {
    _id: "3",
    title: "UX/UI Designer",
    company: "CreativeMinds",
    location: "San Francisco, CA",
    type: "part-time",
    description:
      "We are looking for a UX/UI Designer to create engaging and effective user experiences for our digital products.",
    requirements: [
      "Portfolio demonstrating UX/UI design skills",
      "Experience with design tools like Figma or Sketch",
      "Understanding of user-centered design principles",
      "Ability to create wireframes, prototypes, and user flows",
    ],
    responsibilities: [
      "Create user-centered designs by understanding business requirements",
      "Develop wireframes, prototypes, and user flows",
      "Conduct user research and testing",
      "Collaborate with developers to implement designs",
    ],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    applications: 5,
  },
]

const mockApplications: JobApplication[] = [
  {
    _id: "1",
    job: mockJobs[0],
    coverLetter: "I am excited to apply for this position...",
    resumeUrl: "/uploads/resume1.pdf",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    job: mockJobs[1],
    coverLetter: "I believe my skills align perfectly with...",
    resumeUrl: "/uploads/resume2.pdf",
    status: "accepted",
    feedback: "We were impressed with your experience and would like to schedule an interview.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
  },
]

// API functions
export async function registerUser(userData: any): Promise<User> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })
    }, 1000)
  })
}

export async function loginUser(credentials: { email: string; password: string }): Promise<User> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation
      if (credentials.email && credentials.password) {
        resolve({
          _id: Math.random().toString(36).substr(2, 9),
          name: "Test User",
          email: credentials.email,
          role: credentials.email.includes("employer") ? "employer" : "jobseeker",
        })
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 1000)
  })
}

export async function fetchFeaturedJobs(): Promise<JobListing[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobs)
    }, 1000)
  })
}

export async function fetchJobs(filters: any): Promise<JobListing[]> {
  // Simulate API call with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredJobs = [...mockJobs]

      if (filters.query) {
        const query = filters.query.toLowerCase()
        filteredJobs = filteredJobs.filter(
          (job) => job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query),
        )
      }

      if (filters.location) {
        const location = filters.location.toLowerCase()
        filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location))
      }

      if (filters.type) {
        filteredJobs = filteredJobs.filter((job) => job.type === filters.type)
      }

      // Sort
      if (filters.sort === "newest") {
        filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (filters.sort === "oldest") {
        filteredJobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }

      resolve(filteredJobs)
    }, 1000)
  })
}

export async function fetchJobById(id: string): Promise<JobListing | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const job = mockJobs.find((job) => job._id === id)
      resolve(job || null)
    }, 1000)
  })
}

export async function applyToJob(jobId: string, applicationData: any): Promise<JobApplication> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const job = mockJobs.find((job) => job._id === jobId)
      if (!job) throw new Error("Job not found")

      const newApplication: JobApplication = {
        _id: Math.random().toString(36).substr(2, 9),
        job,
        coverLetter: applicationData.coverLetter,
        resumeUrl: "/uploads/resume.pdf", // In a real app, this would be the uploaded file URL
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      resolve(newApplication)
    }, 1500)
  })
}

export async function fetchJobSeekerApplications(): Promise<JobApplication[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApplications)
    }, 1000)
  })
}

export async function fetchEmployerJobs(): Promise<JobListing[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobs)
    }, 1000)
  })
}

export async function createJob(jobData: any): Promise<JobListing> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newJob: JobListing = {
        _id: Math.random().toString(36).substr(2, 9),
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        deadline: jobData.deadline,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applications: 0,
      }

      resolve(newJob)
    }, 1500)
  })
}

export async function deleteJob(jobId: string): Promise<void> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export async function fetchJobApplications(jobId: string): Promise<JobApplication[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock applications for the specific job
      const applications: JobApplication[] = [
        {
          _id: "app1",
          job: mockJobs.find((job) => job._id === jobId) || mockJobs[0],
          coverLetter:
            "I am excited to apply for this position. With my 6 years of experience in frontend development using React and TypeScript, I believe I would be a great fit for your team. I have worked on similar projects in the past and have a strong track record of delivering high-quality code on time.",
          resumeUrl: "/uploads/resume1.pdf",
          status: "pending",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "app2",
          job: mockJobs.find((job) => job._id === jobId) || mockJobs[0],
          coverLetter:
            "I would like to express my interest in the position. I have 4 years of experience in web development and have worked with various frontend frameworks including React. I am a quick learner and always eager to take on new challenges.",
          resumeUrl: "/uploads/resume2.pdf",
          status: "pending",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "app3",
          job: mockJobs.find((job) => job._id === jobId) || mockJobs[0],
          coverLetter:
            "I am writing to apply for the position advertised. I have a strong background in software development with a focus on frontend technologies. I am particularly interested in this role because it aligns with my career goals and I believe my skills would be valuable to your team.",
          resumeUrl: "/uploads/resume3.pdf",
          status: "accepted",
          feedback:
            "We were impressed with your experience and would like to schedule an interview. Please let us know your availability for next week.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
      ]

      resolve(applications)
    }, 1000)
  })
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
  feedback?: string,
): Promise<void> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}
