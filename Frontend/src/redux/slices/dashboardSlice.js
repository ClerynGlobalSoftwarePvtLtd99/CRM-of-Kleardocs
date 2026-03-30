import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const now = new Date();
const firstDayObj = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDayObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const firstDay = formatDateLocal(firstDayObj);
const lastDay = formatDateLocal(lastDayObj);

const initialState = {
  dateRange: {
    startDate: firstDay,
    endDate: lastDay,
  },
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
    expiredNotDoneCompliances: { value: 0 },
    notDoneCompliances: { value: 0 },
    ongoingCompliances: { value: 0 },
    expiredNotDoneJobs: { value: 0 },
    notDoneJobs: { value: 0 },
    ongoingJobs: { value: 0 },
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
      const [leadsRes, customersRes, salesRes, complianceRes, graphsRes] = await Promise.all([
        axiosInstance.get('/dashboard/leads', { params }),
        axiosInstance.get('/dashboard/customers', { params }),
        axiosInstance.get('/dashboard/sales', { params }),
        axiosInstance.get('/dashboard/compliance-jobs', { params }),
        axiosInstance.get('/dashboard/graphs', { params })
      ]);
      return {
        kpis: {
          ...leadsRes.data.data,
          ...customersRes.data.data,
          ...salesRes.data.data,
          ...complianceRes.data.data
        },
        graphs: graphsRes.data.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange.startDate = action.payload.startDate;
      state.dateRange.endDate = action.payload.endDate;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = { ...state.kpis, ...action.payload.kpis };
        state.graphs = { ...state.graphs, ...action.payload.graphs };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setDateRange } = dashboardSlice.actions;

export default dashboardSlice.reducer;
