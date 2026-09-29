const express = require("express");

const {
  createOrUpdateProfile,
  getMyProfile,
  deleteMyProfile,
} = require("../controllers/recruiterController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Create / Update Recruiter Profile
router.put(
  "/profile",
  protect,
  authorizeRoles("RECRUITER"),
  createOrUpdateProfile
);

// Get My Recruiter Profile
router.get(
  "/profile",
  protect,
  authorizeRoles("RECRUITER"),
  getMyProfile
);

// Delete My Recruiter Profile
router.delete(
  "/profile",
  protect,
  authorizeRoles("RECRUITER"),
  deleteMyProfile
);

module.exports = router;