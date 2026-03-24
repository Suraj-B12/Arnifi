import { api } from "../../app/api";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: "/profile/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getUserProfile: builder.query({
      query: (userId) => `/profile/${userId}`,
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadResumeMutation,
  useGetUserProfileQuery,
} = profileApi;
