import { useState } from "react";
import { useGetApplicationsQuery, useWithdrawApplicationMutation } from "./applicationsApi";

const typeBadge = {
  FULL_TIME:   { label: "Full-time",   cls: "bg-primary-light text-primary border border-primary-ring/40" },
  PART_TIME:   { label: "Part-time",   cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  CONTRACT:    { label: "Contract",    cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  INTERNSHIP:  { label: "Internship",  cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  REMOTE:      { label: "Remote",      cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  HYBRID:      { label: "Hybrid",      cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

const statusBadge = {
  PENDING:   { label: "Awaiting Review", icon: "●", cls: "inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white" },
  REVIEWED:  { label: "Under Review",   icon: "○", cls: "inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white" },
  INTERVIEW: { label: "Interview Stage", icon: "◇", cls: "inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white" },
  OFFER:     { label: "Offer Extended",  icon: "✓", cls: "inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white" },
  REJECTED:  { label: "Not Selected",    icon: "✕", cls: "inline-flex items-center gap-1.5 rounded-full bg-gray-400 px-3 py-1 text-xs font-medium text-white" },
  WITHDRAWN: { label: "Withdrawn",       icon: "↩", cls: "inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white" },
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
  const [withdrawApplication, { isLoading: isWithdrawing }] = useWithdrawApplicationMutation();
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);

  const handleWithdraw = async (appId) => {
    try {
      await withdrawApplication(appId).unwrap();
    } catch {
      // handled by RTK Query
    }
    setConfirmWithdrawId(null);
  };

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
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-cta px-5 py-2.5
                       text-sm font-semibold text-cta-text shadow-sm
                       hover:bg-cta-hover active:scale-[0.98] transition-all duration-150"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Browse Jobs
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const tBadge = typeBadge[app.job.type] || typeBadge.FULL_TIME;
            const sBadge = statusBadge[app.status] || statusBadge.PENDING;
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200
                           hover:shadow-sm hover:border-primary-ring"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold font-heading text-gray-900 truncate">
                        {app.job.position}
                      </h3>
                      <span className={sBadge.cls}>
                        <span>{sBadge.icon}</span>{sBadge.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>{app.job.companyName}</span>
                      <span className="text-gray-300">·</span>
                      <span>{app.job.location}</span>
                      {app.job.salary && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-green-600 font-medium">{app.job.salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tBadge.cls}`}>
                      {tBadge.label}
                    </span>
                    <div className="text-xs text-gray-400">
                      <span>Applied </span>
                      <span>
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status note from admin */}
                {app.statusNote && (
                  <p className="mt-2 text-xs text-gray-500 italic">
                    Note: {app.statusNote}
                  </p>
                )}

                {/* Show reviewed date if available */}
                {app.reviewedAt && (
                  <p className="mt-2 text-xs text-gray-400">
                    Last updated {new Date(app.reviewedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                )}

                {/* Withdraw button for pending applications */}
                {app.status === "PENDING" && (
                  <div className="mt-3">
                    {confirmWithdrawId === app.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Withdraw this application?</span>
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={isWithdrawing}
                          className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white
                                     hover:bg-red-600 active:scale-[0.97] transition-all duration-150
                                     disabled:opacity-50"
                        >
                          {isWithdrawing ? "Withdrawing..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmWithdrawId(null)}
                          className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600
                                     hover:bg-gray-300 transition-all duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmWithdrawId(app.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600
                                   hover:bg-red-100 active:scale-[0.97] transition-all duration-150"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
