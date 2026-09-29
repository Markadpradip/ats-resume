const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// ======================================
// GET ALL USERS
// ======================================
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      count: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// GET USER BY ID
// ======================================
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// DEACTIVATE USER
// ======================================
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Prevent admin from deactivating another admin
    if (user.role === "ADMIN") {
      res.status(403);
      throw new Error("Admin account cannot be deactivated");
    }

    user.isActive = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// ACTIVATE USER
// ======================================
const activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isActive = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
// ======================================
// DELETE USER
// ======================================
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Prevent admin from deleting an admin account
    if (user.role === "ADMIN") {
      res.status(403);
      throw new Error("Admin account cannot be deleted");
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// ADMIN DASHBOARD
// ======================================

const getAdminDashboard = async (req, res) => {
  try {
    // ======================================
    // USER COUNTS
    // ======================================

    const totalUsers = await User.countDocuments();

    const totalCandidates = await User.countDocuments({
      role: "CANDIDATE",
    });

    const totalRecruiters = await User.countDocuments({
      role: "RECRUITER",
    });

    const totalAdmins = await User.countDocuments({
      role: "ADMIN",
    });

    // ======================================
    // JOB COUNTS
    // ======================================

    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      status: "ACTIVE",
    });

    const closedJobs = await Job.countDocuments({
      status: "CLOSED",
    });

    // ======================================
    // APPLICATION COUNTS
    // ======================================

    const totalApplications =
      await Application.countDocuments();

    const appliedApplications =
      await Application.countDocuments({
        status: "APPLIED",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "SHORTLISTED",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "REJECTED",
      });

    const interviewApplications =
      await Application.countDocuments({
        status: "INTERVIEW",
      });

    const hiredApplications =
      await Application.countDocuments({
        status: "HIRED",
      });

    // ======================================
    // AVERAGE ATS SCORE
    // ======================================

    const atsResult =
      await Application.aggregate([
        {
          $group: {
            _id: null,
            averageATSScore: {
              $avg: "$atsScore",
            },
          },
        },
      ]);

    const averageATSScore =
      atsResult.length > 0
        ? Math.round(
            atsResult[0].averageATSScore
          )
        : 0;

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,

      dashboard: {
        users: {
          total: totalUsers,
          candidates: totalCandidates,
          recruiters: totalRecruiters,
          admins: totalAdmins,
        },

        jobs: {
          total: totalJobs,
          active: activeJobs,
          closed: closedJobs,
        },

        applications: {
          total: totalApplications,
          applied: appliedApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          interview: interviewApplications,
          hired: hiredApplications,
        },

        averageATSScore,
      },
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTopCandidates = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "name email phone")
      .populate("job", "title company")
      .sort({
        atsScore: -1,
        createdAt: 1,
      })
      .limit(10);

    res.status(200).json({
      success: true,
      count: applications.length,
      candidates: applications.map((application, index) => ({
        rank: index + 1,
        applicationId: application._id,
        candidate: application.candidate,
        job: application.job,
        atsScore: application.atsScore,
        matchedSkills: application.matchedSkills,
        missingSkills: application.missingSkills,
        status: application.status,
        appliedAt: application.createdAt,
      })),
    });
  } catch (error) {
    console.error(
      "Top Candidates Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// JOB-WISE APPLICATION ANALYTICS
// ======================================

const getJobAnalytics = async (req, res) => {
  try {
    const analytics = await Application.aggregate([
      {
        $group: {
          _id: "$job",

          totalApplications: {
            $sum: 1,
          },

          averageATSScore: {
            $avg: "$atsScore",
          },

          shortlisted: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "SHORTLISTED",
                  ],
                },
                1,
                0,
              ],
            },
          },

          rejected: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "REJECTED",
                  ],
                },
                1,
                0,
              ],
            },
          },

          interview: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "INTERVIEW",
                  ],
                },
                1,
                0,
              ],
            },
          },

          hired: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "HIRED",
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },

      {
        $unwind: "$job",
      },

      {
        $project: {
          _id: 0,

          jobId: "$job._id",

          title: "$job.title",

          company: "$job.company",

          location: "$job.location",

          totalApplications: 1,

          averageATSScore: {
            $round: [
              "$averageATSScore",
              0,
            ],
          },

          shortlisted: 1,

          rejected: 1,

          interview: 1,

          hired: 1,
        },
      },

      {
        $sort: {
          totalApplications: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: analytics.length,
      analytics,
    });
  } catch (error) {
    console.error(
      "Job Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// APPLICATION STATUS ANALYTICS
// ======================================

const getApplicationStatusAnalytics = async (
  req,
  res
) => {
  try {
    const analytics =
      await Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const statusCounts = {
      APPLIED: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
      INTERVIEW: 0,
      HIRED: 0,
    };

    analytics.forEach((item) => {
      statusCounts[item._id] =
        item.count;
    });

    res.status(200).json({
      success: true,
      analytics: statusCounts,
    });
  } catch (error) {
    console.error(
      "Application Status Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// RECENT APPLICATIONS
// ======================================

const getRecentApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "candidate",
          "name email phone"
        )
        .populate(
          "job",
          "title company location"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    res.status(200).json({
      success: true,
      count: applications.length,

      applications: applications.map(
        (application) => ({
          applicationId:
            application._id,

          candidate:
            application.candidate,

          job:
            application.job,

          atsScore:
            application.atsScore,

          matchedSkills:
            application.matchedSkills,

          missingSkills:
            application.missingSkills,

          status:
            application.status,

          appliedAt:
            application.createdAt,
        })
      ),
    });
  } catch (error) {
    console.error(
      "Recent Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// ACTIVATE / DEACTIVATE USER
// ======================================

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Admin cannot deactivate another admin
    if (user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin account status cannot be changed",
      });
    }

    user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Update User Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deactivateUser,
  activateUser,
  deleteUser,
  getAdminDashboard,
  getTopCandidates,
  getJobAnalytics,
  getApplicationStatusAnalytics,
  getRecentApplications,
}
