const fs = require("fs");
const path = require("path");

const CandidateProfile = require("../models/CandidateProfile");
const User = require("../models/User");
const Application = require("../models/Application");

const { extractResumeText } = require("../services/resumeParser");

const {
  extractSkills,
  normalizeSkills,
} = require("../services/skillExtractor");

const {
  calculateATSScore,
} = require("../services/atsScorer");

// ======================================
// CREATE / UPDATE CANDIDATE PROFILE
// ======================================
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      location,
      careerSummary,
      education,
      skills,
      experience,
      projects,
      certifications,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const profileData = {
      user: userId,
      fullName,
      phone,
      location,
      careerSummary,
      education,
      skills,
      experience,
      projects,
      certifications,
      github,
      linkedin,
      portfolio,
      email: req.user.email,
    };

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(userId, {
      name: fullName || req.user.name,
      phone: phone || req.user.phone,
    });

    res.status(200).json({
      success: true,
      message: "Candidate profile saved successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET MY CANDIDATE PROFILE
// ======================================
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    if (!profile) {
      res.status(404);
      throw new Error("Candidate profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Candidate profile fetched successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE MY CANDIDATE PROFILE
// ======================================
const deleteMyProfile = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOneAndDelete({
      user: req.user._id,
    });

    if (!profile) {
      res.status(404);
      throw new Error("Candidate profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Candidate profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// CANDIDATE DASHBOARD
// ======================================
const getCandidateDashboard = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // ======================================
    // GET ALL APPLICATIONS
    // ======================================
    const applications = await Application.find({
      candidate: candidateId,
    }).select("status atsScore");

    // ======================================
    // APPLICATION COUNT
    // ======================================
    const totalApplications = applications.length;

    // ======================================
    // SHORTLISTED COUNT
    // ======================================
    const shortlisted = applications.filter(
      (application) =>
        application.status === "SHORTLISTED"
    ).length;

    // ======================================
    // INTERVIEW COUNT
    // ======================================
    const interviews = applications.filter(
      (application) =>
        application.status === "INTERVIEW"
    ).length;

    // ======================================
    // GET CANDIDATE PROFILE
    // ======================================
    const profile = await CandidateProfile.findOne({
      user: candidateId,
    }).select("resume fullName email skills");

    // ======================================
    // LATEST RESUME ATS SCORE
    // ======================================
    const resumeATSScore =
      profile?.resume?.atsScore || 0;

    // ======================================
    // LATEST RESUME INFO
    // ======================================
    const resume = profile?.resume
      ? {
          fileName:
            profile.resume.fileName || "",

          uploadedAt:
            profile.resume.uploadedAt || null,

          atsScore:
            profile.resume.atsScore || 0,

          resumeTextLength:
            profile.resume.resumeTextLength || 0,

          extractedSkills:
            profile.resume.extractedSkills || [],

          atsBreakdown:
            profile.resume.atsBreakdown || {},
        }
      : null;

    // ======================================
    // RESPONSE
    // ======================================
    res.status(200).json({
      success: true,

      message:
        "Candidate dashboard fetched successfully",

      data: {
        // ==================================
        // APPLICATION STATS
        // ==================================

        applications: totalApplications,

        shortlisted,

        interviews,

        // ==================================
        // LATEST RESUME ATS SCORE
        // ==================================

        resumeATSScore,

        // ==================================
        // LATEST RESUME
        // ==================================

        resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// UPLOAD RESUME
// ======================================
const uploadResume = async (req, res, next) => {
  let uploadedFilePath = null;

  try {
    console.log(
      "🔥 UPLOAD RESUME CONTROLLER REACHED"
    );

    console.log("BODY:", req.body);

    console.log("FILE:", req.file);

    // ======================================
    // CHECK FILE
    // ======================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // ======================================
    // GET UPLOADED FILE PATH
    // ======================================
    uploadedFilePath = path.resolve(
      req.file.path
    );

    console.log(
      "Resume:",
      req.file.originalname
    );

    console.log(
      "Saved Path:",
      uploadedFilePath
    );

    console.log(
      "File Exists:",
      fs.existsSync(uploadedFilePath)
    );

    // ======================================
    // CHECK FILE EXISTS
    // ======================================
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(500).json({
        success: false,
        message:
          "Uploaded resume file not found",
      });
    }

    // ======================================
    // CHECK FILE SIZE
    // ======================================
    const stats =
      fs.statSync(uploadedFilePath);

    if (stats.size === 0) {
      fs.unlinkSync(uploadedFilePath);

      return res.status(400).json({
        success: false,
        message:
          "Uploaded resume is empty",
      });
    }

    console.log(
      "Resume size:",
      stats.size
    );

    // ======================================
    // EXTRACT RESUME TEXT
    // ======================================
    console.log(
      "🔥 Extracting resume text..."
    );

    const resumeText =
      await extractResumeText(
        uploadedFilePath
      );

    console.log(
      "Resume text length:",
      resumeText?.length || 0
    );

    if (
      !resumeText ||
      !resumeText.trim()
    ) {
      if (
        fs.existsSync(
          uploadedFilePath
        )
      ) {
        fs.unlinkSync(
          uploadedFilePath
        );
      }

      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from resume PDF",
      });
    }

    // ======================================
    // EXTRACT SKILLS
    // ======================================
    const extractedSkills =
      normalizeSkills(
        extractSkills(resumeText)
      );

    console.log(
      "Extracted skills:",
      extractedSkills
    );

    // ======================================
    // CALCULATE RESUME ATS SCORE
    // ======================================
    const atsResult =
      calculateATSScore({
        jobSkills: extractedSkills,
        resumeSkills: extractedSkills,
        experience: [],
        education: [],
        projects: [],
        resumeText,
      });

    const {
      atsScore,
      skillScore,
      experienceScore,
      educationScore,
      projectScore,
      resumeQualityScore,
    } = atsResult;

    console.log(
      "📊 Resume ATS Score:",
      atsScore
    );

    // ======================================
    // FIND / CREATE PROFILE
    // ======================================
    let profile =
      await CandidateProfile.findOne({
        user: req.user._id,
      });

    if (!profile) {
      profile =
        new CandidateProfile({
          user: req.user._id,
          email: req.user.email,
        });
    }

    // ======================================
    // DELETE OLD RESUME FILE
    // ======================================
    if (
      profile.resume?.filePath &&
      profile.resume.filePath !==
        uploadedFilePath
    ) {
      const oldResumePath =
        path.resolve(
          profile.resume.filePath
        );

      if (
        fs.existsSync(oldResumePath)
      ) {
        try {
          fs.unlinkSync(
            oldResumePath
          );

          console.log(
            "Old resume deleted:",
            oldResumePath
          );
        } catch (error) {
          console.log(
            "Could not delete old resume:",
            error.message
          );
        }
      }
    }

    // ======================================
    // SAVE LATEST RESUME
    // ======================================
   // ======================================
// SAVE LATEST RESUME
// ======================================

const fileUrl =
  `/uploads/resumes/${req.file.filename}`;

profile.resume = {
  fileName:
    req.file.originalname,

  filePath:
    uploadedFilePath,

  fileUrl:
    fileUrl,

  uploadedAt:
    new Date(),

  atsScore:
    atsScore,

  resumeTextLength:
    resumeText.length,

  extractedSkills:
    extractedSkills,

  atsBreakdown: {
    skillScore:
      skillScore,

    experienceScore:
      experienceScore,

    educationScore:
      educationScore,

    projectScore:
      projectScore,

    resumeQualityScore:
      resumeQualityScore,
  },
};

    // ======================================
    // SAVE EXTRACTED SKILLS
    // ======================================
    if (
      extractedSkills.length > 0
    ) {
      profile.skills =
        extractedSkills;
    }

    // ======================================
    // SAVE PROFILE
    // ======================================
    await profile.save();

    console.log(
      "✅ Resume saved successfully"
    );

    console.log(
      "✅ Latest ATS Score:",
      profile.resume.atsScore
    );

    // ======================================
    // RESPONSE
    // ======================================
    res.status(200).json({
      success: true,

      message:
        "Resume uploaded successfully",

      data: {
        resume: {
          fileName:
            profile.resume.fileName,
            fileUrl:
  profile.resume.fileUrl,

          uploadedAt:
            profile.resume.uploadedAt,
            

          atsScore:
            profile.resume.atsScore,

          resumeTextLength:
            profile.resume.resumeTextLength,

          extractedSkills:
            profile.resume.extractedSkills,

          atsBreakdown:
            profile.resume.atsBreakdown,
        },

        extractedSkills,

        resumeTextLength:
          resumeText.length,

        atsScore:
          profile.resume.atsScore,
      },
    });
  } catch (error) {
    console.error(
      "❌ Upload Resume Error:",
      error
    );

    // ======================================
    // DELETE NEW FILE ON ERROR
    // ======================================
    if (
      uploadedFilePath &&
      fs.existsSync(
        uploadedFilePath
      )
    ) {
      try {
        fs.unlinkSync(
          uploadedFilePath
        );

        console.log(
          "Uploaded resume deleted after error"
        );
      } catch (deleteError) {
        console.error(
          "Could not delete uploaded resume:",
          deleteError.message
        );
      }
    }

    next(error);
  }
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  deleteMyProfile,
  uploadResume,
  getCandidateDashboard,
};