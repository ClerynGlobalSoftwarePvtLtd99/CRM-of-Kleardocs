import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  list: [],
  dropdownList: [],
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

export const fetchCustomerList = createAsyncThunk(
  'customers/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/customers/list');
      // Backend returns { statusCode, data: [customers], message }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer list');
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
  async ({ customerId, year }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`, {
        params: { year }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer details');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customers/${customerId}`, customerData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
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

export const addCustomerFinancialYear = createAsyncThunk(
  'customers/addFinancialYear',
  async ({ customerId, financialYear }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/financial-year`, { financialYear });
      return { customerId, financialYear: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add financial year');
    }
  }
);

export const deleteDirector = createAsyncThunk(
  'customers/deleteDirector',
  async ({ customerId, directorId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/customers/${customerId}/directors/${directorId}`);
      return directorId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete director');
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

export const updateCustomerCompliance = createAsyncThunk(
  'customers/updateCompliance',
  async ({ customerId, complianceId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customers/${customerId}/compliances/${complianceId}`, data);
      return { customerId, compliance: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update compliance');
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

export const downloadCustomerReport = createAsyncThunk(
  'customers/downloadReport',
  async ({ customerId, type, params }, { rejectWithValue }) => {
    try {
      const endpointMap = {
        directorReport: 'director-report',
        boardResolution: 'board-resolution',
        consentLetter: 'consent-letter',
        auditorsReport: 'auditors-report'
      };
      
      const response = await axiosInstance.get(`/customers/${customerId}/${endpointMap[type]}`, {
        params,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${customerId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download report');
    }
  }
);

export const sendCustomerEmail = createAsyncThunk(
  'customers/sendEmail',
  async ({ customerId, templateId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/send-email`, { templateId, ...data });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send email');
    }
  }
);

export const sendCustomerWhatsapp = createAsyncThunk(
  'customers/sendWhatsapp',
  async ({ customerId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customers/${customerId}/send-whatsapp`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send WhatsApp message');
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
      // Fetch Customer List (for dropdowns)
      .addCase(fetchCustomerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerList.fulfilled, (state, action) => {
        state.loading = false;
        state.dropdownList = action.payload || [];
      })
      .addCase(fetchCustomerList.rejected, (state, action) => {
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
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        // Update customer in list if it exists
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
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
      // Delete customer director
      .addCase(deleteDirector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDirector.fulfilled, (state, action) => {
        state.loading = false;
        const directorId = action.payload;
        // Remove director from current customer
        if (state.currentCustomer && state.currentCustomer.directors) {
          state.currentCustomer.directors = state.currentCustomer.directors.filter(d => d._id !== directorId && d.id !== directorId);
        }
      })
      .addCase(deleteDirector.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add customer financial year
      .addCase(addCustomerFinancialYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomerFinancialYear.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, financialYear } = action.payload;
        
        // Update current customer if it matches
        if (state.currentCustomer && state.currentCustomer._id === customerId) {
          if (!state.currentCustomer.financialYears) {
            state.currentCustomer.financialYears = [];
          }
          state.currentCustomer.financialYears.push(financialYear);
        }
        
        // Update customer in list if it matches
        const customerIndex = state.list.findIndex(c => c._id === customerId);
        if (customerIndex !== -1) {
          if (!state.list[customerIndex].financialYears) {
            state.list[customerIndex].financialYears = [];
          }
          state.list[customerIndex].financialYears.push(financialYear);
        }
      })
      .addCase(addCustomerFinancialYear.rejected, (state, action) => {
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
      // Update customer compliance
      .addCase(updateCustomerCompliance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerCompliance.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, compliance } = action.payload;
        
        // Update current customer if it matches
        if (state.currentCustomer && state.currentCustomer._id === customerId) {
          if (state.currentCustomer.compliances) {
            const index = state.currentCustomer.compliances.findIndex(c => c._id === compliance._id);
            if (index !== -1) {
              state.currentCustomer.compliances[index] = compliance;
            }
          }
        }
      })
      .addCase(updateCustomerCompliance.rejected, (state, action) => {
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
