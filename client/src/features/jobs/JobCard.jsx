import { Link } from "react-router";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-primary-light text-primary border border-primary-ring/40" },
  PART_TIME: { label: "Part-time", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  CONTRACT: { label: "Contract", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  INTERNSHIP: { label: "Internship", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  REMOTE: { label: "Remote", cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  HYBRID: { label: "Hybrid", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

export default function JobCard({ job, onApply, applying, applied, isAdmin }) {
  const badge = typeBadge[job.type] || typeBadge.FULL_TIME;
  const appCount = job._count?.applications || 0;

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm
                      transition-all duration-200 hover:shadow-md hover:border-gray-300">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold font-heading text-gray-900 truncate">
              {job.position}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{job.companyName}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
            {badge.label}
          </span>
        </div>

        {/* Description preview */}
        {job.description && (
          <p className="mt-2 text-xs text-gray-400 line-clamp-2">{job.description}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {job.location}
          </span>
          {job.salary && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 font-medium">{job.salary}</span>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <span>{appCount} applicant{appCount !== 1 ? "s" : ""}</span>
          <span className="text-gray-300">|</span>
          <span>
            {new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Action area */}
        {!isAdmin && onApply && (
          <div className="mt-5">
            {applied ? (
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200
                              bg-gray-50 px-4 py-2.5 text-sm text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Applied
              </div>
            ) : (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onApply(job.id); }}
                disabled={applying}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl
                           bg-cta px-4 py-2.5 text-sm font-semibold text-cta-text shadow-sm
                           hover:bg-cta-hover active:scale-[0.98]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-150"
              >
                {applying ? (
                  "Applying..."
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Apply Now
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
