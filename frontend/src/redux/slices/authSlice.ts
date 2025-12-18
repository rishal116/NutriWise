import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },

    restoreAuth: (state) => {
      if (typeof window !== "undefined") {
        state.isAuthenticated = !!localStorage.getItem("token");
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { loginSuccess, restoreAuth, logout } = authSlice.actions;
export default authSlice.reducer;
