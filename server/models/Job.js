import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  company: {
    type: String,
    required: [true, "Please add a company name"],
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "remote", "contract", "internship"],
    required: [true, "Please specify job type"],
  },
  salary: {
    type: String,
  },
  requirements: {
    type: String,
  },
  deadline: {
    type: Date,
    required: [true, "Please add an application deadline"],
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
})

// Create index for search functionality
JobSchema.index({ title: "text", description: "text", location: "text" })

export default mongoose.model("Job", JobSchema)
