const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ===============================
// REGISTER
// ===============================
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      res.status(400);
      throw new Error(
        "Name, email and password are required"
      );
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409);
      throw new Error(
        "User with this email already exists"
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: role || "CANDIDATE",
      isActive: true,
    });

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },

        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// LOGIN
// ===============================
const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password) {
      res.status(400);
      throw new Error(
        "Email and password are required"
      );
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(401);
      throw new Error(
        "Invalid email or password"
      );
    }

    // Check password
    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatch) {
      res.status(401);
      throw new Error(
        "Invalid email or password"
      );
    }

    // ===============================
    // CHECK ACCOUNT STATUS
    // ===============================

    if (user.isActive === false) {
      res.status(403);
      throw new Error(
        "Your account has been deactivated"
      );
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );

    // Response
    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },

        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// GET CURRENT USER
// ===============================
const getMe = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      success: true,
      message:
        "User information fetched successfully",

      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  register,
  login,
  getMe,
};