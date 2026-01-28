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
    },
    restoreSignupEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    clearSignupEmail: (state) => {
      state.email = null;
    },
  },
});

export const { setSignupEmail, restoreSignupEmail, clearSignupEmail } =
  signupSlice.actions;

export default signupSlice.reducer;
