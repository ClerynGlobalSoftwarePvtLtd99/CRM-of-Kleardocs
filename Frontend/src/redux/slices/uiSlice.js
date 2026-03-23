import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  toast: {
    message: '',
    type: null, // 'success', 'error', 'info', etc.
    isVisible: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'success',
        isVisible: true,
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
  },
});

export const { startLoading, stopLoading, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
