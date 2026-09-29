import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import RecruiterProfile from "./pages/RecruiterProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import RecruiterJobDetails from "./pages/RecruiterJobDetails";
import ViewApplications from "./pages/ViewApplications";

import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import UploadResume from "./pages/UploadResume";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white">
          403
        </h1>

        <p className="mt-3 text-slate-400">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            CANDIDATE
        ========================= */}

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/profile"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/upload-resume"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <UploadResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/jobs"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <FindJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/jobs/:id"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/jobs/:id/apply"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute
              allowedRoles={["CANDIDATE"]}
            >
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* =========================
            RECRUITER
        ========================= */}
        <Route
  path="/recruiter/profile"
  element={
    <ProtectedRoute allowedRoles={["RECRUITER"]}>
      <RecruiterProfile />
    </ProtectedRoute>
  }
/>

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["RECRUITER"]}
            >
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/create"
          element={
            <ProtectedRoute
              allowedRoles={["RECRUITER"]}
            >
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
  path="/recruiter/jobs"
  element={
    <ProtectedRoute
      allowedRoles={["RECRUITER"]}
    >
      <MyJobs />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/jobs/:id"
  element={
    <ProtectedRoute
      allowedRoles={["RECRUITER"]}
    >
      <RecruiterJobDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/recruiter/jobs/:id/applications"
  element={
    <ProtectedRoute
      allowedRoles={["RECRUITER"]}
    >
      <ViewApplications />
    </ProtectedRoute>
  }
/>


        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================
            UNAUTHORIZED
        ========================= */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* =========================
            DEFAULT
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;