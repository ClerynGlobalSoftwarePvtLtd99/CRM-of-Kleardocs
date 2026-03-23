import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// --- Async Thunks ---

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/settings/general');
      // Handle both wrapped { data: { ... } } and raw { ... } responses
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/settings/general', settingsData);
      // Handle both wrapped and raw responses
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const fetchEmailCount = createAsyncThunk(
  'settings/fetchEmailCount',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await axiosInstance.get('/settings/email-count', { params });
      return response.data; // { status, total, data: [{date, count}] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch email count');
    }
  }
);

// --- Initial State ---

const initialState = {
  // General settings
  settings: null,
  settingsLoading: false,
  settingsError: null,
  updateLoading: false,
  updateError: null,

  // Email count
  emailCountData: [],
  emailCountTotal: 0,
  emailCountLoading: false,
  emailCountError: null,
};

// --- Slice ---

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsErrors: (state) => {
      state.settingsError = null;
      state.updateError = null;
      state.emailCountError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchSettings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload;
      });

    // updateSettings
    builder
      .addCase(updateSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });

    // fetchEmailCount
    builder
      .addCase(fetchEmailCount.pending, (state) => {
        state.emailCountLoading = true;
        state.emailCountError = null;
      })
      .addCase(fetchEmailCount.fulfilled, (state, action) => {
        state.emailCountLoading = false;
        state.emailCountTotal = action.payload.total || 0;
        state.emailCountData = action.payload.data || [];
      })
      .addCase(fetchEmailCount.rejected, (state, action) => {
        state.emailCountLoading = false;
        state.emailCountError = action.payload;
      });
  },
});

export const { clearSettingsErrors } = settingsSlice.actions;
export default settingsSlice.reducer;
