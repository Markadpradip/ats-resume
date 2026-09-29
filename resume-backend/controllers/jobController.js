const mongoose = require("mongoose");
const Job = require("../models/job");
// ======================================
// CREATE JOB
// ======================================

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      skills,
      location,
      salary,
      jobType,
    } = req.body;

    // ======================================
    // VALIDATE BASIC FIELDS
    // ======================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    if (!company?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    // ======================================
    // VALIDATE LOCATION
    // ======================================

    if (
      !location ||
      typeof location !== "object" ||
      !location.country?.trim() ||
      !location.state?.trim() ||
      !location.city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Country, state and city are required",
      });
    }

    // ======================================
    // VALIDATE JOB TYPE
    // ======================================

    const allowedJobTypes = [
      "FULL_TIME",
      "PART_TIME",
      "INTERNSHIP",
      "CONTRACT",
    ];

    const finalJobType = jobType
      ? jobType.toUpperCase()
      : "FULL_TIME";

    if (!allowedJobTypes.includes(finalJobType)) {
      return res.status(400).json({
        success: false,
        message:
          "Job type must be FULL_TIME, PART_TIME, INTERNSHIP or CONTRACT",
      });
    }

    // ======================================
    // CREATE JOB
    // ======================================

    const job = await Job.create({
      recruiter: req.user.id,

      title: title.trim(),

      company: company.trim(),

      description: description.trim(),

      skills: Array.isArray(skills)
        ? skills
            .map((skill) => String(skill).trim())
            .filter(Boolean)
        : [],

      location: {
        country: location.country.trim(),
        state: location.state.trim(),
        city: location.city.trim(),
      },

      salary: salary?.trim() || "",

      jobType: finalJobType,

      status: "ACTIVE",
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET JOB LOCATIONS
// ======================================

const getJobLocations = async (req, res) => {
  try {
    const jobs = await Job.find(
      {
        status: "ACTIVE",
      },
      {
        "location.country": 1,
        "location.state": 1,
        "location.city": 1,
      }
    )
      .lean();

    // ======================================
    // COUNTRIES
    // ======================================

    const countries = [
      ...new Set(
        jobs
          .map((job) =>
            job.location?.country?.trim()
          )
          .filter(Boolean)
      ),
    ].sort();

    // ======================================
    // STATES
    // ======================================

    const states = [
      ...new Set(
        jobs
          .map((job) =>
            job.location?.state?.trim()
          )
          .filter(Boolean)
      ),
    ].sort();

    // ======================================
    // CITIES
    // ======================================

    const cities = [
      ...new Set(
        jobs
          .map((job) =>
            job.location?.city?.trim()
          )
          .filter(Boolean)
      ),
    ].sort();

    // ======================================
    // FULL LOCATIONS
    // ======================================

    const locations = [
      ...new Set(
        jobs
          .map((job) => {
            const country =
              job.location?.country?.trim();

            const state =
              job.location?.state?.trim();

            const city =
              job.location?.city?.trim();

            if (!country || !state || !city) {
              return null;
            }

            return `${city}, ${state}, ${country}`;
          })
          .filter(Boolean)
      ),
    ].sort();

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      locations,
      countries,
      states,
      cities,
    });
  } catch (error) {
    console.error(
      "Get Job Locations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL / SEARCH / FILTER JOBS
// CANDIDATE
// ======================================

const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      country,
      state,
      city,
      skill,
      jobType,
      status = "ACTIVE",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // ======================================
    // STATUS
    // ======================================

    if (status) {
      query.status = status.toUpperCase();
    }

    // ======================================
    // SEARCH
    // ======================================

    if (search?.trim()) {
      const searchValue = search.trim();

      query.$or = [
        {
          title: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          company: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          skills: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "location.country": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "location.state": {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          "location.city": {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    // ======================================
    // COUNTRY
    // ======================================

    if (
      country?.trim() &&
      country.toUpperCase() !== "ALL"
    ) {
      query["location.country"] = {
        $regex: `^${country.trim()}$`,
        $options: "i",
      };
    }

    // ======================================
    // STATE
    // ======================================

    if (
      state?.trim() &&
      state.toUpperCase() !== "ALL"
    ) {
      query["location.state"] = {
        $regex: `^${state.trim()}$`,
        $options: "i",
      };
    }

    // ======================================
    // CITY
    // ======================================

    if (
      city?.trim() &&
      city.toUpperCase() !== "ALL"
    ) {
      query["location.city"] = {
        $regex: `^${city.trim()}$`,
        $options: "i",
      };
    }

    // ======================================
    // SKILL
    // ======================================

    if (skill?.trim()) {
      query.skills = {
        $regex: skill.trim(),
        $options: "i",
      };
    }

    // ======================================
    // JOB TYPE
    // ======================================

    if (
      jobType?.trim() &&
      jobType.toUpperCase() !== "ALL"
    ) {
      query.jobType = jobType.toUpperCase();
    }

    // ======================================
    // PAGINATION
    // ======================================

    const pageNumber = Math.max(
      parseInt(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    // ======================================
    // COUNT
    // ======================================

    const totalJobs =
      await Job.countDocuments(query);

    // ======================================
    // FETCH
    // ======================================

    const jobs = await Job.find(query)
      .populate(
        "recruiter",
        "name email company"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const totalPages =
      Math.ceil(
        totalJobs / limitNumber
      );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,

      count: jobs.length,

      totalJobs,

      currentPage: pageNumber,

      totalPages,

      hasNextPage:
        pageNumber < totalPages,

      hasPreviousPage:
        pageNumber > 1,

      jobs,
    });
  } catch (error) {
    console.error(
      "Get All Jobs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET MY JOBS
// RECRUITER
// ======================================

const getMyJobs = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // ======================================
    // BUILD QUERY
    // ======================================

    const query = {
      recruiter: req.user.id,
    };

    // ======================================
    // OPTIONAL STATUS FILTER
    // ======================================

    if (
      status &&
      status.toUpperCase() !== "ALL"
    ) {
      query.status = status.toUpperCase();
    }

    // ======================================
    // PAGINATION
    // ======================================

    const pageNumber = Math.max(
      parseInt(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    // ======================================
    // TOTAL
    // ======================================

    const totalJobs =
      await Job.countDocuments(query);

    // ======================================
    // FETCH MY JOBS
    // ======================================

    const jobs = await Job.find(query)
      .populate(
        "recruiter",
        "name email company"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const totalPages =
      Math.ceil(
        totalJobs / limitNumber
      );

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,

      count: jobs.length,

      totalJobs,

      currentPage: pageNumber,

      totalPages,

      hasNextPage:
        pageNumber < totalPages,

      hasPreviousPage:
        pageNumber > 1,

      jobs,
    });
  } catch (error) {
    console.error(
      "Get My Jobs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET JOB BY ID
// ======================================

const getJobById = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(
      req.params.id
    ).populate(
      "recruiter",
      "name email company"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(
      "Get Job By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE JOB
// ADMIN
// ======================================

const deleteJob = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE JOB STATUS
// ADMIN
// ======================================

const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      !["ACTIVE", "CLOSED"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be ACTIVE or CLOSED",
      });
    }

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      job,
    });
  } catch (error) {
    console.error(
      "Update Job Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  createJob,
  getJobLocations,
  getAllJobs,
  getMyJobs,
  getJobById,
  deleteJob,
  updateJobStatus,
};