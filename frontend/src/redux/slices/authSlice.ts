import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
  isOtpPending: boolean;
}

const initialState: AuthState = {
  email: null,
  isOtpPending: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOtpPending(state, action: PayloadAction<string>) {
      state.email = action.payload;
      state.isOtpPending = true;
    },
    clearAuth(state) {
      state.email = null;
      state.isOtpPending = false;
    },
  },
});

export const { setOtpPending, clearAuth } = authSlice.actions;
export default authSlice.reducer;
