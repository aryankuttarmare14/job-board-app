const User = require("../models/user.model")
const Job = require("../models/job.model")
const Application = require("../models/application.model")
const { AppError, asyncHandler } = require("../utils/error.utils")

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password")

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  })
})

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password")

  if (!user) {
    return next(new AppError(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password")

  if (!user) {
    return next(new AppError(`User not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError(`User not found with id of ${req.params.id}`, 404))
  }

  // Delete user's jobs if they are an employer
  if (user.role === "employer") {
    const jobs = await Job.find({ employer: user._id })

    // Delete applications for each job
    for (const job of jobs) {
      await Application.deleteMany({ job: job._id })
    }

    await Job.deleteMany({ employer: user._id })
  }

  // Delete user's applications if they are a job seeker
  if (user.role === "jobseeker") {
    await Application.deleteMany({ applicant: user._id })
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Get all jobs (admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
exports.getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find().populate("employer", "name company email")

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  })
})

// @desc    Update job (admin)
// @route   PUT /api/admin/jobs/:id
// @access  Private (Admin only)
exports.updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("employer", "name company email")

  if (!job) {
    return next(new AppError(`Job not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: job,
  })
})

// @desc    Delete job (admin)
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin only)
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    return next(new AppError(`Job not found with id of ${req.params.id}`, 404))
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

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments()
  const employers = await User.countDocuments({ role: "employer" })
  const jobSeekers = await User.countDocuments({ role: "jobseeker" })

  const totalJobs = await Job.countDocuments()
  const activeJobs = await Job.countDocuments({ status: "active" })
  const closedJobs = await Job.countDocuments({ status: "closed" })

  const totalApplications = await Application.countDocuments()
  const pendingApplications = await Application.countDocuments({ status: "pending" })
  const acceptedApplications = await Application.countDocuments({ status: "accepted" })
  const rejectedApplications = await Application.countDocuments({ status: "rejected" })

  // Recent activity
  const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).populate("employer", "name company")

  const recentApplications = await Application.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("job", "title company")
    .populate("applicant", "name email")

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        employers,
        jobSeekers,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      },
      recent: {
        jobs: recentJobs,
        applications: recentApplications,
      },
    },
  })
})
