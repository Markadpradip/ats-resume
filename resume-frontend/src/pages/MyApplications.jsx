import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/my");

      console.log("MY APPLICATIONS RESPONSE:", response.data);

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("MY APPLICATIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "INTERVIEW":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "HIRED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";

      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 60) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Applications
            </h1>

            <p className="mt-2 text-slate-400">
              Track your job applications and ATS performance.
            </p>
          </div>

          <button
            onClick={() => navigate("/candidate/jobs")}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Browse Jobs
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex justify-center">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-slate-300">
              Loading applications...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
              <h2 className="text-xl font-semibold text-white">
                No Applications Yet
              </h2>

              <p className="mt-2 text-slate-400">
                You haven't applied for any jobs yet.
              </p>

              <button
                onClick={() => navigate("/candidate/jobs")}
                className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Find Jobs
              </button>
            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="mt-8 space-y-6">

              {applications.map((application) => (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg"
                >

                  {/* Top */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {application.job?.title || "Job Title"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {application.job?.company || "Company"}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
  {application.job?.location
    ? [
        application.job.location.city,
        application.job.location.state,
        application.job.location.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "Location not available"}
</p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status || "APPLIED"}
                    </span>
                  </div>

                  {/* ATS */}
                  <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          ATS Score
                        </p>

                        <p
                          className={`mt-1 text-3xl font-bold ${getScoreStyle(
                            application.atsScore || 0
                          )}`}
                        >
                          {application.atsScore || 0}%
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          Applied On
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ATS Breakdown */}
                  {application.atsBreakdown && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-white">
                        ATS Breakdown
                      </h3>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="rounded-lg bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">
                            Skills
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {application.atsBreakdown.skillScore || 0}%
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">
                            Experience
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {application.atsBreakdown.experienceScore || 0}%
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">
                            Education
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {application.atsBreakdown.educationScore || 0}%
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">
                            Projects
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {application.atsBreakdown.projectScore || 0}%
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">
                            Resume Quality
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {application.atsBreakdown.resumeQualityScore || 0}%
                          </p>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mt-6 grid gap-6 md:grid-cols-2">

                    {/* Matched */}
                    <div>
                      <h3 className="text-sm font-semibold text-green-400">
                        Matched Skills
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {application.matchedSkills?.length > 0 ? (
                          application.matchedSkills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400"
                              >
                                {skill}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-slate-500">
                            No matched skills
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing */}
                    <div>
                      <h3 className="text-sm font-semibold text-red-400">
                        Missing Skills
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {application.missingSkills?.length > 0 ? (
                          application.missingSkills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400"
                              >
                                {skill}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-green-400">
                            No missing skills 🎉
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Job Info */}
                  <div className="mt-6 flex flex-wrap gap-3">

                    {application.job?.jobType && (
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        {application.job.jobType}
                      </span>
                    )}

                    {application.job?.salary && (
                      <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300">
                        Salary: {application.job.salary}
                      </span>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
}

export default MyApplications;