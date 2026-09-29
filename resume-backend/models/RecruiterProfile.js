const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

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

    designation: {
      type: String,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    companyWebsite: {
      type: String,
      trim: true,
    },

    companyDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    companyLocation: {
      type: String,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema
);

module.exports = RecruiterProfile;