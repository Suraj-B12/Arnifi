import { useState, useMemo } from "react";
import { useGetJobsQuery, useApplyToJobMutation } from "./jobsApi";
import { useGetApplicationsQuery } from "../applications/applicationsApi";
import JobCard from "./JobCard";
import ScrollReveal from "../../components/ScrollReveal";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/4 rounded-lg bg-gray-200" />
          <div className="h-4 w-1/2 rounded-lg bg-gray-100" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-4 w-24 rounded-lg bg-gray-100" />
        <div className="h-4 w-16 rounded-lg bg-gray-100" />
      </div>
      <div className="mt-5 h-10 rounded-xl bg-gray-100" />
    </div>
  );
}

export default function JobsPage() {
  const { data: jobs = [], isLoading, isError } = useGetJobsQuery();
  const { data: applications = [] } = useGetApplicationsQuery();
  const [applyToJob, { isLoading: applyingId }] = useApplyToJobMutation();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [applyingJobId, setApplyingJobId] = useState(null);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId)),
    [applications]
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.position.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "ALL" || job.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [jobs, search, typeFilter]);

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      await applyToJob(jobId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
    setApplyingJobId(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          Browse Jobs
        </h1>
        <p className="mt-1 text-gray-500">
          {isLoading ? "Loading..." : `${filteredJobs.length} positions available`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by position, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring transition"
        >
          <option value="ALL">All Types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
        </select>
      </div>

      {/* Job Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Failed to load jobs. Please try again.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold font-heading text-gray-900">
            No jobs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
          {(search || typeFilter !== "ALL") && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("ALL"); }}
              className="mt-4 text-sm font-medium text-primary hover:text-primary-hover transition"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job, i) => (
            <ScrollReveal key={job.id} delay={Math.min(i * 60, 300)}>
              <JobCard
                job={job}
                onApply={handleApply}
                applying={applyingJobId === job.id}
                applied={appliedJobIds.has(job.id)}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
