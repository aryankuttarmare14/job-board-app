const Job = require("../models/job.model")
const Application = require("../models/application.model")
const { AppError, asyncHandler } = require("../utils/error.utils")

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employers only)
exports.createJob = asyncHandler(async (req, res, next) => {
  // Add employer to job data
  req.body.employer = req.user.id

  const job = await Job.create(req.body)

  res.status(201).json({
    success: true,
    data: job,
  })
})

// @desc    Get all jobs with filtering
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  // Build query
  const query = {}

  // Search by keyword
  if (req.query.q) {
    query.$text = { $search: req.query.q }
  }

  // Filter by location
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: "i" }
  }

  // Filter by job type
  if (req.query.type && req.query.type !== "any") {
    query.type = req.query.type
  }

  // Filter by status (default to active)
  query.status = req.query.status || "active"

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit

  // Sort options
  let sortOptions = {}
  if (req.query.sort === "oldest") {
    sortOptions = { createdAt: 1 }
  } else if (req.query.sort === "relevance" && req.query.q) {
    sortOptions = { score: { $meta: "textScore" } }
    query.score = { $meta: "textScore" }
  } else {
    // Default to newest
    sortOptions = { createdAt: -1 }
  }

  // Execute query
  const jobs = await Job.find(query)
    .sort(sortOptions)
    .skip(startIndex)
    .limit(limit)
    .populate("employer", "name company")

  // Get total count
  const total = await Job.countDocuments(query)

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  }

  res.status(200).json({
    success: true,
    count: jobs.length,
    pagination,
    data: jobs,
  })
})

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
// @access  Public
exports.getFeaturedJobs = asyncHandler(async (req, res, next) => {
  // Get active jobs with most applications
  const jobs = await Job.find({ status: "active" })
    .sort({ applications: -1 })
    .limit(6)
    .populate("employer", "name company")

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  })
})

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate("employer", "name company location")

  if (!job) {
    return next(new AppError(`Job not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: job,
  })
})

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id)

  if (!job) {
    return next(new AppError(`Job not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is job owner
  if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError(`User ${req.user.id} is not authorized to update this job`, 403))
  }

  // Update job
  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: job,
  })
})

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    return next(new AppError(`Job not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is job owner
  if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError(`User ${req.user.id} is not authorized to delete this job`, 403))
  }

  // Delete all applications for this job
  await Application.deleteMany({ job: req.params.id })

  // Delete job
  await job.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get jobs posted by employer
// @route   GET /api/jobs/employer
// @access  Private (Employers only)
exports.getEmployerJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  })
})
