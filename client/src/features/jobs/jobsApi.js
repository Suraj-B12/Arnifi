import { api } from "../../app/api";

export const jobsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: ({ search, types, location, cursor, limit = 12 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (types) params.set("type", types);
        if (location) params.set("location", location);
        if (cursor) params.set("cursor", cursor);
        params.set("limit", String(limit));
        return `/jobs?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { cursor, ...rest } = queryArgs || {};
        return rest;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (newItems.jobs) {
          // If no cursor, this is a first-page fetch (filter change or initial load) -- replace cache
          if (!arg?.cursor) {
            currentCache.jobs = newItems.jobs;
          } else {
            const existingIds = new Set(currentCache.jobs?.map((j) => j.id) || []);
            const uniqueNew = newItems.jobs.filter((j) => !existingIds.has(j.id));
            currentCache.jobs = [...(currentCache.jobs || []), ...uniqueNew];
          }
          currentCache.nextCursor = newItems.nextCursor;
          currentCache.hasMore = newItems.hasMore;
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: (result) =>
        result?.jobs
          ? [
              ...result.jobs.map(({ id }) => ({ type: "Job", id })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    createJob: builder.mutation({
      query: (job) => ({
        url: "/jobs",
        method: "POST",
        body: job,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }, "Analytics"],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/jobs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
        "Analytics",
      ],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
        { type: "Application", id: "LIST" },
        "Analytics",
      ],
    }),
    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}/apply`,
        method: "POST",
      }),
      invalidatesTags: (result, error, jobId) => [
        { type: "Application", id: "LIST" },
        { type: "Job", id: jobId },
        { type: "Job", id: "LIST" },
      ],
    }),
    getJobApplications: builder.query({
      query: (jobId) => `/jobs/${jobId}/applications`,
      providesTags: (result, error, jobId) => [{ type: "Application", id: `JOB_${jobId}` }],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ jobId, appId, status, statusNote, adminNotes }) => ({
        url: `/jobs/${jobId}/applications/${appId}`,
        method: "PATCH",
        body: { status, statusNote, adminNotes },
      }),
      invalidatesTags: (result, error, { jobId }) => [
        { type: "Application", id: `JOB_${jobId}` },
        { type: "Application", id: "LIST" },
        "Analytics",
      ],
    }),
    getJob: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),
    getCompanies: builder.query({
      query: () => "/companies",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Company", id })),
              { type: "Company", id: "LIST" },
            ]
          : [{ type: "Company", id: "LIST" }],
    }),
    getCompany: builder.query({
      query: (id) => `/companies/${id}`,
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),
    createCompany: builder.mutation({
      query: (company) => ({
        url: "/companies",
        method: "POST",
        body: company,
      }),
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Company", id },
        { type: "Company", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
  useGetJobApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = jobsApi;
