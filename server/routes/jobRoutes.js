import express from "express"
import { body, validationResult } from "express-validator"
import { protect, authorize } from "../middleware/auth.js"
import Job from "../models/Job.js"

const router = express.Router()

// @route   GET /api/jobs
// @desc    Get all jobs with filtering
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search, location, type, sort } = req.query
    const query = {}

    // Search by keyword in title or description
    if (search) {
      query.$text = { $search: search }
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    // Filter by job type
    if (type) {
      query.type = type
    }

    // Build sort options
    let sortOptions = {}
    if (sort === "newest") {
      sortOptions = { postedAt: -1 }
    } else if (sort === "oldest") {
      sortOptions = { postedAt: 1 }
    } else if (sort === "deadline") {
      sortOptions = { deadline: 1 }
    } else if (search && sort === "relevance") {
      sortOptions = { score: { $meta: "textScore" } }
    } else {
      // Default sort by newest
      sortOptions = { postedAt: -1 }
    }

    // Execute query with pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit

    const jobs = await Job.find(query).sort(sortOptions).skip(startIndex).limit(limit).populate({
      path: "user",
      select: "name company",
    })

    // Get total count for pagination
    const total = await Job.countDocuments(query)

    res.json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
      },
      data: jobs,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: "user",
      select: "name company",
    })

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json({
      success: true,
      data: job,
    })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Job not found" })
    }
    res.status(500).json({ error: "Server error" })
  }
})

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private (Employers only)
router.post(
  "/",
  [
    protect,
    authorize("employer"),
    [
      body("title", "Title is required").not().isEmpty(),
      body("description", "Description is required").not().isEmpty(),
      body("location", "Location is required").not().isEmpty(),
      body("type", "Type must be one of: full-time, part-time, remote, contract, internship").isIn([
        "full-time",
        "part-time",
        "remote",
        "contract",
        "internship",
      ]),
      body("deadline", "Valid deadline date is required").isISO8601(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { title, description, location, type, salary, requirements, deadline } = req.body

      // Create job
      const job = new Job({
        title,
        description,
        company: req.user.company,
        location,
        type,
        salary,
        requirements,
        deadline,
        user: req.user.id,
      })

      await job.save()

      res.status(201).json({
        success: true,
        data: job,
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employers only)
router.put("/:id", [protect, authorize("employer")], async (req, res) => {
  try {
    let job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized to update this job" })
    }

    // Update job
    job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })

    res.json({
      success: true,
      data: job,
    })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Job not found" })
    }
    res.status(500).json({ error: "Server error" })
  }
})

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employers only)
router.delete("/:id", [protect, authorize("employer")], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Make sure user owns the job
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized to delete this job" })
    }

    // Use deleteOne instead of remove (which is deprecated)
    await Job.deleteOne({ _id: req.params.id })

    res.json({ success: true, message: "Job removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Job not found" })
    }
    res.status(500).json({ error: "Server error" })
  }
})

// @route   GET /api/jobs/employer/myjobs
// @desc    Get all jobs created by the employer
// @access  Private (Employers only)
router.get("/employer/myjobs", [protect, authorize("employer")], async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ postedAt: -1 })

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

export default router
