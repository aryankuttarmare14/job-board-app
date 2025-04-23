const express = require("express")
const router = express.Router()
const {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  downloadResume,
} = require("../controllers/application.controller")
const { protect, restrictTo } = require("../middleware/auth.middleware")
const upload = require("../middleware/upload.middleware")

// Job seeker routes
router.post("/", protect, restrictTo("jobseeker"), upload.single("resume"), applyForJob)
router.get("/me", protect, restrictTo("jobseeker"), getMyApplications)
router.delete("/:id", protect, deleteApplication)

// Employer routes
router.get("/job/:jobId", protect, restrictTo("employer"), getJobApplications)
router.put("/:id", protect, restrictTo("employer"), updateApplicationStatus)
router.get("/:id/resume", protect, restrictTo("employer"), downloadResume)

module.exports = router
