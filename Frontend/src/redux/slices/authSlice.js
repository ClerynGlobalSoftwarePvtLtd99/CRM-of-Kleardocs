import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { setInMemoryToken, clearInMemoryToken } from '../../api/axiosInstance';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session invalid');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // The backend returns an ApiResponse object where data is nested
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loginCustomer = createAsyncThunk(
  'auth/customerLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/customer-login', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Customer login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearInMemoryToken();
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
        state.user = action.payload.user || action.payload.customer;
        state.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');

        // Store accessToken in memory only (never in localStorage)
        if (action.payload.accessToken) {
          setInMemoryToken(action.payload.accessToken);
        }
        // refreshToken is an httpOnly cookie — no frontend storage needed
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.customer;
        state.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');

        // Store accessToken in memory only
        if (action.payload.accessToken) setInMemoryToken(action.payload.accessToken);
        // refreshToken is an httpOnly cookie — no frontend storage needed
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        clearInMemoryToken();
        localStorage.removeItem('isAuthenticated');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        clearInMemoryToken();
        localStorage.removeItem('isAuthenticated');
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearInMemoryToken();
        localStorage.removeItem('isAuthenticated');
      });
  },
});

export const { clearAuth, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
