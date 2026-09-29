import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [topCandidates, setTopCandidates] = useState([]);
  const [jobAnalytics, setJobAnalytics] = useState(null);
  const [applicationStatus, setApplicationStatus] =
    useState(null);
  const [recentApplications, setRecentApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH ADMIN DASHBOARD DATA
  // ======================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        dashboardResponse,
        candidatesResponse,
        jobsResponse,
        applicationsResponse,
        recentResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/top-candidates"),
        api.get("/admin/job-analytics"),
        api.get("/admin/application-status"),
        api.get("/admin/recent-applications"),
      ]);

      // ======================================
      // DASHBOARD
      // ======================================

      setDashboard(
        dashboardResponse.data.dashboard || {}
      );

      // ======================================
      // TOP CANDIDATES
      // ======================================

      setTopCandidates(
        candidatesResponse.data.candidates || []
      );

      // ======================================
      // JOB ANALYTICS
      // ======================================

      setJobAnalytics(
        jobsResponse.data.analytics ||
          jobsResponse.data.data ||
          jobsResponse.data ||
          {}
      );

      // ======================================
      // APPLICATION STATUS
      // ======================================

      setApplicationStatus(
        applicationsResponse.data.analytics || {}
      );

      // ======================================
      // RECENT APPLICATIONS
      // ======================================

      setRecentApplications(
        recentResponse.data.applications || []
      );

      console.log(
        "ADMIN DASHBOARD RESPONSE:",
        dashboardResponse.data
      );

      console.log(
        "TOP CANDIDATES:",
        candidatesResponse.data
      );

      console.log(
        "APPLICATION STATUS:",
        applicationsResponse.data
      );

      console.log(
        "RECENT APPLICATIONS:",
        recentResponse.data
      );
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

            <p className="mt-4 text-sm text-slate-400">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================
  // DASHBOARD VALUES
  // ======================================

  const totalUsers =
    dashboard?.users?.total ?? 0;

  const totalCandidates =
    dashboard?.users?.candidates ?? 0;

  const totalRecruiters =
    dashboard?.users?.recruiters ?? 0;

  const totalJobs =
    dashboard?.jobs?.total ?? 0;

  const totalApplications =
    dashboard?.applications?.total ?? 0;

  const activeJobs =
    dashboard?.jobs?.active ?? 0;

  const closedJobs =
    dashboard?.jobs?.closed ?? 0;

  const averageATSScore =
    dashboard?.averageATSScore ?? 0;

  // ======================================
  // APPLICATION STATUS
  // ======================================

  const getStatusValue = (status) => {
    if (!applicationStatus) {
      return 0;
    }

    return (
      applicationStatus[status] ?? 0
    );
  };

  const appliedApplications =
    getStatusValue("APPLIED");

  const shortlistedApplications =
    getStatusValue("SHORTLISTED");

  const interviewApplications =
    getStatusValue("INTERVIEW");

  const hiredApplications =
    getStatusValue("HIRED");

  const rejectedApplications =
    getStatusValue("REJECTED");

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div>
          <p className="text-sm font-medium text-indigo-400">
            ADMIN PANEL
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Welcome back, {user?.name || "Admin"}.
            Manage users, jobs and platform activity.
          </p>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            MAIN STATS
        ====================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* TOTAL USERS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Total Users
              </p>

              <span className="text-xl">
                👥
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalUsers}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Platform users
            </p>
          </div>

          {/* CANDIDATES */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Candidates
              </p>

              <span className="text-xl">
                👤
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalCandidates}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Registered candidates
            </p>
          </div>

          {/* RECRUITERS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Recruiters
              </p>

              <span className="text-xl">
                🧑‍💼
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalRecruiters}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Registered recruiters
            </p>
          </div>

          {/* JOBS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Jobs
              </p>

              <span className="text-xl">
                💼
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalJobs}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Platform jobs
            </p>
          </div>

          {/* APPLICATIONS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Applications
              </p>

              <span className="text-xl">
                📄
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-white">
              {totalApplications}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Total applications
            </p>
          </div>

        </div>

        {/* ======================================
            ADDITIONAL STATS
        ====================================== */}

        <div className="mt-5 grid gap-5 sm:grid-cols-3">

          {/* ACTIVE JOBS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Active Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {activeJobs}
            </p>
          </div>

          {/* CLOSED JOBS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Closed Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {closedJobs}
            </p>
          </div>

          {/* ATS SCORE */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Average ATS Score
            </p>

            <p className="mt-2 text-2xl font-bold text-indigo-400">
              {averageATSScore}
            </p>
          </div>

        </div>

        {/* ======================================
            MANAGEMENT
        ====================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          {/* USER MANAGEMENT */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              👥
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              User Management
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              View, manage, activate and deactivate
              platform users.
            </p>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Manage Users
            </button>

          </div>

          {/* JOB MANAGEMENT */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              💼
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Job Management
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Monitor jobs posted by recruiters and
              manage job status.
            </p>

            <button
              onClick={() =>
                navigate("/admin/jobs")
              }
              className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Manage Jobs
            </button>

          </div>

          {/* ANALYTICS */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              📊
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Platform Analytics
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Monitor applications, users and overall
              ATS platform activity.
            </p>

            <button
              onClick={() =>
                navigate("/admin/analytics")
              }
              className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              View Analytics
            </button>

          </div>

        </div>

        {/* ======================================
            APPLICATION STATUS
        ====================================== */}

        <div className="mt-8">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">
              Application Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current application pipeline
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {/* APPLIED */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Applied
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-400">
                {appliedApplications}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Total applied
              </p>

            </div>

            {/* SHORTLISTED */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Shortlisted
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-400">
                {shortlistedApplications}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Shortlisted candidates
              </p>

            </div>

            {/* INTERVIEW */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Interview
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-400">
                {interviewApplications}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Interview stage
              </p>

            </div>

            {/* HIRED */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Hired
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {hiredApplications}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Successfully hired
              </p>

            </div>

            {/* REJECTED */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <p className="text-sm text-slate-400">
                Rejected
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {rejectedApplications}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Rejected applications
              </p>

            </div>

          </div>

        </div>

        {/* ======================================
            TOP CANDIDATES
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-6">

            <h2 className="text-xl font-bold text-white">
              Top Candidates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Highest performing candidates
            </p>

          </div>

          {topCandidates.length === 0 ? (

            <div className="p-8 text-center text-sm text-slate-500">
              No candidate data available.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-slate-800">

                  <tr>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Candidate
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      ATS Score
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Job
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {topCandidates.map(
                    (candidate, index) => (

                      <tr
                        key={
                          candidate.applicationId ||
                          candidate.candidate?._id ||
                          index
                        }
                        className="hover:bg-slate-800/40"
                      >

                        {/* CANDIDATE */}

                        <td className="px-6 py-4">

                          <p className="font-medium text-white">
                            {candidate.candidate?.name ||
                              "Unknown Candidate"}
                          </p>

                          <p className="text-sm text-slate-500">
                            {candidate.candidate?.email ||
                              "-"}
                          </p>

                        </td>

                        {/* ATS SCORE */}

                        <td className="px-6 py-4">

                          <span className="font-semibold text-indigo-400">
                            {candidate.atsScore ?? 0}
                          </span>

                        </td>

                        {/* JOB */}

                        <td className="px-6 py-4">

                          <p className="text-sm text-slate-300">
                            {candidate.job?.title ||
                              "Unknown Job"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {candidate.job?.company ||
                              "-"}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                            {candidate.status ||
                              "APPLIED"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ======================================
            RECENT APPLICATIONS
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-6">

            <h2 className="text-xl font-bold text-white">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest activity on the platform
            </p>

          </div>

          {recentApplications.length === 0 ? (

            <div className="p-8 text-center text-sm text-slate-500">
              No recent applications.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="border-b border-slate-800">

                  <tr>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Candidate
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Job
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {recentApplications.map(
                    (application, index) => (

                      <tr
                        key={
                          application._id ||
                          application.id ||
                          index
                        }
                        className="hover:bg-slate-800/40"
                      >

                        {/* CANDIDATE */}

                        <td className="px-6 py-4">

                          <p className="font-medium text-white">
                            {application.candidate?.name ||
                              application.user?.name ||
                              application.candidateName ||
                              "Unknown"}
                          </p>

                          <p className="text-sm text-slate-500">
                            {application.candidate?.email ||
                              application.user?.email ||
                              "-"}
                          </p>

                        </td>

                        {/* JOB */}

                        <td className="px-6 py-4">

                          <p className="text-sm text-slate-300">
                            {application.job?.title ||
                              application.jobTitle ||
                              "Unknown Job"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {application.job?.company ||
                              "-"}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                            {application.status ||
                              "APPLIED"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-sm text-slate-500">

                          {application.createdAt ||
                          application.appliedAt ? (
                            new Date(
                              application.createdAt ||
                                application.appliedAt
                            ).toLocaleDateString()
                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ======================================
            ADMIN ACCOUNT
        ====================================== */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold text-white">
            Admin Account
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">

            {/* NAME */}

            <div>

              <p className="text-xs text-slate-500">
                Name
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {user?.name || "-"}
              </p>

            </div>

            {/* EMAIL */}

            <div>

              <p className="text-xs text-slate-500">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-200">
                {user?.email || "-"}
              </p>

            </div>

            {/* ROLE */}

            <div>

              <p className="text-xs text-slate-500">
                Role
              </p>

              <p className="mt-1 text-sm font-medium text-red-400">
                {user?.role || "ADMIN"}
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;