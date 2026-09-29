const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    // ======================================
    // USER
    // ======================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ======================================
    // PROFILE PHOTO
    // ======================================

    profilePhoto: {
      type: String,
      default: "",
    },

    // ======================================
    // BASIC INFORMATION
    // ======================================

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    // ======================================
    // CAREER SUMMARY
    // ======================================

    careerSummary: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // ======================================
    // EDUCATION
    // ======================================

    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
        grade: String,
      },
    ],

    // ======================================
    // SKILLS
    // ======================================

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // ======================================
    // EXPERIENCE
    // ======================================

    experience: [
      {
        company: String,

        jobTitle: String,

        startDate: Date,

        endDate: Date,

        currentlyWorking: {
          type: Boolean,
          default: false,
        },

        description: String,
      },
    ],

    // ======================================
    // PROJECTS
    // ======================================

    projects: [
      {
        title: String,

        description: String,

        technologies: [String],

        projectUrl: String,

        githubUrl: String,
      },
    ],

    // ======================================
    // CERTIFICATIONS
    // ======================================

    certifications: [
      {
        name: String,

        organization: String,

        issueDate: Date,

        credentialUrl: String,
      },
    ],

    // ======================================
    // SOCIAL LINKS
    // ======================================

    github: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    portfolio: {
      type: String,
      trim: true,
    },

    // ======================================
    // LATEST RESUME
    // ======================================

    resume: {
      // ====================================
      // FILE NAME
      // ====================================

      fileName: {
        type: String,
        default: "",
      },

      // ====================================
      // FILE PATH
      // ====================================

      filePath: {
        type: String,
        default: "",
      },
      fileUrl: {
  type: String,
  default: "",
},
      // ====================================
      // UPLOAD DATE
      // ====================================

      uploadedAt: {
        type: Date,
      },

      // ====================================
      // GENERAL ATS SCORE
      // ====================================

      atsScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      // ====================================
      // EXTRACTED RESUME TEXT LENGTH
      // ====================================

      resumeTextLength: {
        type: Number,
        default: 0,
      },

      // ====================================
      // EXTRACTED SKILLS
      // ====================================

      extractedSkills: {
        type: [String],
        default: [],
      },

      // ====================================
      // ATS BREAKDOWN
      // ====================================

      atsBreakdown: {
        skillScore: {
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

        projectScore: {
          type: Number,
          default: 0,
        },

        resumeQualityScore: {
          type: Number,
          default: 0,
        },
      },
    },
  },

  // ======================================
  // TIMESTAMPS
  // ======================================

  {
    timestamps: true,
  }
);

// ======================================
// MODEL
// ======================================

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

module.exports = CandidateProfile;