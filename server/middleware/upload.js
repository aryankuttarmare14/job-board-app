import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow pdf only
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Only PDF files are allowed!"), false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB max
  fileFilter,
})

export default upload
