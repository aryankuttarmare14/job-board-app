const express = require("express")
const router = express.Router()
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getFeaturedJobs,
  getEmployerJobs,
} = require("../controllers/job.controller")
const { protect, restrictTo } = require("../middleware/auth.middleware")

// Public routes
router.get("/", getJobs)
router.get("/featured", getFeaturedJobs)
router.get("/:id", getJob)

// Protected routes
router.post("/", protect, restrictTo("employer"), createJob)
router.put("/:id", protect, updateJob)
router.delete("/:id", protect, deleteJob)
router.get("/employer/me", protect, restrictTo("employer"), getEmployerJobs)

module.exports = router
