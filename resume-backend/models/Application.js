const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==============================
    // JOB
    // ==============================
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ==============================
    // CANDIDATE
    // ==============================
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==============================
    // RESUME
    // ==============================
    resume: {
      type: String,
    },

    // ==============================
    // COVER LETTER
    // ==============================
    coverLetter: {
      type: String,
      trim: true,
    },

    // ==============================
    // APPLICATION STATUS
    // ==============================
    status: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "REJECTED",
        "INTERVIEW",
        "HIRED",
      ],
      default: "APPLIED",
    },

    // ==============================
    // ATS SCORE
    // ==============================
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
// ==============================
// ATS BREAKDOWN
// ==============================

atsBreakdown: {
  skillScore: {
    type: Number,
    default: 0,
  },

  keywordScore: {
    type: Number,
    default: 0,
  },

  sectionScore: {
    type: Number,
    default: 0,
  },

  atsParsabilityScore: {
    type: Number,
    default: 0,
  },

  experienceScore: {
    type: Number,
    default: 0,
  },

  educationScore: {
    type: Number,
    default: 0,
  },

  projectQualityScore: {
    type: Number,
    default: 0,
  },
},
    // ==============================
    // ATS MATCHED SKILLS
    // ==============================
    matchedSkills: {
      type: [String],
      default: [],
    },

    // ==============================
    // ATS MISSING SKILLS
    // ==============================
    missingSkills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// PREVENT DUPLICATE APPLICATION
// ==============================
applicationSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);
// ======================================
// PERFORMANCE INDEXES
// ======================================

// Candidate's applications
applicationSchema.index({
  candidate: 1,
  createdAt: -1,
});

// Recruiter / Job applications
applicationSchema.index({
  job: 1,
  createdAt: -1,
});

// ATS ranking
applicationSchema.index({
  job: 1,
  atsScore: -1,
});

// Application status filtering
applicationSchema.index({
  status: 1,
  createdAt: -1,
});

const Application = mongoose.model(
  "Application",
  applicationSchema
);

module.exports = Application;