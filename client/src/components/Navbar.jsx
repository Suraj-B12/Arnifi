import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAdmin, logout } from "../features/auth/authSlice";
import { api } from "../app/api";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150";
const linkActive = "bg-primary-light text-primary font-semibold";
const linkInactive = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login", { replace: true });
  };

  const navLinks = isAdmin
    ? [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/post-job", label: "Post Job" },
        { to: "/jobs", label: "All Jobs" },
      ]
    : [
        { to: "/jobs", label: "Browse Jobs" },
        { to: "/applied", label: "My Applications" },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={isAdmin ? "/admin/dashboard" : "/jobs"} className="flex items-center gap-2">
            <span className="text-xl font-extrabold font-heading text-primary tracking-tight">
              Arnifi
            </span>
            <span className="hidden sm:inline text-xs font-medium text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
              {isAdmin ? "Admin" : "Jobs"}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600
                         hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
            >
              Sign out
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2
                       text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block ${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between px-3">
              <span className="text-sm text-gray-500">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
