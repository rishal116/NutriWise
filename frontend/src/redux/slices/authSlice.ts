import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user/user.types";
import { tokenStorage } from "@/lib/auth/tokenStorage";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  initialized: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
    },

    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;

      if (action.payload) {
        tokenStorage.set(action.payload);
      } else {
        tokenStorage.remove();
      }
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.initialized = true;

      tokenStorage.remove();
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setAccessToken, logout, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
