import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SignupState {
  email: string | null;
}

const initialState: SignupState = {
  email: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setSignupEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("signupEmail", action.payload);
      }
    },
    restoreSignupEmail: (state) => {
      if (typeof window !== "undefined") {
        state.email = localStorage.getItem("signupEmail");
      }
    },
    clearSignupEmail: (state) => {
      state.email = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("signupEmail");
      }
    },
  },
});

export const { setSignupEmail, restoreSignupEmail, clearSignupEmail } =
  signupSlice.actions;
export default signupSlice.reducer;
