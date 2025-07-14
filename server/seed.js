import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"
import Job from "./models/Job.js"
import Application from "./models/Application.js"

// Load env vars
dotenv.config()

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is not set!")
  console.error("Please create a .env file with your MongoDB Atlas connection string")
  process.exit(1)
}

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Job.deleteMany({})
    await Application.deleteMany({})

    console.log("Cleared existing data...")

    // Create Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@jobboard.com",
      password: "admin123",
      role: "admin",
      isAdmin: true,
    })

    console.log("Admin user created:", adminUser.email)

    // Create Employer User
    const employerUser = await User.create({
      name: "John Employer",
      email: "employer@test.com",
      password: "password123",
      role: "employer",
      company: "TechCorp Inc",
    })

    console.log("Employer user created:", employerUser.email)

    // Create Job Seeker User
    const jobSeekerUser = await User.create({
      name: "Jane Seeker",
      email: "seeker@test.com",
      password: "password123",
      role: "job_seeker",
    })

    console.log("Job seeker user created:", jobSeekerUser.email)

    // Create Sample Jobs
    const jobs = await Job.create([
      {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced frontend developer to join our team.",
        company: "TechCorp Inc",
        location: "San Francisco, CA",
        type: "full-time",
        salary: "$120,000 - $150,000",
        requirements: "React\nJavaScript\nCSS\nHTML",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        user: employerUser._id,
      },
      {
        title: "Backend Developer",
        description: "Join our backend team to build scalable APIs and services.",
        company: "DataSystems",
        location: "New York, NY",
        type: "full-time",
        salary: "$100,000 - $130,000",
        requirements: "Node.js\nMongoDB\nExpress\nREST APIs",
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        user: employerUser._id,
      },
      {
        title: "UX/UI Designer",
        description: "Create beautiful and intuitive user experiences.",
        company: "CreativeMinds",
        location: "Remote",
        type: "remote",
        salary: "$80,000 - $100,000",
        requirements: "Figma\nAdobe Creative Suite\nUser Research",
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        user: employerUser._id,
      },
      {
        title: "DevOps Engineer",
        description: "Manage our cloud infrastructure and deployment pipelines.",
        company: "CloudTech",
        location: "Austin, TX",
        type: "full-time",
        salary: "$110,000 - $140,000",
        requirements: "AWS\nDocker\nKubernetes\nCI/CD",
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        user: employerUser._id,
      },
      {
        title: "Marketing Intern",
        description: "Learn digital marketing in a fast-paced startup environment.",
        company: "StartupXYZ",
        location: "Los Angeles, CA",
        type: "internship",
        salary: "$15/hour",
        requirements: "Social Media\nContent Creation\nAnalytics",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        user: employerUser._id,
      },
    ])

    console.log(`${jobs.length} jobs created`)

    // Create Sample Applications
    const applications = await Application.create([
      {
        user: jobSeekerUser._id,
        job: jobs[1]._id, // Backend Developer
        coverLetter: "I am very interested in this backend developer position...",
        resume: "resume_backend_dev.pdf",
        status: "pending",
      },
      {
        user: jobSeekerUser._id,
        job: jobs[2]._id, // UX/UI Designer
        coverLetter: "My design skills would be perfect for this role...",
        resume: "resume_ux_designer.pdf",
        status: "pending",
      },
    ])

    console.log(`${applications.length} applications created`)

    console.log("✅ Database seeded successfully!")
    console.log("\n🔑 Login Credentials:")
    console.log("👑 Admin: admin@jobboard.com / admin123")
    console.log("🏢 Employer: employer@test.com / password123")
    console.log("👤 Job Seeker: seeker@test.com / password123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedData()
