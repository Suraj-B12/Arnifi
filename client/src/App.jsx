import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "./features/auth/authSlice";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";

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
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
