const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Application = require("../models/Application");
const Job = require("../models/job");
const CandidateProfile = require("../models/CandidateProfile");

const { extractResumeText } = require("../services/resumeParser");

const {
  extractSkills,
  normalizeSkills,
} = require("../services/skillExtractor");

const {
  calculateATSScore,
} = require("../services/atsScorer");

// ======================================
// APPLY FOR JOB
// ======================================
const applyForJob = async (req, res) => {
  console.log("🔥 APPLY CONTROLLER REACHED");

  let uploadedFilePath = null;

  try {
    console.log("========== APPLY START ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { jobId, coverLetter } = req.body;

    // ======================================
    // CHECK JOB ID
    // ======================================
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // ======================================
    // CHECK VALID JOB ID
    // ======================================
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID",
      });
    }

    // ======================================
    // CHECK RESUME
    // ======================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    // ======================================
    // GET ABSOLUTE FILE PATH
    // ======================================
    uploadedFilePath = path.resolve(req.file.path);

    console.log("========== RESUME DEBUG ==========");
    console.log("Original Name:", req.file.originalname);
    console.log("Saved Path:", uploadedFilePath);
    console.log(
      "File Exists:",
      fs.existsSync(uploadedFilePath)
    );
    console.log("==================================");

    // ======================================
    // CHECK FILE EXISTS
    // ======================================
    if (!fs.existsSync(uploadedFilePath)) {
      return res.status(500).json({
        success: false,
        message:
          "Resume file was uploaded but could not be found on server",
      });
    }

    // ======================================
    // CHECK FILE SIZE
    // ======================================
    const fileStats = fs.statSync(uploadedFilePath);

    console.log(
      "Resume file size:",
      fileStats.size,
      "bytes"
    );

    if (fileStats.size === 0) {
      fs.unlinkSync(uploadedFilePath);

      return res.status(400).json({
        success: false,
        message: "Uploaded resume file is empty",
      });
    }

    // ======================================
    // FIND JOB
    // ======================================
    const job = await Job.findById(jobId);

    console.log(
      "🔥 Job found:",
      job?._id?.toString()
    );

    if (!job) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ======================================
    // CHECK JOB STATUS
    // ======================================
    if (job.status !== "ACTIVE") {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(400).json({
        success: false,
        message:
          "This job is no longer accepting applications",
      });
    }

    // ======================================
    // DUPLICATE APPLICATION CHECK
    // ======================================
    const existingApplication =
      await Application.findOne({
        job: job._id,
        candidate: req.user._id,
      });

    console.log(
      "🔥 Duplicate check:",
      !!existingApplication
    );

    if (existingApplication) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this job",
      });
    }

    // ======================================
    // PDF EXTRACTION
    // ======================================
    console.log("🔥 Starting PDF extraction...");

    const resumeText =
      await extractResumeText(uploadedFilePath);

    console.log("🔥 PDF extraction complete");

    console.log(
      "🔥 Resume text length:",
      resumeText?.length || 0
    );

    if (!resumeText || !resumeText.trim()) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }

      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from resume PDF",
      });
    }

    // ======================================
    // EXTRACT RESUME SKILLS
    // ======================================
    const resumeSkills =
      normalizeSkills(
        extractSkills(resumeText)
      );

    console.log(
      "🔥 Resume skills:",
      resumeSkills
    );

    // ======================================
    // CANDIDATE PROFILE
    // ======================================
    const candidateProfile =
      await CandidateProfile.findOne({
        user: req.user._id,
      });

    console.log(
      "🔥 Candidate profile loaded:",
      !!candidateProfile
    );

    const experience =
      candidateProfile?.experience || [];

    const education =
      candidateProfile?.education || [];

    const projects =
      candidateProfile?.projects || [];

    // ======================================
    // JOB SKILLS
    // ======================================
    const jobSkills =
      normalizeSkills(
        (job.skills || []).map((skill) =>
          String(skill)
            .toLowerCase()
            .trim()
        )
      );

    console.log(
      "🔥 Job skills:",
      jobSkills
    );

    // ======================================
    // ATS CALCULATION
    // ======================================
    console.log(
      "🔥 Starting ATS calculation..."
    );

    const atsResult =
      calculateATSScore({
        jobSkills,
        resumeSkills,
        experience,
        education,
        projects,
        resumeText,
      });

    console.log(
      "🔥 ATS calculation complete:",
      atsResult
    );

    const {
  atsScore,
  skillScore,
  keywordScore,
  sectionScore,
  atsParsabilityScore,
  experienceScore,
  educationScore,
  projectQualityScore,
  matchedSkills,
  missingSkills,
  matchedKeywords,
  missingKeywords,
} = atsResult;

    // ======================================
    // CREATE APPLICATION
    // ======================================
    console.log(
      "🔥 Creating application..."
    );

    const application =
      await Application.create({
        job: job._id,
        candidate: req.user._id,

        resume: uploadedFilePath,

        coverLetter: coverLetter || "",

        atsScore,
atsBreakdown: {
  skillScore,
  keywordScore,
  sectionScore,
  atsParsabilityScore,
  experienceScore,
  educationScore,
  projectQualityScore,
},

        matchedSkills:
          matchedSkills || [],

        missingSkills:
          missingSkills || [],
      });

    console.log(
      "🔥🔥 APPLICATION CREATED:",
      application._id.toString()
    );

    console.log(
      "🔥🔥 APPLICATION JOB ID:",
      application.job.toString()
    );

    console.log(
      "🔥🔥 APPLICATION CANDIDATE ID:",
      application.candidate.toString()
    );

    // ======================================
    // RESPONSE
    // ======================================
    return res.status(201).json({
      success: true,

      message:
        "Application submitted successfully",

     application: {
  id: application._id,
  job: application.job,
  candidate: application.candidate,
  resume: application.resume,

  atsScore: application.atsScore,

  atsBreakdown:
    application.atsBreakdown,

  matchedSkills:
    application.matchedSkills,

  missingSkills:
    application.missingSkills,

  matchedKeywords:
    application.matchedKeywords,

  missingKeywords:
    application.missingKeywords,

  status: application.status,
  appliedAt: application.createdAt,
},
    });

  } catch (error) {
    console.error(
      "========== APPLY ERROR =========="
    );

    console.error(error);

    // ======================================
    // DELETE UPLOADED FILE IF ERROR
    // ======================================
    if (
      uploadedFilePath &&
      fs.existsSync(uploadedFilePath)
    ) {
      try {
        fs.unlinkSync(uploadedFilePath);

        console.log(
          "Uploaded resume deleted after error"
        );
      } catch (deleteError) {
        console.error(
          "Could not delete uploaded resume:",
          deleteError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET MY APPLICATIONS
// ======================================
const getMyApplications = async (req, res) => {
  try {
    const {
      status,
      minScore,
      maxScore,
      page = 1,
      limit = 10,
    } = req.query;

    // ======================================
    // PAGINATION
    // ======================================
    const pageNumber =
      Math.max(parseInt(page) || 1, 1);

    const limitNumber =
      Math.min(
        Math.max(parseInt(limit) || 10, 1),
        100
      );

    const skip =
      (pageNumber - 1) * limitNumber;

    // ======================================
    // BUILD QUERY
    // ======================================
    const query = {
      candidate: req.user._id,
    };

    // ======================================
    // STATUS FILTER
    // ======================================
    if (status) {
      query.status = status.toUpperCase();
    }

    // ======================================
    // ATS SCORE FILTER
    // ======================================
    if (
      minScore !== undefined ||
      maxScore !== undefined
    ) {
      query.atsScore = {};

      if (
        minScore !== undefined &&
        !isNaN(minScore)
      ) {
        query.atsScore.$gte =
          Number(minScore);
      }

      if (
        maxScore !== undefined &&
        !isNaN(maxScore)
      ) {
        query.atsScore.$lte =
          Number(maxScore);
      }
    }

    // ======================================
    // TOTAL
    // ======================================
    const totalApplications =
      await Application.countDocuments(query);

    // ======================================
    // GET APPLICATIONS
    // ======================================
    const applications =
      await Application.find(query)
        .populate(
          "job",
          "title company description location salary jobType status skills"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber);

    const totalPages =
      Math.ceil(
        totalApplications / limitNumber
      );

    // ======================================
    // RESPONSE
    // ======================================
    res.status(200).json({
      success: true,

      count: applications.length,

      totalApplications,

      currentPage: pageNumber,

      totalPages,

      hasNextPage:
        pageNumber < totalPages,

      hasPreviousPage:
        pageNumber > 1,

      applications,
    });

  } catch (error) {
    console.error(
      "Get My Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET RECRUITER APPLICATIONS
// ======================================
const getRecruiterApplications =
  async (req, res) => {
    try {
      const {
        search,
        status,
        minScore,
        maxScore,
        jobId,
        page = 1,
        limit = 10,
      } = req.query;

      // ======================================
      // PAGINATION VALIDATION
      // ======================================
      const pageNumber =
        Number(page);

      const limitNumber =
        Number(limit);

      if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Page must be a positive integer",
        });
      }

      if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Limit must be between 1 and 100",
        });
      }

      // ======================================
      // SCORE VALIDATION
      // ======================================
      if (
        minScore !== undefined &&
        (
          String(minScore).trim() === "" ||
          isNaN(minScore) ||
          Number(minScore) < 0 ||
          Number(minScore) > 100
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "minScore must be between 0 and 100",
        });
      }

      if (
        maxScore !== undefined &&
        (
          String(maxScore).trim() === "" ||
          isNaN(maxScore) ||
          Number(maxScore) < 0 ||
          Number(maxScore) > 100
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "maxScore must be between 0 and 100",
        });
      }

      if (
        minScore !== undefined &&
        maxScore !== undefined &&
        Number(minScore) > Number(maxScore)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "minScore cannot be greater than maxScore",
        });
      }

      // ======================================
      // PAGINATION
      // ======================================
      const skip =
        (pageNumber - 1) *
        limitNumber;

      // ======================================
      // FIND RECRUITER JOBS
      // ======================================
      const recruiterJobs =
        await Job.find({
          recruiter: req.user._id,
        }).select("_id");

      const jobIds =
        recruiterJobs.map(
          (job) => job._id
        );

      console.log(
        "🔥 Recruiter Job IDs:",
        jobIds.map((id) => id.toString())
      );

      // ======================================
      // SPECIFIC JOB FILTER
      // ======================================
      if (jobId) {
        if (
          !mongoose.Types.ObjectId.isValid(
            jobId
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid Job ID",
          });
        }

        const recruiterJob =
          await Job.findOne({
            _id: jobId,
            recruiter: req.user._id,
          }).select("_id");

        if (!recruiterJob) {
          return res.status(404).json({
            success: false,
            message:
              "Job not found or you are not authorized to view its applications",
          });
        }
      }

      // ======================================
      // APPLICATION QUERY
      // ======================================
      const query = jobId
        ? {
            job: jobId,
          }
        : {
            job: {
              $in: jobIds,
            },
          };

      // ======================================
      // STATUS FILTER
      // ======================================
      if (status) {
        query.status =
          status.toUpperCase();
      }

      // ======================================
      // SCORE FILTER
      // ======================================
      if (
        minScore !== undefined ||
        maxScore !== undefined
      ) {
        query.atsScore = {};

        if (
          minScore !== undefined
        ) {
          query.atsScore.$gte =
            Number(minScore);
        }

        if (
          maxScore !== undefined
        ) {
          query.atsScore.$lte =
            Number(maxScore);
        }
      }

      // ======================================
      // 🔥 DEBUG ALL APPLICATIONS
      // ======================================
      console.log(
        "================================="
      );

      console.log(
        "🔥 RECRUITER APPLICATION DEBUG"
      );

      console.log(
        "🔥 Job ID from frontend:",
        jobId
      );

      console.log(
        "🔥 Recruiter ID:",
        req.user._id.toString()
      );

      console.log(
        "🔥 Mongo Query:",
        query
      );

      const allApplications =
        await Application.find({})
          .select(
            "_id job candidate status atsScore createdAt"
          );

      console.log(
        "🔥🔥 ALL APPLICATIONS IN DATABASE:"
      );

      allApplications.forEach(
        (app) => {
          console.log({
            applicationId:
              app._id.toString(),

            jobId:
              app.job?.toString(),

            candidateId:
              app.candidate?.toString(),

            status:
              app.status,

            atsScore:
              app.atsScore,

            createdAt:
              app.createdAt,
          });
        }
      );

      // ======================================
      // GET APPLICATIONS
      // ======================================
      let applications =
        await Application.find(query)
          .populate({
            path: "job",
            select:
              "title company location salary jobType status skills",
          })
          .populate(
            "candidate",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          });

      console.log(
        "🔥 Applications Found:",
        applications.length
      );

      applications.forEach(
        (application) => {
          console.log(
            "🔥 Application:",
            application._id.toString(),
            "Job:",
            application.job?._id?.toString(),
            "Candidate:",
            application.candidate?.email
          );
        }
      );

      console.log(
        "================================="
      );

      // ======================================
      // SEARCH
      // ======================================
      if (search) {
        const searchText =
          search.toLowerCase().trim();

        applications =
          applications.filter(
            (application) => {
              const candidate =
                application.candidate;

              const job =
                application.job;

              return (
                candidate?.name
                  ?.toLowerCase()
                  .includes(searchText) ||

                candidate?.email
                  ?.toLowerCase()
                  .includes(searchText) ||

                job?.title
                  ?.toLowerCase()
                  .includes(searchText) ||

                job?.company
                  ?.toLowerCase()
                  .includes(searchText)
              );
            }
          );
      }

      // ======================================
      // SORT BY ATS SCORE
      // ======================================
      applications.sort(
        (a, b) => {
          if (
            b.atsScore !==
            a.atsScore
          ) {
            return (
              b.atsScore -
              a.atsScore
            );
          }

          return (
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
          );
        }
      );

      // ======================================
      // TOTAL
      // ======================================
      const totalApplications =
        applications.length;

      const totalPages =
        Math.ceil(
          totalApplications /
            limitNumber
        );

      // ======================================
      // PAGINATION
      // ======================================
      const paginatedApplications =
        applications.slice(
          skip,
          skip + limitNumber
        );

      // ======================================
      // RESPONSE
      // ======================================
      return res.status(200).json({
        success: true,

        count:
          paginatedApplications.length,

        totalApplications,

        currentPage:
          pageNumber,

        totalPages,

        hasNextPage:
          pageNumber < totalPages,

        hasPreviousPage:
          pageNumber > 1,

        applications:
          paginatedApplications.map(
            (
              application,
              index
            ) => ({
              rank:
                skip +
                index +
                1,

              applicationId:
                application._id,

              candidate:
                application.candidate,

              job:
                application.job,

              status:
                application.status,

              atsScore:
                application.atsScore,

              matchedSkills:
                application.matchedSkills,

              missingSkills:
                application.missingSkills,

              resume:
                application.resume,

              coverLetter:
                application.coverLetter,

              appliedAt:
                application.createdAt,
            })
          ),
      });

    } catch (error) {
      console.error(
        "Get Recruiter Applications Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// UPDATE APPLICATION STATUS
// ======================================
const updateApplicationStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      // ======================================
      // ALLOWED STATUS
      // ======================================
      const allowedStatuses = [
        "APPLIED",
        "SHORTLISTED",
        "REJECTED",
        "INTERVIEW",
        "HIRED",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status",
        });
      }

      // ======================================
      // FIND APPLICATION
      // ======================================
      const application =
        await Application.findById(
          req.params.id
        ).populate(
          "job",
          "title company recruiter"
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      // ======================================
      // CHECK JOB
      // ======================================
      if (!application.job) {
        return res.status(404).json({
          success: false,
          message:
            "Job associated with application not found",
        });
      }

      // ======================================
      // CHECK OWNERSHIP
      // ======================================
      if (
        application.job.recruiter.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only manage applications for your jobs",
        });
      }

      // ======================================
      // UPDATE
      // ======================================
      application.status =
        status;

      await application.save();

      // ======================================
      // RESPONSE
      // ======================================
      return res.status(200).json({
        success: true,

        message:
          `Application status updated to ${status}`,

        application,
      });

    } catch (error) {
      console.error(
        "Update Application Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// GET APPLICATION BY ID
// ======================================
const getApplicationById =
  async (req, res) => {
    try {
      // ======================================
      // CHECK VALID MONGODB ID
      // ======================================
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application ID",
        });
      }

      // ======================================
      // FIND APPLICATION
      // ======================================
      const application =
        await Application.findById(
          req.params.id
        )
          .populate(
            "job",
            "title company description location salary jobType status skills recruiter"
          )
          .populate(
            "candidate",
            "name email phone"
          );

      // ======================================
      // NOT FOUND
      // ======================================
      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      // ======================================
      // CANDIDATE OWNERSHIP
      // ======================================
      if (
        req.user.role === "CANDIDATE" &&
        (
          !application.candidate ||
          application.candidate._id.toString() !==
            req.user._id.toString()
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only view your own application",
        });
      }

      // ======================================
      // RECRUITER OWNERSHIP
      // ======================================
      if (req.user.role === "RECRUITER") {
        if (
          !application.job ||
          !application.job.recruiter ||
          application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You can only view applications for your jobs",
          });
        }
      }

      // ======================================
      // RESPONSE
      // ======================================
      return res.status(200).json({
        success: true,
        application,
      });

    } catch (error) {
      console.error(
        "Get Application By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// EXPORTS
// ======================================
module.exports = {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationById,
};