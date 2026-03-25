import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  selectedInvoice: null,
  loading: false,
  error: null,
  count: 0,
};

export const fetchRecurringInvoices = createAsyncThunk(
  'recurringInvoices/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/recurringinvoices', { params });
      return response.data.data; // { count, data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recurring invoices');
    }
  }
);

export const fetchRecurringInvoiceById = createAsyncThunk(
  'recurringInvoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/recurringinvoices/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recurring invoice details');
    }
  }
);

export const disableRecurringInvoice = createAsyncThunk(
  'recurringInvoices/disable',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/recurringinvoices/${id}/disable`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disable recurring invoice');
    }
  }
);

const recurringInvoicesSlice = createSlice({
  name: 'recurringInvoices',
  initialState,
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchRecurringInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecurringInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchRecurringInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchById
      .addCase(fetchRecurringInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecurringInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchRecurringInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // disable
      .addCase(disableRecurringInvoice.fulfilled, (state, action) => {
        if (state.selectedInvoice && state.selectedInvoice._id === action.payload._id) {
          state.selectedInvoice = action.payload;
        }
        const index = state.list.findIndex(inv => inv._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedInvoice } = recurringInvoicesSlice.actions;
export default recurringInvoicesSlice.reducer;
