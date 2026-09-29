const express = require("express");

const router = express.Router();

const {
  getCandidateDashboard,
} = require(
  "../controllers/candidateDashboardController"
);

const { protect } = require(
  "../middleware/authMiddleware"
);

const { authorizeRoles } = require(
  "../middleware/roleMiddleware"
);

// ======================================
// CANDIDATE DASHBOARD
// ======================================

router.get(
  "/",
  protect,
  authorizeRoles("CANDIDATE"),
  getCandidateDashboard
);

module.exports = router;