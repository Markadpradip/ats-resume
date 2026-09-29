const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // ======================================
    // CHECK AUTHORIZATION HEADER
    // ======================================

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      const error = new Error(
        "Not authorized. No token provided"
      );

      error.statusCode = 401;

      return next(error);
    }

    // ======================================
    // GET TOKEN
    // ======================================

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      const error = new Error(
        "Not authorized. No token provided"
      );

      error.statusCode = 401;

      return next(error);
    }

    // ======================================
    // VERIFY TOKEN
    // ======================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ======================================
    // FIND USER
    // ======================================

    const user =
      await User.findById(
        decoded.userId
      ).select("-password");

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 401;

      return next(error);
    }

    // ======================================
    // CHECK ACTIVE ACCOUNT
    // ======================================

    if (!user.isActive) {
      const error = new Error(
        "Your account has been deactivated"
      );

      error.statusCode = 403;

      return next(error);
    }

    // ======================================
    // ATTACH USER TO REQUEST
    // ======================================

    req.user = user;

    next();

  } catch (error) {

    // ======================================
    // INVALID JWT
    // ======================================

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid token";
    }

    // ======================================
    // EXPIRED JWT
    // ======================================

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message =
        "Token has expired";
    }

    next(error);
  }
};

module.exports = {
  protect,
};