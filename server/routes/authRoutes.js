import express from "express"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { protect } from "../middleware/auth.js" // Add this import

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("role", "Role must be either job_seeker or employer").isIn(["job_seeker", "employer"]),
    body("company").custom((value, { req }) => {
      if (req.body.role === "employer" && !value) {
        throw new Error("Company name is required for employers")
      }
      return true
    }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, role, company } = req.body

    try {
      // Check if user already exists
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Create user
      user = new User({
        name,
        email,
        password,
        role,
        company: role === "employer" ? company : undefined,
      })

      await user.save()

      // Generate JWT
      const token = user.getSignedJwtToken()

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          isAdmin: user.isAdmin || user.role === "admin",
        },
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post(
  "/login",
  [body("email", "Please include a valid email").isEmail(), body("password", "Password is required").exists()],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check for user
      const user = await User.findOne({ email }).select("+password")

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password)

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Generate JWT
      const token = user.getSignedJwtToken()

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          isAdmin: user.isAdmin || user.role === "admin",
        },
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", protect, async (req, res) => {
  // Use 'protect' instead of 'auth'
  try {
    const user = await User.findById(req.user.id)

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        isAdmin: user.isAdmin,
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
