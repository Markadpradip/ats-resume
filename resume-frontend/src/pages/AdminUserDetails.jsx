import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/users/${id}`
      );

      setUser(
        response.data.data?.user ||
        response.data.user
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">

        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          ← Back to Users
        </button>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        ) : user ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-400">
                ADMIN PANEL
              </p>

              <h1 className="mt-1 text-3xl font-bold text-white">
                User Details
              </h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-lg font-medium text-white">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-lg text-white">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-lg text-white">
                  {user.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>

                <p className="mt-1 text-lg font-medium text-indigo-400">
                  {user.role}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Account Status
                </p>

                <p
                  className={
                    user.isActive
                      ? "mt-1 font-medium text-emerald-400"
                      : "mt-1 font-medium text-red-400"
                  }
                >
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Created At
                </p>

                <p className="mt-1 text-white">
                  {user.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleString()
                    : "-"}
                </p>
              </div>

            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
}

export default AdminUserDetails;