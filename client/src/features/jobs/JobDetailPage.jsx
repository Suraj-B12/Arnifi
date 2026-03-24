import { useParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../auth/authSlice";
import { useGetJobQuery, useApplyToJobMutation } from "./jobsApi";
import { useGetApplicationsQuery } from "../applications/applicationsApi";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-primary-light text-primary border border-primary-ring/40" },
  PART_TIME: { label: "Part-time", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  CONTRACT: { label: "Contract", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  INTERNSHIP: { label: "Internship", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  REMOTE: { label: "Remote", cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  HYBRID: { label: "Hybrid", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

export default function JobDetailPage() {
  const { id } = useParams();
  const isAdmin = useSelector(selectIsAdmin);
  const { data: job, isLoading, isError } = useGetJobQuery(id);
  const { data: applications = [] } = useGetApplicationsQuery();
  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation();

  const applied = applications.some((a) => a.jobId === id);
  const badge = typeBadge[job?.type] || typeBadge.FULL_TIME;

  const handleApply = async () => {
    try {
      await applyToJob(id).unwrap();
    } catch {
      // handled by RTK Query
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-6 w-32 rounded-lg bg-gray-200" />
        <div className="h-10 w-3/4 rounded-lg bg-gray-200" />
        <div className="h-6 w-1/2 rounded-lg bg-gray-100" />
        <div className="h-48 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold font-heading text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-500">This job may have been removed.</p>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover transition">
          Back to jobs
        </Link>
      </div>
    );
  }

  const appCount = job._count?.applications || 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition mb-6">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">{job.position}</h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  {job.company ? (
                    <Link to={`/companies/${job.company.id}`} className="font-medium text-primary hover:text-primary-hover transition">
                      {job.company.name}
                    </Link>
                  ) : (
                    <span>{job.companyName}</span>
                  )}
                  <span className="text-gray-300">·</span>
                  <span>{job.location}</span>
                  {job.salary && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-green-600 font-medium">{job.salary}</span>
                    </>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badge.cls}`}>
                {badge.label}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
              <span>{appCount} applicant{appCount !== 1 ? "s" : ""}</span>
              {job.viewCount != null && <span>{job.viewCount} view{job.viewCount !== 1 ? "s" : ""}</span>}
              {job.acceptanceRate > 0 && <span>{job.acceptanceRate}% offer rate</span>}
              <span>
                Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold font-heading text-gray-900 mb-3">Description</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold font-heading text-gray-900 mb-3">Requirements</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
            </div>
          )}

          {/* Interview Process */}
          {job.interviewProcess && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold font-heading text-gray-900 mb-3">Interview Process</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.interviewProcess}</p>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold font-heading text-gray-900 mb-3">Benefits</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{job.benefits}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply CTA */}
          {!isAdmin && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              {applied ? (
                <div className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Applied
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-cta-text shadow-sm
                             hover:bg-cta-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-150"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}
            </div>
          )}

          {/* Company card */}
          {job.company && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold font-heading text-gray-900 mb-3">About the Company</h3>
              <Link to={`/companies/${job.company.id}`} className="text-base font-semibold text-primary hover:text-primary-hover transition">
                {job.company.name}
              </Link>
              {job.company.industry && <p className="mt-1 text-xs text-gray-500">{job.company.industry}</p>}
              {job.company.size && <p className="text-xs text-gray-500">{job.company.size} employees</p>}
              {job.company.location && <p className="text-xs text-gray-500">{job.company.location}</p>}
              {job.company.about && <p className="mt-3 text-sm text-gray-600 line-clamp-4">{job.company.about}</p>}
              {job.company.website && (
                <a href={job.company.website} target="_blank" rel="noopener noreferrer"
                   className="mt-3 inline-block text-xs font-medium text-primary hover:text-primary-hover transition">
                  Visit website
                </a>
              )}
            </div>
          )}

          {/* Posted by */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold font-heading text-gray-900 mb-2">Posted by</h3>
            <p className="text-sm text-gray-600">{job.postedBy?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
