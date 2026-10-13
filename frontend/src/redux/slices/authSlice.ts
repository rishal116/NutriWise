import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/types/user/user.types";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  initialized: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.initialized = true;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.initialized = true;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
