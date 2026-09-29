import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import RecruiterNavbar from "../components/RecruiterNavbar";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH DASHBOARD DATA
  // ======================================
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // ======================================
      // GET RECRUITER JOBS
      // ======================================
      const jobsResponse = await api.get(
        "/jobs/my-jobs?limit=100"
      );

      console.log(
        "🔥 RECRUITER JOBS:",
        jobsResponse.data
      );

      const jobs =
        jobsResponse.data?.jobs || [];

      // ======================================
      // JOB COUNTS
      // ======================================
      const totalJobs =
        jobsResponse.data?.totalJobs ??
        jobs.length;

      const activeJobs =
        jobs.filter(
          (job) => job.status === "ACTIVE"
        ).length;

      // ======================================
      // GET RECRUITER APPLICATIONS
      // ======================================
      const applicationsResponse =
        await api.get(
          "/applications/recruiter?page=1&limit=100"
        );

      console.log(
        "🔥 RECRUITER APPLICATIONS:",
        applicationsResponse.data
      );

      const applications =
        applicationsResponse.data?.applications ||
        [];

      const totalApplications =
        applicationsResponse.data?.totalApplications ??
        applications.length;

      // ======================================
      // SET DATA
      // ======================================
      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
      });

      setRecentJobs(
        jobs.slice(0, 5)
      );

      setRecentApplications(
        applications.slice(0, 5)
      );

    } catch (err) {
      console.error(
        "❌ DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOAD DASHBOARD
  // ======================================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <RecruiterNavbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-lg text-slate-300">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // DASHBOARD
  // ======================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <RecruiterNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================
            HEADER
        ================================== */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome, {user?.name || "Recruiter"} 👋
          </h1>

          <p className="mt-2 text-slate-400">
            Here's what's happening with your recruitment.
          </p>
        </div>

        {/* ==================================
            ERROR
        ================================== */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-900/30 px-5 py-4 text-red-300">
            ❌ {error}
          </div>
        )}

        {/* ==================================
            STAT CARDS
        ================================== */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* TOTAL JOBS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Total Jobs
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {stats.totalJobs}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/20 text-2xl">
                💼
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Jobs created by you
            </p>
          </div>

          {/* ACTIVE JOBS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Active Jobs
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {stats.activeJobs}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600/20 text-2xl">
                🟢
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Currently accepting applications
            </p>
          </div>

          {/* APPLICATIONS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Applications
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {stats.totalApplications}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/20 text-2xl">
                📄
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Applications received
            </p>
          </div>

        </div>

        {/* ==================================
            QUICK ACTIONS
        ================================== */}
        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-bold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <button
              onClick={() =>
                navigate("/recruiter/jobs/create")
              }
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-indigo-500 hover:bg-slate-800"
            >
              <div className="mb-4 text-3xl">
                ➕
              </div>

              <h3 className="text-lg font-semibold">
                Create Job
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Create a new job opportunity.
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/recruiter/jobs")
              }
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500 hover:bg-slate-800"
            >
              <div className="mb-4 text-3xl">
                📋
              </div>

              <h3 className="text-lg font-semibold">
                My Jobs
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                View and manage your jobs.
              </p>
            </button>

            <button
              onClick={() =>
                navigate("/recruiter/applications")
              }
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-purple-500 hover:bg-slate-800"
            >
              <div className="mb-4 text-3xl">
                📄
              </div>

              <h3 className="text-lg font-semibold">
                Applications
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Review candidate applications.
              </p>
            </button>

          </div>
        </div>

        {/* ==================================
            RECENT JOBS
        ================================== */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Recent Jobs
            </h2>

            <button
              onClick={() =>
                navigate("/recruiter/jobs")
              }
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              View All →
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No jobs created yet.
              </p>

              <button
                onClick={() =>
                  navigate("/recruiter/jobs/create")
                }
                className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
              >
                Create Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="divide-y divide-slate-800">

                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <h3 className="font-semibold">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {job.company}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {job.location?.city},{" "}
                        {job.location?.state},{" "}
                        {job.location?.country}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        job.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {job.status}
                    </span>

                  </div>
                ))}

              </div>
            </div>
          )}

        </div>

        {/* ==================================
            RECENT APPLICATIONS
        ================================== */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Recent Applications
            </h2>

            <button
              onClick={() =>
                navigate("/recruiter/applications")
              }
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              View All →
            </button>
          </div>

          {recentApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                No applications received yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="divide-y divide-slate-800">

                {recentApplications.map(
                  (application) => (
                    <div
                      key={
                        application.applicationId
                      }
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div>
                        <h3 className="font-semibold">
                          {application.candidate?.name ||
                            "Candidate"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {application.job?.title ||
                            "Job"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {application.candidate?.email ||
                            "Email not available"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-lg font-bold text-indigo-400">
                          {application.atsScore ?? 0}%
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ATS Score
                        </p>

                        <span className="mt-2 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {application.status}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default RecruiterDashboard;