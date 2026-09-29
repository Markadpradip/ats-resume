import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ======================================
  // DASHBOARD STATE
  // ======================================
  const [dashboard, setDashboard] = useState({
    applications: 0,
    shortlisted: 0,
    interviews: 0,
    averageATSScore: 0,

    // Latest Resume ATS
    resumeATSScore: 0,
    resume: null,
  });

  const [loading, setLoading] = useState(true);

  // ======================================
  // FETCH DASHBOARD DATA
  // ======================================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/candidates/dashboard"
        );

        console.log(
          "Candidate Dashboard:",
          response.data
        );

        if (response.data.success) {
          setDashboard({
            applications:
              response.data.data?.applications || 0,

            shortlisted:
              response.data.data?.shortlisted || 0,

            interviews:
              response.data.data?.interviews || 0,

            averageATSScore:
              response.data.data?.averageATSScore || 0,

            // ======================================
            // LATEST RESUME ATS SCORE
            // ======================================
            resumeATSScore:
              response.data.data?.resumeATSScore || 0,

            // ======================================
            // LATEST RESUME
            // ======================================
            resume:
              response.data.data?.resume || null,
          });
        }
      } catch (error) {
        console.error(
          "Candidate dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            WELCOME
        ====================================== */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-2 text-slate-400">
            Track your applications, resumes and ATS
            performance from one place.
          </p>
        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* ======================================
              APPLICATIONS
          ====================================== */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <p className="text-sm text-slate-400">
              Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {loading
                ? "..."
                : dashboard.applications}
            </p>
          </div>

          {/* ======================================
              SHORTLISTED
          ====================================== */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <p className="text-sm text-slate-400">
              Shortlisted
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {loading
                ? "..."
                : dashboard.shortlisted}
            </p>
          </div>

          {/* ======================================
              INTERVIEWS
          ====================================== */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
            <p className="text-sm text-slate-400">
              Interviews
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {loading
                ? "..."
                : dashboard.interviews}
            </p>
          </div>

          {/* ======================================
              LATEST RESUME ATS SCORE
          ====================================== */}

          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-slate-900/70 p-6 shadow-lg">

            <p className="text-sm text-slate-400">
              Latest Resume ATS Score
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-400">
              {loading
                ? "..."
                : `${dashboard.resumeATSScore}%`}
            </p>

            {/* Resume name */}
            {dashboard.resume?.fileName && (
              <p className="mt-2 truncate text-xs text-slate-500">
                {dashboard.resume.fileName}
              </p>
            )}

          </div>

        </div>

        {/* ======================================
            LATEST RESUME ATS DETAILS
        ====================================== */}

        {dashboard.resume && (
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-slate-900/70 p-6 shadow-lg">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Latest Resume Analysis
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your most recently uploaded resume
                  and its ATS analysis.
                </p>
              </div>

              <div className="text-left sm:text-right">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  ATS Score
                </p>

                <p className="mt-1 text-3xl font-bold text-indigo-400">
                  {dashboard.resumeATSScore}%
                </p>

              </div>

            </div>

            {/* Resume Information */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              {/* File Name */}

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Resume
                </p>

                <p className="mt-2 truncate text-sm font-medium text-white">
                  {dashboard.resume.fileName || "No resume"}
                </p>

              </div>

              {/* Extracted Text */}

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Extracted Text
                </p>

                <p className="mt-2 text-xl font-bold text-indigo-400">
                  {dashboard.resume.resumeTextLength || 0}

                  <span className="ml-1 text-sm font-normal text-slate-500">
                    characters
                  </span>
                </p>

              </div>

              {/* Skills */}

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Extracted Skills
                </p>

                <p className="mt-2 text-xl font-bold text-indigo-400">
                  {dashboard.resume.extractedSkills?.length || 0}

                  <span className="ml-1 text-sm font-normal text-slate-500">
                    skills
                  </span>
                </p>

              </div>

            </div>

            {/* Skills List */}

            {dashboard.resume.extractedSkills?.length > 0 && (
              <div className="mt-5">

                <p className="text-sm font-medium text-slate-300">
                  Skills detected from resume
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {dashboard.resume.extractedSkills.map(
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

              </div>
            )}

            {/* ATS Breakdown */}

            {dashboard.resume.atsBreakdown && (
              <div className="mt-6">

                <h3 className="text-sm font-semibold text-white">
                  ATS Score Breakdown
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                  {/* Skill */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-500">
                      Skills
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {dashboard.resume.atsBreakdown.skillScore || 0}/50
                    </p>
                  </div>

                  {/* Experience */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-500">
                      Experience
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {dashboard.resume.atsBreakdown.experienceScore || 0}/20
                    </p>
                  </div>

                  {/* Education */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-500">
                      Education
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {dashboard.resume.atsBreakdown.educationScore || 0}/10
                    </p>
                  </div>

                  {/* Projects */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-500">
                      Projects
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {dashboard.resume.atsBreakdown.projectScore || 0}/10
                    </p>
                  </div>

                  {/* Resume Quality */}

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs text-slate-500">
                      Resume Quality
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {dashboard.resume.atsBreakdown.resumeQualityScore || 0}/10
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          {/* Resume */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

            <h2 className="text-lg font-semibold text-white">
              Resume
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Upload and analyze your resume with our ATS
              engine.
            </p>

            <button
              onClick={() =>
                navigate("/candidate/upload-resume")
              }
              className="mt-5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500"
            >
              Upload Resume
            </button>

          </div>

          {/* Find Jobs */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

            <h2 className="text-lg font-semibold text-white">
              Find Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Explore jobs matching your skills and profile.
            </p>

            <button
              onClick={() =>
                navigate("/candidate/jobs")
              }
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Browse Jobs
            </button>

          </div>

          {/* Applications */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

            <h2 className="text-lg font-semibold text-white">
              Applications
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Track the status of your job applications.
            </p>

            <button
              onClick={() =>
                navigate("/candidate/applications")
              }
              className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              View Applications
            </button>

          </div>

        </div>

        {/* ======================================
            PROFILE
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">

          <h2 className="text-lg font-semibold text-white">
            Profile Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">

            {/* Name */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Name
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {user?.name}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {user?.email}
              </p>
            </div>

            {/* Role */}

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role
              </p>

              <p className="mt-1 text-sm font-medium text-indigo-400">
                {user?.role}
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default CandidateDashboard;