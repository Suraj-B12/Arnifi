import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Simple mutex to prevent parallel refresh races
let refreshPromise = null;

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = api.getState().auth.refreshToken;
        if (!refreshToken) {
          api.dispatch({ type: "auth/logout" });
          return null;
        }

        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST", body: { refreshToken } },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch({ type: "auth/setCredentials", payload: refreshResult.data });
          return refreshResult.data;
        } else {
          api.dispatch({ type: "auth/logout" });
          return null;
        }
      })();
    }

    try {
      const refreshData = await refreshPromise;

      if (refreshData) {
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      }
    } finally {
      // Only the last waiter clears the promise; all concurrent waiters
      // share the same promise reference so this is safe.
      refreshPromise = null;
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Job", "Application", "Profile", "Analytics", "Company"],
  endpoints: () => ({}),
});
