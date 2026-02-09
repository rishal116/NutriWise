import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    },

    restoreAuth: (state) => {
      if (typeof window !== "undefined") {
        state.isAuthenticated = !!localStorage.getItem("token");
      }
      state.loading = false;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { loginSuccess, restoreAuth, logout } = authSlice.actions;
export default authSlice.reducer;
