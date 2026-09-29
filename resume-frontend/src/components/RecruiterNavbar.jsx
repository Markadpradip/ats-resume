import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RecruiterNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/recruiter/profile");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* ======================================
            LOGO
        ====================================== */}

        <button
          onClick={() =>
            navigate("/recruiter/dashboard")
          }
          className="text-xl font-bold text-white"
        >
          ATS Resume
        </button>

        {/* ======================================
            NAV LINKS
        ====================================== */}

        <div className="hidden items-center gap-6 md:flex">

          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate("/recruiter/dashboard")
            }
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Dashboard
          </button>

          {/* CREATE JOB */}

          <button
            onClick={() =>
              navigate("/recruiter/jobs/create")
            }
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Create Job
          </button>

          {/* MY JOBS */}

          <button
            onClick={() =>
              navigate("/recruiter/jobs")
            }
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            My Jobs
          </button>

          {/* APPLICATIONS */}

          <button
            onClick={() =>
              navigate("/recruiter/applications")
            }
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Applications
          </button>

        </div>

        {/* ======================================
            USER PROFILE + LOGOUT
        ====================================== */}

        {/* USER PROFILE + LOGOUT */}

<div className="flex items-center gap-3">

  {/* PROFILE BUTTON */}

  <button
    onClick={() => navigate("/recruiter/profile")}
    className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 transition-all duration-200 hover:border-indigo-500 hover:bg-slate-800"
  >
    {/* Profile Icon */}

    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
      👤
    </div>

    {/* Name + Profile */}

    <div className="hidden text-left sm:block">
      <p className="text-sm font-semibold text-white">
        {user?.name || "Recruiter"}
      </p>

      <p className="text-xs text-indigo-400">
        View Profile
      </p>
    </div>

  </button>

  {/* LOGOUT */}

  <button
    onClick={handleLogout}
    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
  >
    Logout
  </button>

</div>

      </div>
    </nav>
  );
}

export default RecruiterNavbar;