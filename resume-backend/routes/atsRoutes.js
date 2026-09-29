const express = require("express");

const router = express.Router();

const {
  calculateATSScore,
} = require("../controllers/atsController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get(
  "/score/:jobId",
  protect,
  authorizeRoles("CANDIDATE"),
  calculateATSScore
);

module.exports = router;