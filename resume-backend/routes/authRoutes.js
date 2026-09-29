const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  register,
  login,
    getMe,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get(
  "/candidate-test",
  protect,
  authorizeRoles("CANDIDATE"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Candidate access granted",
      user: req.user,
    });
  }
);

router.get(
  "/recruiter-test",
  protect,
  authorizeRoles("RECRUITER"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Recruiter access granted",
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  protect,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  }
);

module.exports = router;