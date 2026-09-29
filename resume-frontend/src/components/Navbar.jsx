import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ======================================
  // PROFILE NAVIGATION
  // ======================================
  const handleProfile = () => {
    if (user?.role === "CANDIDATE") {
      navigate("/candidate/profile");
    } else if (user?.role === "RECRUITER") {
      navigate("/recruiter/profile");
    } else if (user?.role === "ADMIN") {
      navigate("/admin/profile");
    }
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* ======================================
            LOGO
        ====================================== */}

        <div
          onClick={() => {
            if (user?.role === "CANDIDATE") {
              navigate("/candidate/dashboard");
            } else if (user?.role === "RECRUITER") {
              navigate("/recruiter/dashboard");
            } else if (user?.role === "ADMIN") {
              navigate("/admin/dashboard");
            } else {
              navigate("/login");
            }
          }}
          className="cursor-pointer"
        >
          <h1 className="text-xl font-bold text-white">
            AI ATS
          </h1>

          <p className="text-xs text-slate-500">
            Applicant Tracking System
          </p>
        </div>

        {/* ======================================
            RIGHT SECTION
        ====================================== */}

        {user && (
          <div className="flex items-center gap-4">

            {/* ======================================
                CANDIDATE NAVIGATION
            ====================================== */}

            {user.role === "CANDIDATE" && (
              <button
                onClick={() =>
                  navigate("/candidate/jobs")
                }
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Find Jobs
              </button>
            )}

            {/* ======================================
                USER NAME + ROLE
            ====================================== */}

            <button
              type="button"
              onClick={handleProfile}
              className="hidden cursor-pointer text-right sm:block"
            >
              <p className="text-sm font-medium text-white transition hover:text-indigo-400">
                {user.name}
              </p>

              <p className="text-xs font-medium text-indigo-400">
                {user.role}
              </p>
            </button>

            {/* ======================================
                AVATAR / PROFILE BUTTON
            ====================================== */}

            <button
              type="button"
              onClick={handleProfile}
              title="View Profile"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 font-semibold text-white transition hover:bg-indigo-500 hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 hover:ring-offset-slate-900"
            >
              {user.name?.charAt(0).toUpperCase() || "P"}
            </button>

            {/* ======================================
                LOGOUT
            ====================================== */}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;