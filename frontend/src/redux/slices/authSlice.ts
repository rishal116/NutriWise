import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;

    }
  },
});

export const { loginSuccess, logout, setToken } = authSlice.actions;
export default authSlice.reducer;