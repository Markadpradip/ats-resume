const mongoose = require("mongoose");
const Job = require("../models/job");
const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    // ==============================
    // LOCATION
    // ==============================

    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },
    },

    salary: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
      ],
      default: "FULL_TIME",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// INDEXES
// ==============================

jobSchema.index({
  recruiter: 1,
  createdAt: -1,
});

jobSchema.index({
  status: 1,
  createdAt: -1,
});

jobSchema.index({
  "location.country": 1,
  "location.state": 1,
  "location.city": 1,
});

module.exports =
  mongoose.models.Job ||
  mongoose.model("Job", jobSchema);