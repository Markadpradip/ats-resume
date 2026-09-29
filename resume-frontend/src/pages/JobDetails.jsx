import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function JobDetails() {
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

      if (res.data.success) {
        setJob(res.data.job);
      }
    } catch (err) {
      console.error("Get Job Details Error:", err);

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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-slate-400">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="text-red-400">{error}</p>

           <div className="mb-6 flex flex-wrap gap-3">
  <button
    onClick={() => navigate("/candidate/dashboard")}
    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
  >
    ← Candidate Dashboard
  </button>

  <button
    onClick={() => navigate("/candidate/jobs")}
    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
  >
    ← Find Jobs
  </button>
</div>
          </div>
        </main>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h1 className="text-xl font-semibold">
              Job not found
            </h1>

            <button
              onClick={() => navigate("/candidate/jobs")}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-500"
            >
              Back to Jobs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate("/candidate/jobs")}
          className="mb-6 text-sm text-slate-400 hover:text-white"
        >
          ← Back to Jobs
        </button>

        {/* Job Header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <p className="text-sm font-medium text-indigo-400">
                JOB OPPORTUNITY
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                {job.title}
              </h1>

              <p className="mt-2 text-lg text-indigo-400">
                {job.company}
              </p>
            </div>

            <span className="w-fit rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
              {job.jobType}
            </span>

          </div>

          {/* Job Info */}
          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Location
              </p>

             <p className="mt-1 text-sm font-medium text-slate-200">
  {job.location?.city
    ? `${job.location.city}, ${job.location.state}, ${job.location.country}`
    : "Location not specified"}
</p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Salary
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                {job.salary || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm font-medium text-emerald-400">
                {job.status}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Job Description
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-400">
              {job.description}
            </p>

          </div>

          {/* Skills */}
          <div className="mt-8">

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

          {/* Recruiter */}
          <div className="mt-8 border-t border-slate-800 pt-6">

            <h2 className="text-xl font-semibold">
              Recruiter Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-slate-500">
                  Recruiter
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {job.recruiter?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {job.recruiter?.email || "Not available"}
                </p>
              </div>

            </div>

          </div>

          {/* Apply */}
          <div className="mt-8 border-t border-slate-800 pt-6">

            <button
  onClick={() =>
    navigate(`/candidate/jobs/${job._id}/apply`)
  }
  className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
>
  Apply Now
</button>

          </div>

        </div>
      </main>
    </div>
  );
}

export default JobDetails;