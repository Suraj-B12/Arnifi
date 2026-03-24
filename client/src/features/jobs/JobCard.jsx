const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-blue-100 text-blue-800" },
  PART_TIME: { label: "Part-time", cls: "bg-purple-100 text-purple-800" },
};

export default function JobCard({ job, onApply, applying, applied }) {
  const badge = typeBadge[job.type] || typeBadge.FULL_TIME;

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm
                    transition-all duration-200 hover:shadow-md hover:border-primary-ring">
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

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {job.location}
        </span>
        <span className="text-gray-300">|</span>
        <span>
          {new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {onApply && (
        <div className="mt-5">
          <button
            onClick={() => onApply(job.id)}
            disabled={applying || applied}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150
                       active:scale-[0.98] disabled:cursor-not-allowed
                       ${applied
                         ? "bg-gray-100 text-gray-500 border border-gray-200"
                         : "bg-cta text-cta-text shadow-sm hover:bg-cta-hover"
                       }`}
          >
            {applied ? "Already Applied" : applying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      )}
    </div>
  );
}
