import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  'templates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/templates');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/create',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/templates', templateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/templates/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  },
});

export default templatesSlice.reducer;
