import express from "express"
import { protect, adminOnly } from "../middleware/auth.js"
import User from "../models/User.js"
import Job from "../models/Job.js"
import Application from "../models/Application.js"

const router = express.Router()

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/stats", [protect, adminOnly], async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const employerCount = await User.countDocuments({ role: "employer" })
    const jobSeekerCount = await User.countDocuments({ role: "job_seeker" })
    const jobCount = await Job.countDocuments()
    const applicationCount = await Application.countDocuments()

    // Get recent jobs
    const recentJobs = await Job.find().sort({ postedAt: -1 }).limit(5).populate({
      path: "user",
      select: "name company",
    })

    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ appliedAt: -1 })
      .limit(5)
      .populate([
        {
          path: "user",
          select: "name email",
        },
        {
          path: "job",
          select: "title company",
        },
      ])

    res.json({
      success: true,
      data: {
        userCount,
        employerCount,
        jobSeekerCount,
        jobCount,
        applicationCount,
        recentJobs,
        recentApplications,
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/users", [protect, adminOnly], async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   PUT /api/admin/users/:id
// @desc    Update user role or admin status
// @access  Private (Admin only)
router.put("/users/:id", [protect, adminOnly], async (req, res) => {
  try {
    const { role, isAdmin } = req.body

    // Find user
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update fields if provided
    if (role !== undefined) {
      user.role = role
    }

    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin
    }

    await user.save()

    res.json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete("/users/:id", [protect, adminOnly], async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Use deleteOne instead of remove
    await User.deleteOne({ _id: req.params.id })

    res.json({ success: true, message: "User removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/admin/jobs
// @desc    Get all jobs
// @access  Private (Admin only)
router.get("/jobs", [protect, adminOnly], async (req, res) => {
  try {
    const jobs = await Job.find().populate({
      path: "user",
      select: "name company",
    })

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job
// @access  Private (Admin only)
router.delete("/jobs/:id", [protect, adminOnly], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Use deleteOne instead of remove
    await Job.deleteOne({ _id: req.params.id })

    res.json({ success: true, message: "Job removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/admin/applications
// @desc    Get all applications
// @access  Private (Admin only)
router.get("/applications", [protect, adminOnly], async (req, res) => {
  try {
    const applications = await Application.find().populate([
      {
        path: "user",
        select: "name email",
      },
      {
        path: "job",
        select: "title company",
      },
    ])

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

export default router
