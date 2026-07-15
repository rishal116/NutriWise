import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import signupReducer from "./slices/signupSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    signup: signupReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
