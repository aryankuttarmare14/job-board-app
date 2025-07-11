import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  resumePath: {
    type: String,
    required: [true, "Please upload a resume"],
  },
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected", "accepted"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
})

// Prevent user from submitting more than one application per job
ApplicationSchema.index({ job: 1, user: 1 }, { unique: true })

export default mongoose.model("Application", ApplicationSchema)
