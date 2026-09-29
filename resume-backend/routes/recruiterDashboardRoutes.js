const express = require("express");

const router = express.Router();

const {
  getRecruiterDashboard,
} = require(
  "../controllers/recruiterDashboardController"
);

const { protect } = require(
  "../middleware/authMiddleware"
);

const { authorizeRoles } = require(
  "../middleware/roleMiddleware"
);

// ======================================
// RECRUITER DASHBOARD
// ======================================

router.get(
  "/",
  protect,
  authorizeRoles("RECRUITER"),
  getRecruiterDashboard
);

module.exports = router;