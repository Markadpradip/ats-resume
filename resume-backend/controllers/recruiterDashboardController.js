const Job = require("../models/Job");
const Application = require("../models/Application");

// ======================================
// GET RECRUITER DASHBOARD
// ======================================
const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // ======================================
    // GET RECRUITER JOBS
    // ======================================
    const jobs = await Job.find({
      recruiter: recruiterId,
    }).select("_id status");

    const jobIds = jobs.map((job) => job._id);

    // ======================================
    // JOB COUNTS
    // ======================================
    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
      (job) => job.status === "ACTIVE"
    ).length;

    const closedJobs = jobs.filter(
      (job) => job.status === "CLOSED"
    ).length;

    // ======================================
    // APPLICATIONS
    // ======================================
    const applications =
      await Application.find({
        job: { $in: jobIds },
      }).select(
        "status atsScore"
      );

    const totalApplications =
      applications.length;

    // ======================================
    // APPLICATION STATUS COUNTS
    // ======================================
    const shortlisted =
      applications.filter(
        (app) =>
          app.status === "SHORTLISTED"
      ).length;

    const rejected =
      applications.filter(
        (app) =>
          app.status === "REJECTED"
      ).length;

    const interview =
      applications.filter(
        (app) =>
          app.status === "INTERVIEW"
      ).length;

    const hired =
      applications.filter(
        (app) =>
          app.status === "HIRED"
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
        jobs: {
          total: totalJobs,
          active: activeJobs,
          closed: closedJobs,
        },

        applications: {
          total: totalApplications,
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
      "Recruiter Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRecruiterDashboard,
};