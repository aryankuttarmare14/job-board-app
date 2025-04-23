const Application = require("../models/application.model")
const Job = require("../models/job.model")
const { AppError, asyncHandler } = require("../utils/error.utils")
const fs = require("fs")
const path = require("path")

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job seekers only)
exports.applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId, coverLetter } = req.body

  // Check if job exists
  const job = await Job.findById(jobId)
  if (!job) {
    return next(new AppError(`Job not found with id of ${jobId}`, 404))
  }

  // Check if job is still active
  if (job.status !== "active") {
    return next(new AppError("This job is no longer accepting applications", 400))
  }

  // Check if deadline has passed
  if (new Date() > job.deadline) {
    return next(new AppError("The application deadline for this job has passed", 400))
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user.id,
  })

  if (existingApplication) {
    return next(new AppError("You have already applied for this job", 400))
  }

  // Get resume file path
  if (!req.file) {
    return next(new AppError("Please upload your resume", 400))
  }

  const resumeUrl = `/uploads/${req.file.filename}`

  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: req.user.id,
    coverLetter,
    resumeUrl,
  })

  // Increment job applications count
  await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } })

  res.status(201).json({
    success: true,
    data: application,
  })
})

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
exports.getJobApplications = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params

  // Check if job exists and belongs to employer
  const job = await Job.findById(jobId)
  if (!job) {
    return next(new AppError(`Job not found with id of ${jobId}`, 404))
  }

  if (job.employer.toString() !== req.user.id) {
    return next(new AppError("Not authorized to access these applications", 403))
  }

  // Get applications
  const applications = await Application.find({ job: jobId })
    .populate("applicant", "name email username")
    .populate("job", "title company")

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  })
})

// @desc    Get applications by job seeker
// @route   GET /api/applications/me
// @access  Private (Job seeker only)
exports.getMyApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({ applicant: req.user.id })
    .populate({
      path: "job",
      select: "title company location type deadline",
      populate: {
        path: "employer",
        select: "name company",
      },
    })
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  })
})

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer only)
exports.updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { status, feedback } = req.body

  // Find application
  const application = await Application.findById(req.params.id).populate("job")

  if (!application) {
    return next(new AppError(`Application not found with id of ${req.params.id}`, 404))
  }

  // Check if user is the employer of the job
  const job = await Job.findById(application.job._id)
  if (job.employer.toString() !== req.user.id) {
    return next(new AppError("Not authorized to update this application", 403))
  }

  // Update application
  application.status = status
  if (feedback) {
    application.feedback = feedback
  }

  await application.save()

  res.status(200).json({
    success: true,
    data: application,
  })
})

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job seeker only)
exports.deleteApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id)

  if (!application) {
    return next(new AppError(`Application not found with id of ${req.params.id}`, 404))
  }

  // Check if user is the applicant
  if (application.applicant.toString() !== req.user.id) {
    return next(new AppError("Not authorized to delete this application", 403))
  }

  // Delete resume file
  if (application.resumeUrl) {
    const filePath = path.join(__dirname, "..", application.resumeUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  // Decrement job applications count
  await Job.findByIdAndUpdate(application.job, { $inc: { applications: -1 } })

  // Delete application
  await application.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Download resume
// @route   GET /api/applications/:id/resume
// @access  Private (Employer of the job only)
exports.downloadResume = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id).populate("job")

  if (!application) {
    return next(new AppError(`Application not found with id of ${req.params.id}`, 404))
  }

  // Check if user is the employer of the job
  const job = await Job.findById(application.job._id)
  if (job.employer.toString() !== req.user.id) {
    return next(new AppError("Not authorized to download this resume", 403))
  }

  // Get resume file path
  const resumePath = path.join(__dirname, "..", application.resumeUrl)

  // Check if file exists
  if (!fs.existsSync(resumePath)) {
    return next(new AppError("Resume file not found", 404))
  }

  // Send file
  res.download(resumePath)
})
