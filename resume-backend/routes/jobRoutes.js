const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {
  createJob,
  getJobLocations,
  getAllJobs,
  getMyJobs,
  getJobById,
  deleteJob,
  updateJobStatus,
} = require("../controllers/jobController");

// ======================================
// MIDDLEWARE
// ======================================

const { protect } = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

// ======================================
// CREATE JOB
// RECRUITER
// ======================================

router.post(
  "/",
  protect,
  authorizeRoles("RECRUITER"),
  createJob
);

// ======================================
// GET JOB LOCATIONS
// ======================================

router.get(
  "/locations",
  protect,
  getJobLocations
);

// ======================================
// GET MY JOBS
// RECRUITER
// IMPORTANT:
// This route MUST come before /:id
// ======================================

router.get(
  "/my-jobs",
  protect,
  authorizeRoles("RECRUITER"),
  getMyJobs
);

// ======================================
// GET ALL JOBS
// CANDIDATE
// ======================================

router.get(
  "/",
  protect,
  getAllJobs
);

// ======================================
// GET SINGLE JOB
// ======================================

router.get(
  "/:id",
  protect,
  getJobById
);

// ======================================
// DELETE JOB
// ADMIN
// ======================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteJob
);

// ======================================
// UPDATE JOB STATUS
// ADMIN
// ======================================

router.put(
  "/:id/status",
  protect,
  authorizeRoles("ADMIN"),
  updateJobStatus
);

module.exports = router;