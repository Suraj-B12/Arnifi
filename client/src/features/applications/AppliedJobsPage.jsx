import { useGetApplicationsQuery } from "./applicationsApi";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-blue-100 text-blue-800" },
  PART_TIME: { label: "Part-time", cls: "bg-purple-100 text-purple-800" },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-5 w-2/3 rounded-lg bg-gray-200" />
        <div className="h-4 w-1/3 rounded-lg bg-gray-100" />
      </div>
      <div className="h-6 w-20 rounded-full bg-gray-100" />
    </div>
  );
}

export default function AppliedJobsPage() {
  const { data: applications = [], isLoading, isError } = useGetApplicationsQuery();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          My Applications
        </h1>
        <p className="mt-1 text-gray-500">
          {isLoading ? "Loading..." : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Failed to load applications. Please try again.</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0 0l2.25-2.25M9.75 15l2.25 2.25M3.375 7.5h17.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125H3.375a1.125 1.125 0 01-1.125-1.125v-8.25c0-.621.504-1.125 1.125-1.125z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold font-heading text-gray-900">
            No applications yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start browsing jobs and apply to positions that interest you
          </p>
          <a
            href="/jobs"
            className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover transition"
          >
            Browse jobs
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const badge = typeBadge[app.job.type] || typeBadge.FULL_TIME;
            return (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl
                           border border-gray-200 bg-white p-5 transition-all duration-200
                           hover:shadow-sm hover:border-primary-ring"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold font-heading text-gray-900 truncate">
                    {app.job.position}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{app.job.companyName}</span>
                    <span className="text-gray-300">·</span>
                    <span>{app.job.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>Applied</span>
                    <span>
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
