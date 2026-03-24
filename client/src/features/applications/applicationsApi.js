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
    }),
  }),
});

export const { useGetApplicationsQuery } = applicationsApi;
