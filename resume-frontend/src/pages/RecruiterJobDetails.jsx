import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecruiterNavbar from "../components/RecruiterNavbar";
import api from "../services/api";

function RecruiterJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/jobs/${id}`);

      console.log("📦 Recruiter Job Details:", res.data);

      if (res.data.success) {
        setJob(res.data.job);
      }
    } catch (err) {
      console.error("Recruiter Job Details Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <RecruiterNavbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

            <p className="mt-4 text-slate-400">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <RecruiterNavbar />

        <main className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">

            <p className="text-red-400">
              {error}
            </p>

            <button
              onClick={() => navigate("/recruiter/jobs")}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-500"
            >
              ← Back to My Jobs
            </button>

          </div>
        </main>
      </div>
    );
  }

  // =========================
  // JOB NOT FOUND
  // =========================

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <RecruiterNavbar />

        <main className="mx-auto max-w-4xl px-4 py-10">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

            <h1 className="text-xl font-semibold">
              Job not found
            </h1>

            <button
              onClick={() => navigate("/recruiter/jobs")}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-500"
            >
              Back to My Jobs
            </button>

          </div>

        </main>
      </div>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">

      <RecruiterNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK */}

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="mb-6 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to My Jobs
        </button>

        {/* JOB CARD */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-sm font-medium text-indigo-400">
                RECRUITER PORTAL
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                {job.title}
              </h1>

              <p className="mt-2 text-lg text-indigo-400">
                {job.company}
              </p>

            </div>

            <span
              className={`w-fit rounded-lg px-4 py-2 text-xs font-semibold ${
                job.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {job.status}
            </span>

          </div>

          {/* JOB INFORMATION */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Location
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200">
                📍 {getLocation(job.location)}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Job Type
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200">
                {getJobTypeLabel(job.jobType)}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Salary
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200">
                {job.salary || "Not specified"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-950 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Posted
              </p>

              <p className="mt-2 text-sm font-medium text-slate-200">
                {job.createdAt
                  ? new Date(
                      job.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-8 border-t border-slate-800 pt-8">

            <h2 className="text-xl font-semibold">
              Job Description
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
              {job.description}
            </p>

          </div>

          {/* SKILLS */}

          <div className="mt-8 border-t border-slate-800 pt-8">

            <h2 className="text-xl font-semibold">
              Required Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">

              {job.skills?.length > 0 ? (
                job.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No skills specified.
                </p>
              )}

            </div>

          </div>

          {/* LOCATION DETAILS */}

          <div className="mt-8 border-t border-slate-800 pt-8">

            <h2 className="text-xl font-semibold">
              Job Location
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <div>
                <p className="text-xs text-slate-500">
                  Country
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {job.location?.country || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  State
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {job.location?.state || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  City
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {job.location?.city || "N/A"}
                </p>
              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">

            <button
              onClick={() =>
                navigate("/recruiter/jobs")
              }
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Back to My Jobs
            </button>

            <button
              onClick={() =>
                navigate(`/recruiter/jobs/${job._id}/applications`)
              }
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              View Applications
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default RecruiterJobDetails;