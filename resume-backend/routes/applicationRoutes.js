const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationById,
} = require("../controllers/applicationController");

const {
  getResume,
} = require("../controllers/resumeController");

// ======================================
// MIDDLEWARE
// ======================================

const {
  uploadResume,
} = require("../middleware/uploadMiddleware");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

// ======================================
// DEBUG MIDDLEWARE
// ======================================

router.post(
  "/",
  protect,
  authorizeRoles("CANDIDATE"),

  uploadResume,

  (req, res, next) => {

    console.log(
      "🔥🔥 ROUTE AFTER UPLOAD REACHED"
    );

    console.log(
      "REQ BODY:",
      req.body
    );

    console.log(
      "REQ FILE:",
      req.file
    );

    next();
  },

  applyForJob
);
// ======================================
// CANDIDATE - MY APPLICATIONS
// ======================================

router.get(
  "/my",
  protect,
  authorizeRoles("CANDIDATE"),
  getMyApplications
);

// ======================================
// RECRUITER - APPLICATIONS
// ======================================

router.get(
  "/recruiter",
  protect,
  authorizeRoles("RECRUITER"),
  getRecruiterApplications
);

// ======================================
// RECRUITER - UPDATE STATUS
// ======================================

router.put(
  "/:id",
  protect,
  authorizeRoles("RECRUITER"),
  updateApplicationStatus
);

// ======================================
// GET RESUME
// ======================================

router.get(
  "/:id/resume",
  protect,
  getResume
);

// ======================================
// GET APPLICATION BY ID
// ======================================

router.get(
  "/:id",
  protect,
  getApplicationById
);

module.exports = router;