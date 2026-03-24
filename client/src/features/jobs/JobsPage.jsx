import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../auth/authSlice";
import { useGetJobsQuery, useApplyToJobMutation } from "./jobsApi";
import { useGetApplicationsQuery } from "../applications/applicationsApi";
import JobCard from "./JobCard";
import ScrollReveal from "../../components/ScrollReveal";

const typeOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const typeColors = {
  FULL_TIME: "bg-teal-100 text-teal-700 border-teal-300",
  PART_TIME: "bg-sky-100 text-sky-700 border-sky-300",
  CONTRACT: "bg-amber-100 text-amber-700 border-amber-300",
  INTERNSHIP: "bg-violet-100 text-violet-700 border-violet-300",
  REMOTE: "bg-emerald-100 text-emerald-700 border-emerald-300",
  HYBRID: "bg-rose-100 text-rose-700 border-rose-300",
};

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
  const isAdmin = useSelector(selectIsAdmin);
  const { data: applications = [] } = useGetApplicationsQuery();
  const [applyToJob] = useApplyToJobMutation();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const sentinelRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce location input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLocation(locationFilter), 300);
    return () => clearTimeout(timer);
  }, [locationFilter]);

  // Reset cursor when filters change
  useEffect(() => {
    setCursor(null);
  }, [debouncedSearch, debouncedLocation, selectedTypes]);

  const { data, isLoading, isFetching, isError } = useGetJobsQuery({
    search: debouncedSearch || undefined,
    types: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
    location: debouncedLocation || undefined,
    cursor: cursor || undefined,
  });

  const jobs = data?.jobs || [];

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.hasMore && !isFetching) {
          setCursor(data.nextCursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [data?.hasMore, data?.nextCursor, isFetching]);

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.jobId)),
    [applications]
  );

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      await applyToJob(jobId).unwrap();
    } catch {
      // Error handled by RTK Query
    }
    setApplyingJobId(null);
  };

  const hasActiveFilters =
    searchInput || locationFilter || selectedTypes.length > 0;

  const clearFilters = () => {
    setSearchInput("");
    setLocationFilter("");
    setSelectedTypes([]);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          Browse Jobs
        </h1>
        <p className="mt-1 text-gray-500">
          {isLoading
            ? "Loading..."
            : `${jobs.length}${data?.hasMore ? "+" : ""} position${jobs.length !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Search & Location */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by position, company, or location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>
        <div className="relative sm:w-56">
          <svg
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {typeOptions.map(({ value, label }) => {
          const active = selectedTypes.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition
                ${
                  active
                    ? typeColors[value]
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                }`}
            >
              {label}
            </button>
          );
        })}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium
                       text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
          >
            Clear all
          </button>
        )}
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
          <p className="text-gray-500">
            Failed to load jobs. Please try again.
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold font-heading text-gray-900">
            No jobs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-primary hover:text-primary-hover transition"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <ScrollReveal key={job.id} delay={Math.min(i * 60, 300)}>
              <JobCard
                job={job}
                onApply={isAdmin ? null : handleApply}
                applying={applyingJobId === job.id}
                applied={appliedJobIds.has(job.id)}
                isAdmin={isAdmin}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-10" />

      {/* Loading spinner for fetching more */}
      {isFetching && !isLoading && (
        <div className="flex justify-center py-6">
          <svg
            className="h-6 w-6 animate-spin text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
