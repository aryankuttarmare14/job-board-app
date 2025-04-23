const express = require("express")
const router = express.Router()
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllJobs,
  updateJob,
  deleteJob,
  getDashboardStats,
} = require("../controllers/admin.controller")
const { protect, restrictTo } = require("../middleware/auth.middleware")

// All routes are protected and restricted to admin
router.use(protect, restrictTo("admin"))

// User routes
router.get("/users", getAllUsers)
router.get("/users/:id", getUserById)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

// Job routes
router.get("/jobs", getAllJobs)
router.put("/jobs/:id", updateJob)
router.delete("/jobs/:id", deleteJob)

// Dashboard stats
router.get("/stats", getDashboardStats)

module.exports = router
