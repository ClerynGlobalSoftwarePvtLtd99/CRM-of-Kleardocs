import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addFollowup,
  addInteraction,
  assignLead,
  convertLead,
  getLeadEmails,
  addLeadEmail
} from '../../api/leadsAPI';

const initialState = {
  list: [],
  currentLead: null,
  filters: {},
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAllLeads(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLeadById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead');
    }
  }
);

export const createNewLead = createAsyncThunk(
  'leads/create',
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await createLead(leadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateExistingLead = createAsyncThunk(
  'leads/update',
  async ({ id, leadData }, { rejectWithValue }) => {
    try {
      const response = await updateLead(id, leadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteExistingLead = createAsyncThunk(
  'leads/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteLead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

export const addLeadFollowup = createAsyncThunk(
  'leads/addFollowup',
  async ({ id, followupData }, { rejectWithValue }) => {
    try {
      const response = await addFollowup(id, followupData);
      return { id, followup: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add followup');
    }
  }
);

export const addLeadInteraction = createAsyncThunk(
  'leads/addInteraction',
  async ({ id, interactionData }, { rejectWithValue }) => {
    try {
      const response = await addInteraction(id, interactionData);
      return { id, interaction: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add interaction');
    }
  }
);

export const assignLeadToAgent = createAsyncThunk(
  'leads/assign',
  async ({ id, assignData }, { rejectWithValue }) => {
    try {
      const response = await assignLead(id, assignData);
      return { id, assignment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign lead');
    }
  }
);

export const convertLeadToCustomer = createAsyncThunk(
  'leads/convert',
  async ({ id, convertData }, { rejectWithValue }) => {
    try {
      const response = await convertLead(id, convertData);
      return { id, conversion: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to convert lead');
    }
  }
);

export const fetchLeadEmails = createAsyncThunk(
  'leads/fetchEmails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLeadEmails(id);
      return { id, emails: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead emails');
    }
  }
);

export const addEmailToLead = createAsyncThunk(
  'leads/addEmail',
  async ({ id, emailData }, { rejectWithValue }) => {
    try {
      const response = await addLeadEmail(id, emailData);
      return { id, email: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add email');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.leads || [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create lead
      .addCase(createNewLead.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createNewLead.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update lead
      .addCase(updateExistingLead.fulfilled, (state, action) => {
        const index = state.list.findIndex(lead => lead._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentLead?._id === action.payload._id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(updateExistingLead.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete lead
      .addCase(deleteExistingLead.fulfilled, (state, action) => {
        state.list = state.list.filter(lead => lead._id !== action.payload);
        if (state.currentLead?._id === action.payload) {
          state.currentLead = null;
        }
      })
      .addCase(deleteExistingLead.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add followup
      .addCase(addLeadFollowup.fulfilled, (state, action) => {
        const { id, followup } = action.payload;
        const lead = state.list.find(l => l._id === id);
        if (lead) {
          lead.lastFollowup = followup.createdAt;
          lead.nextFollowup = followup.nextFollowup;
        }
        if (state.currentLead?._id === id) {
          state.currentLead.lastFollowup = followup.createdAt;
          state.currentLead.nextFollowup = followup.nextFollowup;
        }
      })
      .addCase(addLeadFollowup.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add interaction
      .addCase(addLeadInteraction.fulfilled, (state, action) => {
        // Update lead with interaction data if needed
      })
      .addCase(addLeadInteraction.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Assign lead
      .addCase(assignLeadToAgent.fulfilled, (state, action) => {
        const { id, assignment } = action.payload;
        const lead = state.list.find(l => l._id === id);
        if (lead) {
          lead.agent = assignment.agent;
        }
        if (state.currentLead?._id === id) {
          state.currentLead.agent = assignment.agent;
        }
      })
      .addCase(assignLeadToAgent.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Convert lead
      .addCase(convertLeadToCustomer.fulfilled, (state, action) => {
        const { id } = action.payload;
        const lead = state.list.find(l => l._id === id);
        if (lead) {
          lead.isCustomer = true;
          lead.response = 'Converted';
        }
        if (state.currentLead?._id === id) {
          state.currentLead.isCustomer = true;
          state.currentLead.response = 'Converted';
        }
      })
      .addCase(convertLeadToCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch emails
      .addCase(fetchLeadEmails.fulfilled, (state, action) => {
        const { id, emails } = action.payload;
        const lead = state.list.find(l => l._id === id);
        if (lead) {
          lead.emails = emails;
        }
        if (state.currentLead?._id === id) {
          state.currentLead.emails = emails;
        }
      })
      .addCase(fetchLeadEmails.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add email
      .addCase(addEmailToLead.fulfilled, (state, action) => {
        const { id, email } = action.payload;
        const lead = state.list.find(l => l._id === id);
        if (lead) {
          if (!lead.emails) lead.emails = [];
          lead.emails.push(email);
        }
        if (state.currentLead?._id === id) {
          if (!state.currentLead.emails) state.currentLead.emails = [];
          state.currentLead.emails.push(email);
        }
      })
      .addCase(addEmailToLead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer;
