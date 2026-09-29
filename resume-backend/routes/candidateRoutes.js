const express = require("express");

const {
  createOrUpdateProfile,
  getMyProfile,
  deleteMyProfile,
  uploadResume,
  getCandidateDashboard,
} = require("../controllers/candidateController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
  uploadResume: uploadResumeMiddleware,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// ======================================
// CREATE / UPDATE CANDIDATE PROFILE
// ======================================

router.put(
  "/profile",
  protect,
  authorizeRoles("CANDIDATE"),
  createOrUpdateProfile
);

// ======================================
// GET MY CANDIDATE PROFILE
// ======================================

router.get(
  "/profile",
  protect,
  authorizeRoles("CANDIDATE"),
  getMyProfile
);

// ======================================
// CANDIDATE DASHBOARD
// ======================================

router.get(
  "/dashboard",
  protect,
  authorizeRoles("CANDIDATE"),
  getCandidateDashboard
);

// ======================================
// DELETE MY CANDIDATE PROFILE
// ======================================

router.delete(
  "/profile",
  protect,
  authorizeRoles("CANDIDATE"),
  deleteMyProfile
);

// ======================================
// UPLOAD RESUME
// ======================================

router.post(
  "/resume",
  protect,
  authorizeRoles("CANDIDATE"),
  uploadResumeMiddleware,
  uploadResume
);

module.exports = router;