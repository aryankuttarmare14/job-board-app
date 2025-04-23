const User = require("../models/user.model")
const { AppError, asyncHandler } = require("../utils/error.utils")
const { sendTokenResponse } = require("../utils/token.utils")

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, username, email, password, role } = req.body

  // Check if email already exists
  const emailExists = await User.findOne({ email })
  if (emailExists) {
    return next(new AppError("Email already in use", 400))
  }

  // Check if username already exists
  const usernameExists = await User.findOne({ username })
  if (usernameExists) {
    return next(new AppError("Username already in use", 400))
  }

  // Create user
  const user = await User.create({
    name,
    username,
    email,
    password,
    role: role || "jobseeker",
  })

  // Send token response
  sendTokenResponse(user, 201, res)
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email & password
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400))
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new AppError("Invalid credentials", 401))
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401))
  }

  // Send token response
  sendTokenResponse(user, 200, res)
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, username, email, company, location, bio, skills } = req.body

  // Check if new email already exists
  if (email && email !== req.user.email) {
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return next(new AppError("Email already in use", 400))
    }
  }

  // Check if new username already exists
  if (username && username !== req.user.username) {
    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
      return next(new AppError("Username already in use", 400))
    }
  }

  // Build update object
  const updateFields = {}
  if (name) updateFields.name = name
  if (username) updateFields.username = username
  if (email) updateFields.email = email
  if (company) updateFields.company = company
  if (location) updateFields.location = location
  if (bio) updateFields.bio = bio
  if (skills) updateFields.skills = skills

  // Update user
  const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  // Validate
  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400))
  }

  // Get user with password
  const user = await User.findById(req.user.id).select("+password")

  // Check current password
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401))
  }

  // Update password
  user.password = newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})
