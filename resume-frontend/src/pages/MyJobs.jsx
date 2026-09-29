import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import api from "../services/api";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH MY JOBS
  // ======================================
  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/jobs/my-jobs");

      console.log("📦 My Jobs Response:", res.data);

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Fetch My Jobs Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your jobs."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOAD JOBS
  // ======================================
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // ======================================
  // JOB TYPE LABEL
  // ======================================
  const getJobTypeLabel = (type) => {
    switch (type) {
      case "FULL_TIME":
        return "Full Time";

      case "PART_TIME":
        return "Part Time";

      case "INTERNSHIP":
        return "Internship";

      case "CONTRACT":
        return "Contract";

      default:
        return type;
    }
  };

  // ======================================
  // LOCATION
  // ======================================
  const getLocation = (location) => {
    if (!location) {
      return "Location not specified";
    }

    if (typeof location === "string") {
      return location;
    }

    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <RecruiterNavbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-slate-400">
              Loading your jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // MAIN
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

      <RecruiterNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-indigo-400">
              RECRUITER PORTAL
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              My Jobs
            </h1>

            <p className="mt-2 text-slate-400">
              Manage the jobs you have posted.
            </p>
          </div>

          {/* CREATE JOB */}
          <button
            onClick={() =>
              navigate("/recruiter/jobs/create")
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            + Create New Job
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            COUNT
        ====================================== */}
        <div className="mt-8">
          <p className="text-sm text-slate-400">
            Total Jobs:{" "}
            <span className="font-semibold text-white">
              {jobs.length}
            </span>
          </p>
        </div>

        {/* ======================================
            JOBS
        ====================================== */}
        {jobs.length > 0 ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg transition hover:border-indigo-500/60"
              >

                {/* ======================================
                    JOB HEADER
                ====================================== */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {job.title}
                    </h2>

                    <p className="mt-1 text-indigo-400">
                      {job.company}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      job.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {job.status}
                  </span>

                </div>

                {/* ======================================
                    DESCRIPTION
                ====================================== */}
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                  {job.description}
                </p>

                {/* ======================================
                    SKILLS
                ====================================== */}
                {job.skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">

                    {job.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>
                )}

                {/* ======================================
                    INFORMATION
                ====================================== */}
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">

                  {/* LOCATION */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-200">
                      📍 {getLocation(job.location)}
                    </p>
                  </div>

                  {/* JOB TYPE */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Job Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {getJobTypeLabel(job.jobType)}
                    </p>
                  </div>

                  {/* SALARY */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {job.salary || "Not specified"}
                    </p>
                  </div>

                  {/* POSTED */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Posted
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {job.createdAt
                        ? new Date(
                            job.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                </div>

                {/* ======================================
                    FOOTER ACTIONS
                ====================================== */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  {/* VIEW JOB */}
                  <button
                    onClick={() =>
                      navigate(
                        `/recruiter/jobs/${job._id}`
                      )
                    }
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                  >
                    View Job
                  </button>

                  {/* VIEW APPLICATIONS */}
                  <button
                    onClick={() =>
                      navigate(
                        `/recruiter/jobs/${job._id}/applications`
                      )
                    }
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    View Applications
                  </button>

                </div>

              </div>
            ))}

          </div>
        ) : (
          /* ======================================
             NO JOBS
          ====================================== */
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 py-16 text-center">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              No Jobs Posted Yet
            </h2>

            <p className="mt-2 text-slate-500">
              Create your first job posting.
            </p>

            <button
              onClick={() =>
                navigate("/recruiter/jobs/create")
              }
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-500"
            >
              Create Job
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default MyJobs;