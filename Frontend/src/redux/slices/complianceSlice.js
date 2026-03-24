import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchFinancialYears = createAsyncThunk(
  'compliance/fetchFinancialYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/financial-years');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch financial years');
    }
  }
);

export const addFinancialYear = createAsyncThunk(
  'compliance/addFinancialYear',
  async (year, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/financial-years', { year });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add financial year');
    }
  }
);

export const updateFinancialYear = createAsyncThunk(
  'compliance/updateFinancialYear',
  async ({ yearId, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/financial-years/${yearId}`, { year });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update financial year');
    }
  }
);

export const fetchComplianceSettings = createAsyncThunk(
  'compliance/fetchComplianceSettings',
  async (financialYear, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/compliance-settings', { params: { financialYear } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliance settings');
    }
  }
);

export const addComplianceSetting = createAsyncThunk(
  'compliance/addComplianceSetting',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/compliance-settings', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add compliance setting');
    }
  }
);

export const updateComplianceSetting = createAsyncThunk(
  'compliance/updateComplianceSetting',
  async ({ complianceId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/compliance-settings/${complianceId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update compliance setting');
    }
  }
);

export const deleteComplianceSetting = createAsyncThunk(
  'compliance/deleteComplianceSetting',
  async (complianceId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/compliance-settings/${complianceId}`);
      return complianceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete compliance setting');
    }
  }
);

const complianceSlice = createSlice({
  name: 'compliance',
  initialState: {
    financialYears: [],
    compliances: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Financial Years
      .addCase(fetchFinancialYears.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinancialYears.fulfilled, (state, action) => {
        state.loading = false;
        state.financialYears = action.payload;
      })
      .addCase(fetchFinancialYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFinancialYear.fulfilled, (state, action) => {
        state.financialYears.unshift(action.payload);
      })
      .addCase(updateFinancialYear.fulfilled, (state, action) => {
        const index = state.financialYears.findIndex(fy => fy._id === action.payload._id);
        if (index !== -1) {
          state.financialYears[index] = action.payload;
        }
      })
      
      // Compliance Settings
      .addCase(fetchComplianceSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplianceSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.compliances = action.payload;
      })
      .addCase(fetchComplianceSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComplianceSetting.fulfilled, (state, action) => {
        state.compliances.push(action.payload);
      })
      .addCase(updateComplianceSetting.fulfilled, (state, action) => {
        const index = state.compliances.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.compliances[index] = action.payload;
        }
      })
      .addCase(deleteComplianceSetting.fulfilled, (state, action) => {
        state.compliances = state.compliances.filter(c => c._id !== action.payload);
      });
  },
});

export default complianceSlice.reducer;
