const RecruiterProfile = require("../models/RecruiterProfile");
const User = require("../models/User");

// ======================================
// CREATE / UPDATE RECRUITER PROFILE
// ======================================
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      designation,
      companyName,
      companyWebsite,
      companyDescription,
      companyLocation,
      companyLogo,
    } = req.body;

    const profileData = {
      user: userId,
      fullName,
      email: req.user.email,
      phone,
      designation,
      companyName,
      companyWebsite,
      companyDescription,
      companyLocation,
      companyLogo,
    };

    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(userId, {
      name: fullName || req.user.name,
      phone: phone || req.user.phone,
    });

    res.status(200).json({
      success: true,
      message: "Recruiter profile saved successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET MY RECRUITER PROFILE
// ======================================
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await RecruiterProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    if (!profile) {
      res.status(404);
      throw new Error("Recruiter profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Recruiter profile fetched successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE MY RECRUITER PROFILE
// ======================================
const deleteMyProfile = async (req, res, next) => {
  try {
    const profile = await RecruiterProfile.findOneAndDelete({
      user: req.user._id,
    });

    if (!profile) {
      res.status(404);
      throw new Error("Recruiter profile not found");
    }

    res.status(200).json({
      success: true,
      message: "Recruiter profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  deleteMyProfile,
};