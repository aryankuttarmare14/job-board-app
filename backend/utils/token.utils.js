const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

// Send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id)

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    success: true,
    token,
    user,
  })
}

module.exports = {
  generateToken,
  sendTokenResponse,
}
