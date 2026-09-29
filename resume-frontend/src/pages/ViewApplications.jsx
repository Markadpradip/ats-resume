import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ViewApplications() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Status update loading
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // ======================================
  // FETCH APPLICATIONS
  // ======================================
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // Current Job ID
      params.append("jobId", id);

      // Search
      if (search.trim()) {
        params.append("search", search.trim());
      }

      // Status filter
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      console.log("🔥 Applications Job ID:", id);

      const response = await api.get(
        `/applications/recruiter?${params.toString()}`
      );

      console.log(
        "🔥 Applications API Response:",
        response.data
      );

      // Applications
      setApplications(
        response.data.applications || []
      );

      // Total applications
      setTotalApplications(
        response.data.totalApplications ??
          response.data.applications?.length ??
          0
      );
    } catch (err) {
      console.error(
        "Fetch Applications Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load applications"
      );

      setApplications([]);
      setTotalApplications(0);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // INITIAL FETCH / STATUS FILTER
  // ======================================
  useEffect(() => {
    fetchApplications();
  }, [id, statusFilter]);

  // ======================================
  // SEARCH
  // ======================================
  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  // ======================================
  // UPDATE APPLICATION STATUS
  // ======================================
  const updateStatus = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingStatus(applicationId);

      console.log(
        "🔥 Updating Application:",
        applicationId
      );

      console.log(
        "🔥 New Status:",
        newStatus
      );

      const response = await api.put(
        `/applications/${applicationId}`,
        {
          status: newStatus,
        }
      );

      console.log(
        "🔥 Status Update Response:",
        response.data
      );

      // Update UI immediately
      setApplications((prev) =>
        prev.map((application) =>
          application.applicationId ===
          applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );
    } catch (err) {
      console.error(
        "Update Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update application status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ======================================
  // VIEW RESUME
  // ======================================
  const viewResume = async (
    applicationId
  ) => {
    try {
      const response = await api.get(
        `/applications/${applicationId}/resume`,
        {
          responseType: "blob",
        }
      );

      const fileURL =
        URL.createObjectURL(response.data);

      window.open(fileURL, "_blank");

      // Release object URL later
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
    } catch (err) {
      console.error(
        "View Resume Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to open resume"
      );
    }
  };

  // ======================================
  // ATS SCORE COLOR
  // ======================================
  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 60) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  // ======================================
  // STATUS COLOR
  // ======================================
  const getStatusColor = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return "bg-blue-500/10 text-blue-400";

      case "INTERVIEW":
        return "bg-purple-500/10 text-purple-400";

      case "HIRED":
        return "bg-green-500/10 text-green-400";

      case "REJECTED":
        return "bg-red-500/10 text-red-400";

      case "APPLIED":
      default:
        return "bg-yellow-500/10 text-yellow-400";
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-lg">
          Loading applications...
        </p>
      </div>
    );
  }

  // ======================================
  // UI
  // ======================================
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white mb-3 transition"
            >
              ← Back to Job
            </button>

            <h1 className="text-3xl font-bold">
              View Applications
            </h1>

            <p className="text-slate-400 mt-2">
              Review candidates who applied
              for this job
            </p>
          </div>

          {/* TOTAL APPLICATIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-4">
            <p className="text-sm text-slate-500">
              Total Applications
            </p>

            <p className="text-3xl font-bold mt-1">
              {totalApplications}
            </p>
          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* ======================================
            SEARCH & FILTER
        ====================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none"
            >
              <option value="">
                All Status
              </option>

              <option value="APPLIED">
                Applied
              </option>

              <option value="SHORTLISTED">
                Shortlisted
              </option>

              <option value="INTERVIEW">
                Interview
              </option>

              <option value="HIRED">
                Hired
              </option>

              <option value="REJECTED">
                Rejected
              </option>
            </select>

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              Search
            </button>

          </form>
        </div>

        {/* ======================================
            EMPTY STATE
        ====================================== */}
        {!error &&
          applications.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">

              <div className="text-5xl mb-4">
                📄
              </div>

              <h2 className="text-xl font-semibold">
                No Applications Found
              </h2>

              <p className="text-slate-400 mt-2">
                No candidates have applied
                for this job yet.
              </p>

            </div>
          )}

        {/* ======================================
            APPLICATION CARDS
        ====================================== */}
        <div className="space-y-5">

          {applications.map(
            (application) => (

              <div
                key={
                  application.applicationId
                }
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition"
              >

                {/* ======================================
                    TOP SECTION
                ====================================== */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  {/* CANDIDATE */}
                  <div className="flex gap-4">

                    {/* RANK */}
                    <div className="w-11 h-11 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      #{application.rank}
                    </div>

                    {/* CANDIDATE INFO */}
                    <div>

                      <h2 className="text-xl font-semibold">
                        {application.candidate
                          ?.name ||
                          "Unknown Candidate"}
                      </h2>

                      <p className="text-slate-400 mt-1">
                        {application.candidate
                          ?.email ||
                          "No email available"}
                      </p>

                      {application.candidate
                        ?.phone && (
                        <p className="text-slate-500 text-sm mt-1">
                          📞{" "}
                          {
                            application
                              .candidate
                              .phone
                          }
                        </p>
                      )}

                    </div>
                  </div>

                  {/* ATS SCORE */}
                  <div className="text-center">

                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      ATS Score
                    </p>

                    <p
                      className={`text-3xl font-bold ${getScoreColor(
                        application.atsScore
                      )}`}
                    >
                      {application.atsScore ?? 0}%
                    </p>

                  </div>
                </div>

                {/* ======================================
                    JOB
                ====================================== */}
                {application.job && (
                  <div className="mt-5 bg-slate-800/40 rounded-lg p-4">

                    <p className="text-sm text-slate-500">
                      Applied For
                    </p>

                    <p className="font-semibold mt-1">
                      {application.job.title}
                    </p>

                    <p className="text-sm text-slate-400">
                      {application.job.company}
                    </p>

                  </div>
                )}

                {/* ======================================
                    STATUS + DATE
                ====================================== */}
                <div className="mt-5 flex flex-col sm:flex-row gap-5 sm:items-center">

                  {/* STATUS */}
                  <div>

                    <p className="text-xs text-slate-500 mb-2">
                      Status
                    </p>

                    <select
                      value={
                        application.status ||
                        "APPLIED"
                      }
                      disabled={
                        updatingStatus ===
                        application.applicationId
                      }
                      onChange={(e) =>
                        updateStatus(
                          application.applicationId,
                          e.target.value
                        )
                      }
                      className={`rounded-lg px-3 py-2 border border-slate-700 bg-slate-800 outline-none ${getStatusColor(
                        application.status
                      )} ${
                        updatingStatus ===
                        application.applicationId
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >

                      <option value="APPLIED">
                        Applied
                      </option>

                      <option value="SHORTLISTED">
                        Shortlisted
                      </option>

                      <option value="INTERVIEW">
                        Interview
                      </option>

                      <option value="HIRED">
                        Hired
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>

                    </select>

                    {/* UPDATING MESSAGE */}
                    {updatingStatus ===
                      application.applicationId && (
                      <p className="text-xs text-blue-400 mt-2">
                        Updating status...
                      </p>
                    )}

                  </div>

                  {/* APPLIED DATE */}
                  <div>

                    <p className="text-xs text-slate-500">
                      Applied On
                    </p>

                    <p className="text-slate-300 mt-1">
                      {application.appliedAt
                        ? new Date(
                            application.appliedAt
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                  </div>

                </div>

                {/* ======================================
                    SKILLS
                ====================================== */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">

                  {/* MATCHED SKILLS */}
                  <div>

                    <h3 className="text-sm font-semibold text-green-400 mb-3">
                      ✓ Matched Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {application
                        .matchedSkills
                        ?.length > 0 ? (
                        application.matchedSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-slate-500 text-sm">
                          No matched skills
                        </span>
                      )}

                    </div>
                  </div>

                  {/* MISSING SKILLS */}
                  <div>

                    <h3 className="text-sm font-semibold text-red-400 mb-3">
                      ✕ Missing Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {application
                        .missingSkills
                        ?.length > 0 ? (
                        application.missingSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-slate-500 text-sm">
                          No missing skills
                        </span>
                      )}

                    </div>
                  </div>

                </div>

                {/* ======================================
                    COVER LETTER
                ====================================== */}
                {application.coverLetter && (
                  <div className="mt-6">

                    <h3 className="text-sm font-semibold text-slate-300 mb-2">
                      Cover Letter
                    </h3>

                    <div className="bg-slate-800/50 rounded-lg p-4 text-slate-400 text-sm leading-relaxed">
                      {application.coverLetter}
                    </div>

                  </div>
                )}

                {/* ======================================
                    ACTIONS
                ====================================== */}
                <div className="mt-6 pt-5 border-t border-slate-800">

                  <button
                    onClick={() =>
                      viewResume(
                        application.applicationId
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium transition"
                  >
                    📄 View Resume
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}

export default ViewApplications;