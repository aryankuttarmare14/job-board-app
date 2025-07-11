import express from "express"
import { protect, authorize } from "../middleware/auth.js"
import upload from "../middleware/upload.js"
import Application from "../models/Application.js"
import Job from "../models/Job.js"

const router = express.Router()

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Job Seekers only)
router.post("/:jobId", [protect, authorize("job_seeker")], upload.single("resume"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      user: req.user.id,
    })

    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job" })
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume" })
    }

    // Create application
    const application = new Application({
      job: req.params.jobId,
      user: req.user.id,
      resumePath: `/uploads/${req.file.filename}`,
      coverLetter: req.body.coverLetter,
    })

    await application.save()

    res.status(201).json({
      success: true,
      data: application,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message || "Server error" })
  }
})

// @route   GET /api/applications/jobs/:jobId
// @desc    Get all applications for a specific job
// @access  Private (Employers only)
router.get("/jobs/:jobId", [protect, authorize("employer")], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized to view these applications" })
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: "user",
        select: "name email",
      })
      .sort({ appliedAt: -1 })

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/applications/me
// @desc    Get all applications by the logged in user
// @access  Private (Job Seekers only)
router.get("/me", [protect, authorize("job_seeker")], async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate({
        path: "job",
        select: "title company location type deadline",
      })
      .sort({ appliedAt: -1 })

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   PUT /api/applications/:id
// @desc    Update application status
// @access  Private (Employers only)
router.put("/:id", [protect, authorize("employer")], async (req, res) => {
  try {
    const { status } = req.body

    if (!["pending", "reviewed", "rejected", "accepted"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    let application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ error: "Application not found" })
    }

    // Check if employer owns the job
    const job = await Job.findById(application.job)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized to update this application" })
    }

    // Update application
    application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })

    res.json({
      success: true,
      data: application,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
