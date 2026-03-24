import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");

let storedUser = null;
try {
  const raw = localStorage.getItem("user");
  if (raw) storedUser = JSON.parse(raw);
} catch {
  localStorage.removeItem("user");
}

const initialState = {
  token: storedToken || null,
  user: storedUser,
  refreshToken: storedRefreshToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, refreshToken } = action.payload;
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      if (user) {
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
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
