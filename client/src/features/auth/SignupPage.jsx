import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import AuthLayout from "./AuthLayout";

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const data = await signup(form).unwrap();
      dispatch(setCredentials(data));

      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch (err) {
      setError(err.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start your job search today">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
          <p className="mt-1 text-xs text-gray-400">
            Use an @arnifi.com email to sign up as admin
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white
                     shadow-sm hover:bg-cta-hover focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-cta
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-[0.98] transition-all duration-150"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
