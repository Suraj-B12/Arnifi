import { useParams, Link } from "react-router";
import { useGetCompanyQuery } from "../jobs/jobsApi";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-primary-light text-primary border border-primary-ring/40" },
  PART_TIME: { label: "Part-time", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  CONTRACT: { label: "Contract", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  INTERNSHIP: { label: "Internship", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  REMOTE: { label: "Remote", cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  HYBRID: { label: "Hybrid", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

export default function CompanyPage() {
  const { id } = useParams();
  const { data: company, isLoading, isError } = useGetCompanyQuery(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="h-6 w-32 rounded-lg bg-gray-100" />
        <div className="h-32 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold font-heading text-gray-900">Company not found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover transition">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition mb-6">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to jobs
      </Link>

      {/* Company header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
        <div className="flex items-start gap-4">
          {company.logo && (
            <img src={company.logo} alt={company.name} className="h-16 w-16 rounded-xl object-cover border border-gray-200" />
          )}
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-900">{company.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              {company.industry && <span>{company.industry}</span>}
              {company.size && (
                <>
                  <span className="text-gray-300">·</span>
                  <span>{company.size} employees</span>
                </>
              )}
              {company.location && (
                <>
                  <span className="text-gray-300">·</span>
                  <span>{company.location}</span>
                </>
              )}
            </div>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                 className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-hover transition">
                {company.website}
              </a>
            )}
          </div>
        </div>
        {company.about && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{company.about}</p>
        )}
      </div>

      {/* Open positions */}
      <h2 className="text-lg font-semibold font-heading text-gray-900 mb-4">
        Open Positions ({company.jobs?.length || 0})
      </h2>

      {!company.jobs?.length ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-300 bg-white">
          <p className="text-gray-500">No open positions at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {company.jobs.map((job) => {
            const badge = typeBadge[job.type] || typeBadge.FULL_TIME;
            const appCount = job._count?.applications || 0;
            return (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200
                           hover:shadow-sm hover:border-primary-ring"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold font-heading text-gray-900">{job.position}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <span>{job.location}</span>
                      {job.salary && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-green-600 font-medium">{job.salary}</span>
                        </>
                      )}
                      <span className="text-gray-300">·</span>
                      <span>{appCount} applicant{appCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
