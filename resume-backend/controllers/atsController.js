const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");

const calculateATSScore = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    const profile = await CandidateProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      res.status(404);
      throw new Error("Candidate profile not found");
    }

    const jobSkills = (job.skills || []).map((skill) =>
      skill.toLowerCase().trim()
    );

    const candidateSkills = (profile.skills || []).map((skill) =>
      skill.toLowerCase().trim()
    );

    const matchedSkills = jobSkills.filter((skill) =>
      candidateSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(
      (skill) => !candidateSkills.includes(skill)
    );

    const score =
      jobSkills.length > 0
        ? Math.round(
            (matchedSkills.length / jobSkills.length) * 100
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        jobId: job._id,
        jobTitle: job.title,
        candidateId: req.user._id,

        score,

        totalJobSkills: jobSkills.length,
        matchedCount: matchedSkills.length,
        missingCount: missingSkills.length,

        matchedSkills,
        missingSkills,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateATSScore,
};