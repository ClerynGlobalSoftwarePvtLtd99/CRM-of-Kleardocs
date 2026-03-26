import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  currentCustomer: null,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/customers', { params });
      // Backend returns { count, data: { data: customers } }
      return response.data.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/customers', customerData);
      // Backend returns { statusCode, data: customer }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

export const updateCustomerEmails = createAsyncThunk(
  'customers/updateEmails',
  async ({ customerId, emails }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customers/${customerId}/emails`, { emails });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update emails');
    }
  }
);

export const addCustomerDirector = createAsyncThunk(
  'customers/addDirector',
  async ({ customerId, directorData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/directors`, directorData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add director');
    }
  }
);

export const addServiceToCustomer = createAsyncThunk(
  'customers/addService',
  async ({ customerId, serviceData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/services`, serviceData);
      return { customerId, service: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add service');
    }
  }
);

export const updateCustomerService = createAsyncThunk(
  'customers/updateService',
  async ({ customerId, serviceId, serviceData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customers/${customerId}/services/${serviceId}`, serviceData);
      return { customerId, service: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const endCustomerService = createAsyncThunk(
  'customers/endService',
  async ({ customerId, serviceId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/customers/${customerId}/services/${serviceId}`);
      return { customerId, serviceId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to end service');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        console.log('Redux fetchCustomers fulfilled with payload:', action.payload);
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Add new customer to the list
        state.list.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update customer emails
      .addCase(updateCustomerEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerEmails.fulfilled, (state, action) => {
        state.loading = false;
        console.log('updateCustomerEmails fulfilled, state.currentCustomer:', state.currentCustomer);
        console.log('action.payload:', action.payload);
        
        // Update current customer emails - handle null payload
        if (state.currentCustomer) {
          if (action.payload && action.payload.emails) {
            // Initialize emails if it doesn't exist
            if (!state.currentCustomer.emails) {
              state.currentCustomer.emails = [];
            }
            state.currentCustomer.emails = action.payload.emails;
          } else if (action.payload === null) {
            console.error('API returned null for email update');
            // Don't update emails if API returned null
          } else {
            console.error('Unexpected payload structure:', action.payload);
          }
        } else {
          console.error('state.currentCustomer is null in updateCustomerEmails.fulfilled');
        }
      })
      .addCase(updateCustomerEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add customer director
      .addCase(addCustomerDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomerDirector.fulfilled, (state, action) => {
        state.loading = false;
        // Add director to current customer
        if (state.currentCustomer && state.currentCustomer.directors) {
          state.currentCustomer.directors.push(action.payload);
        }
      })
      .addCase(addCustomerDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add service to customer
      .addCase(addServiceToCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceToCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, service } = action.payload;
        
        // Update current customer if it matches
        if (state.currentCustomer && state.currentCustomer._id === customerId) {
          if (!state.currentCustomer.services) {
            state.currentCustomer.services = [];
          }
          state.currentCustomer.services.push(service);
        }
        
        // Update customer in list if it matches
        const customerIndex = state.list.findIndex(c => c._id === customerId);
        if (customerIndex !== -1) {
          if (!state.list[customerIndex].services) {
            state.list[customerIndex].services = [];
          }
          state.list[customerIndex].services.push(service);
        }
      })
      .addCase(addServiceToCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update customer service
      .addCase(updateCustomerService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerService.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, service } = action.payload;
        
        // Update current customer if it matches
        if (state.currentCustomer && state.currentCustomer._id === customerId) {
          const serviceIndex = state.currentCustomer.services.findIndex(s => s._id === service._id);
          if (serviceIndex !== -1) {
            state.currentCustomer.services[serviceIndex] = service;
          }
        }
        
        // Update customer in list if it matches
        const customerIndex = state.list.findIndex(c => c._id === customerId);
        if (customerIndex !== -1) {
          const serviceIndex = state.list[customerIndex].services.findIndex(s => s._id === service._id);
          if (serviceIndex !== -1) {
            state.list[customerIndex].services[serviceIndex] = service;
          }
        }
      })
      .addCase(updateCustomerService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // End customer service
      .addCase(endCustomerService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endCustomerService.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, serviceId } = action.payload;
        
        // Update current customer if it matches
        if (state.currentCustomer && state.currentCustomer._id === customerId) {
          state.currentCustomer.services = state.currentCustomer.services.filter(s => s._id !== serviceId);
        }
        
        // Update customer in list if it matches
        const customerIndex = state.list.findIndex(c => c._id === customerId);
        if (customerIndex !== -1) {
          state.list[customerIndex].services = state.list[customerIndex].services.filter(s => s._id !== serviceId);
        }
      })
      .addCase(endCustomerService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCustomer } = customersSlice.actions;
export default customersSlice.reducer;
