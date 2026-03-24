import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../features/auth/authSlice";

export default function RequireAdmin() {
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAdmin) {
    return <Navigate to="/jobs" replace />;
  }

  return <Outlet />;
}
