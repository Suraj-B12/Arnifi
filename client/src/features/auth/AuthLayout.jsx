import { cn } from "../../lib/cn";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] bg-dot-grid px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold font-heading text-primary tracking-tight">
            Arnifi
          </h1>
          <p className="mt-1 text-sm text-gray-500">Job Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-heading text-gray-900">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
