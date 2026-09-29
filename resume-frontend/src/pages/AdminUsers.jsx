import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      setUsers(
        response.data.data?.users ||
          response.data.users ||
          []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // DEACTIVATE USER
  // ======================================
  const handleDeactivate = async (id) => {
    try {
      setError("");

      await api.patch(
        `/admin/users/${id}/deactivate`
      );

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to deactivate user"
      );
    }
  };

  // ======================================
  // ACTIVATE USER
  // ======================================
  const handleActivate = async (id) => {
    try {
      setError("");

      await api.patch(
        `/admin/users/${id}/activate`
      );

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to activate user"
      );
    }
  };

  // ======================================
  // DELETE USER
  // ======================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/admin/users/${id}`
      );

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              User Management
            </h1>

            <p className="mt-2 text-slate-400">
              Manage candidates, recruiters and platform users.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400">
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">

                  {users.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-800/40"
                    >

                      {/* USER */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {item.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {item.email}
                          </p>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                          {item.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={
                            item.isActive
                              ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
                              : "rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400"
                          }
                        >
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">

                          {/* VIEW */}
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/users/${item._id}`
                              )
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                          >
                            View
                          </button>

                          {/* ACTIVATE / DEACTIVATE */}
                          {item.isActive ? (
                            <button
                              onClick={() =>
                                handleDeactivate(
                                  item._id
                                )
                              }
                              className="rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleActivate(
                                  item._id
                                )
                              }
                              className="rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
                            >
                              Activate
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminUsers;