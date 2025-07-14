import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/db.js"

// Route imports
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

// Load env vars
dotenv.config()

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is not set!")
  console.error("Please create a .env file in the server directory with your MongoDB Atlas connection string")
  process.exit(1)
}

// Connect to database
connectDB()

const app = express()

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(cors())

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Mount routes
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/admin", adminRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
