import { api } from "../../app/api";

export const jobsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => "/jobs",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Job", id })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
    }),
    createJob: builder.mutation({
      query: (job) => ({
        url: "/jobs",
        method: "POST",
        body: job,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
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
      ],
    }),
    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}/apply`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Application", id: "LIST" }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
} = jobsApi;
