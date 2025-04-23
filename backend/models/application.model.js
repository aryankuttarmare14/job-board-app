const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant is required"],
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure a user can only apply once to a job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application
