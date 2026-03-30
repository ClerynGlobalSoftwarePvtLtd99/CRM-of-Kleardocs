import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('crm-theme') || 'dark';

const initialState = {
  loading: false,
  theme: savedTheme, // 'dark' | 'light'
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
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('crm-theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('crm-theme', action.payload);
    },
  },
});

export const { startLoading, stopLoading, showToast, hideToast, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
