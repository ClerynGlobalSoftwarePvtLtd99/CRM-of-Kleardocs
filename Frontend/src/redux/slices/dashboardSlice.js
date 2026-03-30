import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  kpis: {
    totalLeads: { value: 0, trend: 'up', trendValue: 0 },
    newLeads: { value: 0, trend: 'up', trendValue: 0 },
    interactedLeads: { value: 0, trend: 'up', trendValue: 0 },
    hotLeads: { value: 0, trend: 'up', trendValue: 0 },
    coldLeads: { value: 0, trend: 'up', trendValue: 0 },
    totalCustomers: { value: 0, trend: 'up', trendValue: 0 },
    withAnnualCompliance: { value: 0, trend: 'up', trendValue: 0 },
    totalInvoices: { value: 0, trend: 'up', trendValue: null },
    totalSales: { value: 0, trend: 'up', trendValue: 0 },
    totalPayments: { value: 0, trend: 'up', trendValue: null },
    paymentReceived: { value: 0, trend: 'up', trendValue: 0 },
    unpaidPartialInvoices: { value: 0, trend: 'up', trendValue: 0 },
    totalDues: { value: 0, trend: 'up', trendValue: 0 },
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
      const [leadsRes, customersRes, salesRes] = await Promise.all([
        axiosInstance.get('/dashboard/leads', { params }),
        axiosInstance.get('/dashboard/customers', { params }),
        axiosInstance.get('/dashboard/sales', { params })
      ]);
      return {
        ...leadsRes.data.data,
        ...customersRes.data.data,
        ...salesRes.data.data
      };
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
