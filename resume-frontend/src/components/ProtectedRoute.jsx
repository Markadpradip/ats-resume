import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const { user, loading } = useAuth();

  // Auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Login 
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Role allowed नसेल
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;