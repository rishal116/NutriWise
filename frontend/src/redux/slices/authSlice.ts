import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SafeUserDto } from "@/types/auth.types";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  user: SafeUserDto | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: SafeUserDto }>,
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    setUser: (state, action: PayloadAction<SafeUserDto>) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;

