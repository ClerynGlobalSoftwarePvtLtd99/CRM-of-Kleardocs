import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  selectedInvoice: null,
  totalCount: 0,
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/invoices', { params });
      return response.data.data; // backend returns { invoices, count }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/invoices/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice details');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/invoices/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice');
    }
  }
);

export const addPayment = createAsyncThunk(
  'invoices/addPayment',
  async ({ invoiceId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/invoices/${invoiceId}/payments`, paymentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add payment');
    }
  }
);

export const deletePayment = createAsyncThunk(
  'invoices/deletePayment',
  async ({ invoiceId, paymentId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/invoices/${invoiceId}/payments/${paymentId}`);
      return { invoiceId, paymentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.totalCount = action.payload.count || 0;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Payment
      .addCase(addPayment.fulfilled, (state, action) => {
        if (state.selectedInvoice && state.selectedInvoice._id === action.meta.arg.invoiceId) {
          state.selectedInvoice.payments.unshift(action.payload.payment);
          state.selectedInvoice.paid = action.payload.invoiceTotals.paid;
          state.selectedInvoice.due = action.payload.invoiceTotals.due;
        }
      })
      // Delete Invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.list = state.list.filter(inv => inv._id !== action.payload);
      });
  },
});

export const { clearSelectedInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
