const Application = require("../models/Application");

// ======================================
// GET CANDIDATE DASHBOARD
// ======================================
const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user._id;

    // ======================================
    // GET MY APPLICATIONS
    // ======================================
    const applications = await Application.find({
      candidate: candidateId,
    }).select("status atsScore");

    // ======================================
    // TOTAL APPLICATIONS
    // ======================================
    const totalApplications =
      applications.length;

    // ======================================
    // STATUS COUNTS
    // ======================================
    const applied =
      applications.filter(
        (app) => app.status === "APPLIED"
      ).length;

    const shortlisted =
      applications.filter(
        (app) => app.status === "SHORTLISTED"
      ).length;

    const rejected =
      applications.filter(
        (app) => app.status === "REJECTED"
      ).length;

    const interview =
      applications.filter(
        (app) => app.status === "INTERVIEW"
      ).length;

    const hired =
      applications.filter(
        (app) => app.status === "HIRED"
      ).length;

    // ======================================
    // AVERAGE ATS SCORE
    // ======================================
    let averageATSScore = 0;

    if (applications.length > 0) {
      const totalATSScore =
        applications.reduce(
          (total, application) =>
            total +
            (application.atsScore || 0),
          0
        );

      averageATSScore = Math.round(
        totalATSScore /
          applications.length
      );
    }

    // ======================================
    // RESPONSE
    // ======================================
    res.status(200).json({
      success: true,

      dashboard: {
        applications: {
          total: totalApplications,
          applied,
          shortlisted,
          rejected,
          interview,
          hired,
        },

        averageATSScore,
      },
    });
  } catch (error) {
    console.error(
      "Candidate Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCandidateDashboard,
};