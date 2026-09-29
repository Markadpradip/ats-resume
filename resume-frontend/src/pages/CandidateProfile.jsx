import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CandidateProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH CANDIDATE PROFILE
  // ======================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          "/candidates/profile"
        );

        console.log(
          "Candidate Profile:",
          response.data
        );

        if (response.data.success) {
          setProfile(
            response.data.data.profile
          );
        }
      } catch (error) {
        console.error(
          "Candidate profile error:",
          error
        );

        if (
          error.response?.status === 404
        ) {
          setProfile(null);
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-lg text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-red-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // RESUME DATA
  // ======================================
  const resume = profile?.resume;

  const atsScore =
    resume?.atsScore || 0;

  const atsBreakdown =
    resume?.atsBreakdown || {};

  const extractedSkills =
    resume?.extractedSkills || [];

  // ======================================
  // MAIN UI
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Candidate Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your profile, resume and ATS
              performance.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/candidate/upload-resume"
              )
            }
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500"
          >
            Upload New Resume
          </button>

        </div>

        {/* ======================================
            PROFILE INFORMATION
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-white">
            Profile Information
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Name */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Full Name
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {profile?.fullName ||
                  "Not added"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {profile?.email ||
                  profile?.user?.email ||
                  "Not available"}
              </p>
            </div>

            {/* Phone */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Phone
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {profile?.phone ||
                  profile?.user?.phone ||
                  "Not added"}
              </p>
            </div>

            {/* Location */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Location
              </p>

              <p className="mt-2 text-sm text-slate-200">
                {profile?.location ||
                  "Not added"}
              </p>
            </div>

            {/* GitHub */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                GitHub
              </p>

              <p className="mt-2 break-all text-sm text-indigo-400">
                {profile?.github ||
                  "Not added"}
              </p>
            </div>

            {/* LinkedIn */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                LinkedIn
              </p>

              <p className="mt-2 break-all text-sm text-indigo-400">
                {profile?.linkedin ||
                  "Not added"}
              </p>
            </div>

          </div>

          {/* Career Summary */}

          <div className="mt-6">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Career Summary
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {profile?.careerSummary ||
                "No career summary added."}
            </p>

          </div>

        </div>

        {/* ======================================
            LATEST RESUME
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-semibold text-white">
                Latest Resume
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your most recently uploaded resume.
              </p>
            </div>

            {resume && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-center">

                <p className="text-xs uppercase tracking-wide text-slate-400">
                  ATS Score
                </p>

                <p className="mt-1 text-3xl font-bold text-indigo-400">
                  {atsScore}%
                </p>

              </div>
            )}

          </div>

          {!resume ? (
            /* ==================================
               NO RESUME
            ================================== */

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">

              <p className="text-slate-400">
                No resume uploaded yet.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/candidate/upload-resume"
                  )
                }
                className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Upload Resume
              </button>

            </div>
          ) : (
            /* ==================================
               RESUME EXISTS
            ================================== */

            <div className="mt-6">

              {/* Resume Basic Information */}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

  <p className="text-xs uppercase tracking-wide text-slate-500">
    File Name
  </p>

  <p className="mt-2 break-all text-sm text-slate-200">
    {resume.fileName || "Unknown"}
  </p>

  {resume.fileUrl && (
    <a
      href={`http://localhost:5000${resume.fileUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
    >
      View Resume
    </a>
  )}

</div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Uploaded At
                  </p>

                  <p className="mt-2 text-sm text-slate-200">
                    {resume.uploadedAt
                      ? new Date(
                          resume.uploadedAt
                        ).toLocaleString()
                      : "Unknown"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Resume Text
                  </p>

                  <p className="mt-2 text-sm text-slate-200">
                    {resume.resumeTextLength ||
                      0}{" "}
                    characters
                  </p>

                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">

                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    ATS Score
                  </p>

                  <p className="mt-2 text-2xl font-bold text-indigo-400">
                    {atsScore}%
                  </p>

                </div>

              </div>

              {/* ==================================
                  ATS BREAKDOWN
              ================================== */}

              <div className="mt-8">

                <h3 className="text-lg font-semibold text-white">
                  ATS Score Breakdown
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                  {/* Skill */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                    <p className="text-sm text-slate-400">
                      Skills
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {atsBreakdown.skillScore ||
                        0}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      / 50
                    </p>

                  </div>

                  {/* Experience */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                    <p className="text-sm text-slate-400">
                      Experience
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {atsBreakdown.experienceScore ||
                        0}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      / 20
                    </p>

                  </div>

                  {/* Education */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                    <p className="text-sm text-slate-400">
                      Education
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {atsBreakdown.educationScore ||
                        0}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      / 10
                    </p>

                  </div>

                  {/* Projects */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                    <p className="text-sm text-slate-400">
                      Projects
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {atsBreakdown.projectScore ||
                        0}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      / 10
                    </p>

                  </div>

                  {/* Resume Quality */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                    <p className="text-sm text-slate-400">
                      Resume Quality
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {atsBreakdown.resumeQualityScore ||
                        0}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      / 10
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================
                  EXTRACTED SKILLS
              ================================== */}

              <div className="mt-8">

                <h3 className="text-lg font-semibold text-white">
                  Extracted Skills
                </h3>

                {extractedSkills.length ===
                0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No skills detected.
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">

                    {extractedSkills.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm text-indigo-300"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* ======================================
            EDUCATION
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-white">
            Education
          </h2>

          {!profile?.education ||
          profile.education.length ===
            0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No education information added.
            </p>
          ) : (
            <div className="mt-5 space-y-4">

              {profile.education.map(
                (education, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                  >

                    <h3 className="font-semibold text-white">
                      {education.degree ||
                        "Degree"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {education.institution ||
                        "Institution"}
                    </p>

                    {education.fieldOfStudy && (
                      <p className="mt-1 text-sm text-slate-500">
                        {education.fieldOfStudy}
                      </p>
                    )}

                    {education.grade && (
                      <p className="mt-2 text-sm text-slate-400">
                        Grade:{" "}
                        {education.grade}
                      </p>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ======================================
            EXPERIENCE
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-white">
            Experience
          </h2>

          {!profile?.experience ||
          profile.experience.length ===
            0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No experience information added.
            </p>
          ) : (
            <div className="mt-5 space-y-4">

              {profile.experience.map(
                (experience, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                  >

                    <h3 className="font-semibold text-white">
                      {experience.jobTitle ||
                        "Job Title"}
                    </h3>

                    <p className="mt-1 text-sm text-indigo-400">
                      {experience.company ||
                        "Company"}
                    </p>

                    {experience.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {experience.description}
                      </p>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ======================================
            PROJECTS
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-white">
            Projects
          </h2>

          {!profile?.projects ||
          profile.projects.length ===
            0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No projects added.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {profile.projects.map(
                (project, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"
                  >

                    <h3 className="font-semibold text-white">
                      {project.title ||
                        "Project"}
                    </h3>

                    {project.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {project.description}
                      </p>
                    )}

                    {project.technologies &&
                      project.technologies.length >
                        0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {project.technologies.map(
                            (
                              technology,
                              techIndex
                            ) => (
                              <span
                                key={
                                  techIndex
                                }
                                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                              >
                                {technology}
                              </span>
                            )
                          )}

                        </div>
                      )}

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default CandidateProfile;