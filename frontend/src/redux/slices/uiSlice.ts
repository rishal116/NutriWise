import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isLoading: boolean;
  loadingText: string;
}

const initialState: UiState = {
  isLoading: false,
  loadingText: "Loading...",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.loadingText = action.payload ?? "Loading...";
    },

    hideLoading: (state) => {
      state.isLoading = false;
      state.loadingText = "Loading...";
    },
  },
});

export const { showLoading, hideLoading } = uiSlice.actions;

export default uiSlice.reducer;
