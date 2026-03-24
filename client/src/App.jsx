import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "./features/auth/authSlice";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import AppLayout from "./components/AppLayout";
import JobsPage from "./features/jobs/JobsPage";
import AppliedJobsPage from "./features/applications/AppliedJobsPage";
function AdminDashboard() {
  return <div className="text-gray-500 text-center py-20">Admin dashboard coming soon...</div>;
}
function PostJobPage() {
  return <div className="text-gray-500 text-center py-20">Post job coming soon...</div>;
}

function AuthRedirect({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/jobs"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />

        {/* Authenticated routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            {/* User routes */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/applied" element={<AppliedJobsPage />} />

            {/* Admin routes */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/post-job" element={<PostJobPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
