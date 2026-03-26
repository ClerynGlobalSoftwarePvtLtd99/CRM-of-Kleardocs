import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchGlobalCompliances = createAsyncThunk(
  'globalCompliances/fetchGlobalCompliances',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/compliances', { params });
      return response.data; // ApiResponse format: { success, data, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliances');
    }
  }
);

export const updateGlobalCompliance = createAsyncThunk(
  'globalCompliances/updateGlobalCompliance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/compliances/${id}`, data);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update compliance');
    }
  }
);

const globalCompliancesSlice = createSlice({
  name: 'globalCompliances',
  initialState: {
    list: [],
    loading: false,
    error: null,
    totalCount: 0
  },
  reducers: {
    clearGlobalCompliances: (state) => {
      state.list = [];
      state.totalCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalCompliances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalCompliances.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.totalCount = action.payload.data?.length || 0;
      })
      .addCase(fetchGlobalCompliances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGlobalCompliance.fulfilled, (state, action) => {
        const index = state.list.findIndex(item => item._id === action.payload.data._id);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
      });
  }
});

export const { clearGlobalCompliances } = globalCompliancesSlice.actions;
export default globalCompliancesSlice.reducer;
