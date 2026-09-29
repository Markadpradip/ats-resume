const express = require("express");

const {
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
  

} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all users - ADMIN ONLY
router.get(
  "/users",
  protect,
  authorizeRoles("ADMIN"),
  getAllUsers
);
// Get user by ID - ADMIN ONLY
router.get(
  "/users/:id",
  protect,
  authorizeRoles("ADMIN"),
  getUserById
);
// Deactivate user - ADMIN ONLY
router.patch(
  "/users/:id/deactivate",
  protect,
  authorizeRoles("ADMIN"),
  deactivateUser
);
// Activate user - ADMIN ONLY
router.patch(
  "/users/:id/activate",
  protect,
  authorizeRoles("ADMIN"),
  activateUser
);
// Delete user - ADMIN ONLY
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteUser
);
// Get admin dashboard - ADMIN ONLY
router.get(
  "/dashboard",
  protect,
  authorizeRoles("ADMIN"),
  getAdminDashboard
);
// Get top candidates - ADMIN ONLY
router.get(
  "/top-candidates",
  protect,
  authorizeRoles("ADMIN"),
  getTopCandidates
);
// Get job analytics - ADMIN ONLY
router.get(
  "/job-analytics",
  protect,
  authorizeRoles("ADMIN"),
  getJobAnalytics
);
// Get application status analytics - ADMIN ONLY
router.get(
  "/application-status",
  protect,
  authorizeRoles("ADMIN"),
  getApplicationStatusAnalytics
);
router.get(
  "/recent-applications",
  protect,
  authorizeRoles("ADMIN"),
  getRecentApplications
);


module.exports = router;