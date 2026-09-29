const fs = require("fs");
const path = require("path");

const Application = require("../models/Application");

// ======================================
// GET RESUME
// ======================================

const getResume = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id).populate({
      path: "job",
      select: "recruiter",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ======================================
    // CANDIDATE ACCESS
    // ======================================

    const isCandidate =
      req.user.role === "CANDIDATE" &&
      application.candidate.toString() ===
        req.user._id.toString();

    // ======================================
    // RECRUITER ACCESS
    // ======================================

    const isRecruiter =
      req.user.role === "RECRUITER" &&
      application.job &&
      application.job.recruiter.toString() ===
        req.user._id.toString();

    // ======================================
    // ACCESS CHECK
    // ======================================

    if (!isCandidate && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resume",
      });
    }

    // ======================================
    // CHECK RESUME
    // ======================================

    if (!application.resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // ======================================
    // FILE PATH
    // ======================================

    const filePath = path.resolve(
      application.resume
    );

    // ======================================
    // CHECK FILE EXISTS
    // ======================================

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message:
          "Resume file does not exist on server",
      });
    }

    // ======================================
    // SEND PDF
    // ======================================

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "inline; filename=resume.pdf"
    );

    return res.sendFile(filePath);
  } catch (error) {
    console.error(
      "Get Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// EXPORT
// ======================================

module.exports = {
  getResume,
};