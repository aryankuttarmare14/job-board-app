const express = require("express")
const router = express.Router()
const { register, login, getMe, updateProfile, changePassword } = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth.middleware")

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/password", protect, changePassword)

module.exports = router
