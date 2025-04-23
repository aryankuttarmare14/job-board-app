const { AppError } = require("../utils/error.utils")

// Error handler middleware
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  // Log error for development
  console.error(err)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = new AppError(message, 400)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`
    error = new AppError(message, 400)
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`
    error = new AppError(message, 400)
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401)
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired. Please log in again.", 401)
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
