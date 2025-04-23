const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const { AppError } = require("../utils/error.utils")

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Check if token exists
    if (!token) {
      return next(new AppError("Not authorized to access this route", 401))
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      const user = await User.findById(decoded.id)

      if (!user) {
        return next(new AppError("User not found", 404))
      }

      // Add user to request object
      req.user = user
      next()
    } catch (error) {
      return next(new AppError("Not authorized to access this route", 401))
    }
  } catch (error) {
    next(error)
  }
}

// Restrict routes based on user role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}
