import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/admin/dashboard"
            className="text-xl font-bold text-blue-400"
          >
            ATS Resume
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/admin/dashboard"
              className="hover:text-blue-400 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/users"
              className="hover:text-blue-400 transition"
            >
              Users
            </Link>

            <Link
              to="/admin/jobs"
              className="hover:text-blue-400 transition"
            >
              Jobs
            </Link>

            {/* Admin Info */}
            <div className="border-l border-gray-700 pl-6">
              <p className="text-sm font-medium">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-400">
                {user?.role || "ADMIN"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">

            <Link
              to="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/users"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-blue-400"
            >
              Users
            </Link>

            <Link
              to="/admin/jobs"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-blue-400"
            >
              Jobs
            </Link>

            <div className="border-t border-gray-700 pt-3">
              <p className="text-sm">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-400 mb-3">
                {user?.role || "ADMIN"}
              </p>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;