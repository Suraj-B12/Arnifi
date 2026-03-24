import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
const storedRefreshToken = localStorage.getItem("refreshToken");

const initialState = {
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  refreshToken: storedRefreshToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectIsAdmin = (state) => state.auth.user?.role === "ADMIN";
export const selectRefreshToken = (state) => state.auth.refreshToken;

export default authSlice.reducer;
