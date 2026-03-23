import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // For now, mock the login as per previous implementation
      // const response = await axiosInstance.post('/auth/login', credentials);
      // return response.data;
      
      // Simulating successful mock login
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ user: { email: credentials.email, name: 'Admin User' }, token: 'mock-jwt-token' });
        }, 1000);
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      localStorage.setItem('isAuthenticated', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
