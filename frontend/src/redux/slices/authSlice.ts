import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  role: "client" | "nutritionist" | null;
}

const initialState: UserState = {
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserEmailAndRole: (
      state,
      action: PayloadAction<{ email: string; role: "client" | "nutritionist" }>
    ) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUserEmailAndRole, clearUser } = userSlice.actions;
export default userSlice.reducer;
