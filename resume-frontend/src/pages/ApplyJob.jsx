import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ======================================
// FORMAT LOCATION
// Supports:
// "Nagpur"
// OR
// { country, state, city }
// ======================================
const formatLocation = (location) => {
  if (!location) {
    return "Location not specified";
  }

  // Old job format
  if (typeof location === "string") {
    return location;
  }

  // New job format
  if (typeof location === "object") {
    return [
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "Location not specified";
};

// ======================================
// SAFE TEXT
// Prevent React object rendering error
// ======================================
const safeText = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  return fallback;
};

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================
  // FETCH JOB
  // ======================================
  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/jobs/${id}`);

      console.log("🔥 JOB RESPONSE:", res.data);

      if (res.data.success) {
        console.log("🔥 JOB:", res.data.job);
        console.log(
          "🔥 LOCATION:",
          res.data.job?.location
        );

        setJob(res.data.job);
      } else {
        setError("Job not found.");
      }
    } catch (err) {
      console.error("Fetch Job Error:", err);

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

  // ======================================
  // RESUME CHANGE
  // ======================================
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    // ======================================
    // PDF VALIDATION
    // ======================================
    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      setResume(null);
      return;
    }

    // ======================================
    // FILE SIZE - MAX 5 MB
    // ======================================
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Resume file size must not exceed 5 MB."
      );
      e.target.value = "";
      setResume(null);
      return;
    }

    // ======================================
    // VALID PDF
    // ======================================
    setError("");
    setResume(file);
  };

  // ======================================
  // SUBMIT APPLICATION
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!id) {
      setError("Job ID is missing.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("jobId", id);
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      console.log("========== APPLY FRONTEND ==========");
      console.log("JOB ID:", id);
      console.log("RESUME:", resume);
      console.log("RESUME NAME:", resume.name);
      console.log("RESUME TYPE:", resume.type);
      console.log("RESUME SIZE:", resume.size);

      for (const [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File
            ? value.name
            : value
        );
      }

      const res = await api.post(
        "/applications",
        formData
      );

      console.log(
        "🔥 APPLY RESPONSE:",
        res.data
      );

      if (res.data.success) {
        setSuccess(
          "Application submitted successfully!"
        );

        // Redirect after success
        setTimeout(() => {
          navigate(`/candidate/jobs/${id}`);
        }, 1500);
      } else {
        setError(
          res.data.message ||
            "Failed to submit application."
        );
      }
    } catch (err) {
      console.error(
        "Apply Job Error:",
        err
      );

      console.log(
        "BACKEND RESPONSE:",
        err.response?.data
      );

      console.log(
        "STATUS:",
        err.response?.status
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // JOB NOT FOUND
  // ======================================
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h1 className="text-xl font-semibold">
              Job not found
            </h1>

            <button
              type="button"
              onClick={() =>
                navigate("/candidate/jobs")
              }
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-500"
            >
              Back to Jobs
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ======================================
  // PAGE
  // ======================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate(`/candidate/jobs/${id}`)
          }
          className="mb-6 text-sm text-slate-400 hover:text-white"
        >
          ← Back to Job Details
        </button>

        {/* Header */}
        <div className="mb-6">

          <p className="text-sm font-medium text-indigo-400">
            APPLY FOR JOB
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {safeText(
              job.title,
              "Untitled Job"
            )}
          </h1>

          <p className="mt-2 text-lg text-indigo-400">
            {safeText(
              job.company,
              "Company not specified"
            )}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {formatLocation(job.location)}
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-400">
                {success}
              </p>
            </div>
          )}

          {/* Resume */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Resume{" "}
              <span className="text-red-400">
                *
              </span>
            </label>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              disabled={submitting}
              className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-2 text-xs text-slate-500">
              PDF only • Maximum 5 MB
            </p>

            {resume && (
              <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-400">
                  ✓ Selected: {resume.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(resume.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

          </div>

          {/* Cover Letter */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Cover Letter
            </label>

            <textarea
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              rows={8}
              disabled={submitting}
              placeholder="Write a short message to the recruiter..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 disabled:opacity-50"
            />

            <p className="mt-2 text-xs text-slate-500">
              Explain why you are a good fit for this
              position.
            </p>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate(`/candidate/jobs/${id}`)
              }
              disabled={submitting}
              className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !resume}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </button>

          </div>

        </form>
      </main>
    </div>
  );
}

export default ApplyJob;