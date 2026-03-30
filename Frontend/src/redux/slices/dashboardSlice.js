import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  kpis: {
    totalLeads: { value: 0, trend: 'up', trendValue: 0 },
    newLeads: { value: 0, trend: 'up', trendValue: 0 },
    interactedLeads: { value: 0, trend: 'up', trendValue: 0 },
    hotLeads: { value: 0, trend: 'up', trendValue: 0 },
    coldLeads: { value: 0, trend: 'up', trendValue: 0 },
  },
  graphs: {
    dailyLeads: [],
    dailyInteractions: [],
    dailySales: [],
    dailySalesCount: [],
  },
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      // Currently just fetching leads summary. 
      // If we need others in the same thunk we can use Promise.all.
      const response = await axiosInstance.get('/dashboard/leads', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = { ...state.kpis, ...action.payload };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
