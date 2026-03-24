import { api } from "../../app/api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = analyticsApi;
