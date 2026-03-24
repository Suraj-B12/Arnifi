import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold font-heading text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold font-heading text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-cta px-6 py-2.5 text-sm font-semibold
                     text-white shadow-sm hover:bg-cta-hover transition-all duration-150"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
