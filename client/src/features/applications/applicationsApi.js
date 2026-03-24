import { api } from "../../app/api";

export const applicationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query({
      query: () => "/applications",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Application", id })),
              { type: "Application", id: "LIST" },
            ]
          : [{ type: "Application", id: "LIST" }],
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    withdrawApplication: builder.mutation({
      query: (appId) => ({
        url: `/applications/${appId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Application", id: "LIST" },
        { type: "Job", id: "LIST" },
        "Analytics",
      ],
    }),
  }),
});

export const { useGetApplicationsQuery, useWithdrawApplicationMutation } = applicationsApi;
