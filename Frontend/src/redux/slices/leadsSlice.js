import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLeadById,
  addFollowup,
  addInteraction,
  assignLead,
  convertLead,
  getLeadEmails,
  updateLeadEmails,
  sendEmailTemplate,
  sendWhatsappTemplate
} from '../../api/leadsAPI';

const initialState = {
  list: [],
  totalCount: 0,       // total count from backend (across all pages)
  currentLead: null,
  emails: [],          // emails state — kept for backward compat; also lives in currentLead.emails
  filters: {},
  loading: false,
  error: null,
};

// ─── FETCH ALL LEADS ──────────────────────────────────────────────────────────
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

// ─── FETCH LEAD BY ID ─────────────────────────────────────────────────────────
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

// ─── CREATE LEAD ──────────────────────────────────────────────────────────────
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

// ─── UPDATE LEAD ──────────────────────────────────────────────────────────────
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

// ─── DELETE LEAD ──────────────────────────────────────────────────────────────
export const deleteExistingLead = createAsyncThunk(
  'leads/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteLeadById(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

// ─── ADD FOLLOWUP ─────────────────────────────────────────────────────────────
export const addLeadFollowup = createAsyncThunk(
  'leads/addFollowup',
  async ({ id, followupData }, { rejectWithValue }) => {
    try {
      const response = await addFollowup(id, followupData);
      // Backend returns: { statusCode, data: <populated lead>, message }
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add followup');
    }
  }
);

// ─── ADD INTERACTION ──────────────────────────────────────────────────────────
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

// ─── ASSIGN LEAD TO AGENT ─────────────────────────────────────────────────────
export const assignLeadToAgent = createAsyncThunk(
  'leads/assign',
  async ({ id, assignData }, { rejectWithValue }) => {
    try {
      const response = await assignLead(id, assignData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign lead');
    }
  }
);

// ─── CONVERT LEAD TO CUSTOMER ─────────────────────────────────────────────────
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

// ─── FETCH LEAD EMAILS ────────────────────────────────────────────────────────
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

// ─── UPDATE LEAD EMAILS ───────────────────────────────────────────────────────
export const updateLeadEmailsThunk = createAsyncThunk(
  'leads/updateEmails',
  async ({ id, emails }, { rejectWithValue }) => {
    try {
      const response = await updateLeadEmails(id, emails);
      return { id, emails: response.data?.emails || emails };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update emails');
    }
  }
);

// ─── SEND EMAIL TEMPLATE ──────────────────────────────────────────────────────
export const sendEmailTemplateToLead = createAsyncThunk(
  'leads/sendEmailTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const response = await sendEmailTemplate(id, templateData);
      return { id, entry: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send email template');
    }
  }
);

// ─── SEND WHATSAPP TEMPLATE ───────────────────────────────────────────────────
export const sendWhatsappTemplateToLead = createAsyncThunk(
  'leads/sendWhatsappTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const response = await sendWhatsappTemplate(id, templateData);
      return { id, entry: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send WhatsApp template');
    }
  }
);

// ─── HELPER: prepend history entry to a lead in state ────────────────────────
const prependHistoryEntry = (lead, entry) => {
  if (!lead) return;
  if (!lead.history) lead.history = [];
  lead.history.unshift(entry);
};

// ─── SLICE ────────────────────────────────────────────────────────────────────
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
      // ── Fetch all leads ──
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload = { count, leads }
        state.list = action.payload?.leads || [];
        state.totalCount = action.payload?.count || 0;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch lead by ID ──
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
        // Sync emails state from lead
        state.emails = action.payload?.emails || [];
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Create lead ──
      .addCase(createNewLead.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createNewLead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Update lead ──
      .addCase(updateExistingLead.fulfilled, (state, action) => {
        const idx = state.list.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.currentLead?._id === action.payload._id) {
          state.currentLead = { ...action.payload, history: state.currentLead.history };
        }
      })
      .addCase(updateExistingLead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Delete lead ──
      .addCase(deleteExistingLead.fulfilled, (state, action) => {
        state.list = state.list.filter(l => l._id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.currentLead?._id === action.payload) state.currentLead = null;
      })
      .addCase(deleteExistingLead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Add followup ──
      // Backend returns the fully populated updated lead document
      .addCase(addLeadFollowup.fulfilled, (state, action) => {
        const updatedLead = action.payload;
        if (!updatedLead || !updatedLead._id) return;

        // Update in list
        const idx = state.list.findIndex(l => l._id === updatedLead._id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], nextFollowup: updatedLead.nextFollowup, lastFollowup: updatedLead.lastFollowup };
        }
        // Update currentLead — preserve existing history, then re-fetch will give fresh history
        if (state.currentLead?._id === updatedLead._id) {
          state.currentLead.nextFollowup = updatedLead.nextFollowup;
          state.currentLead.lastFollowup = updatedLead.lastFollowup;
        }
      })
      .addCase(addLeadFollowup.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Add interaction ──
      .addCase(addLeadInteraction.fulfilled, (state, action) => {
        const { id, interaction } = action.payload;
        const newEntry = {
          _id: interaction._id || Date.now(),
          type: interaction.type || 'interaction',
          details: interaction.details,
          phoneCalled: interaction.phoneCalled || false,
          createdAt: interaction.createdAt || new Date().toISOString(),
          createdBy: interaction.createdBy || null,
        };
        if (state.currentLead?._id === id) {
          prependHistoryEntry(state.currentLead, newEntry);
        }
      })
      .addCase(addLeadInteraction.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Assign lead ──
      // Backend returns the full populated lead document
      .addCase(assignLeadToAgent.fulfilled, (state, action) => {
        const updatedLead = action.payload;
        if (!updatedLead || !updatedLead._id) return;

        const idx = state.list.findIndex(l => l._id === updatedLead._id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], agent: updatedLead.agent };
        }
        if (state.currentLead?._id === updatedLead._id) {
          state.currentLead.agent = updatedLead.agent;
        }
      })
      .addCase(assignLeadToAgent.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Convert lead ──
      .addCase(convertLeadToCustomer.fulfilled, (state, action) => {
        const { id } = action.payload;
        const idx = state.list.findIndex(l => l._id === id);
        if (idx !== -1) {
          state.list[idx].isCustomer = true;
          state.list[idx].response = 'Converted';
        }
        if (state.currentLead?._id === id) {
          state.currentLead.isCustomer = true;
          state.currentLead.response = 'Converted';
        }
      })
      .addCase(convertLeadToCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Fetch emails ──
      .addCase(fetchLeadEmails.fulfilled, (state, action) => {
        const { id, emails } = action.payload;
        state.emails = emails || [];
        if (state.currentLead?._id === id) {
          state.currentLead.emails = emails || [];
        }
        const idx = state.list.findIndex(l => l._id === id);
        if (idx !== -1) state.list[idx].emails = emails || [];
      })
      .addCase(fetchLeadEmails.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Update emails ──
      .addCase(updateLeadEmailsThunk.fulfilled, (state, action) => {
        const { id, emails } = action.payload;
        state.emails = emails || [];
        if (state.currentLead?._id === id) {
          state.currentLead.emails = emails || [];
        }
        const idx = state.list.findIndex(l => l._id === id);
        if (idx !== -1) state.list[idx].emails = emails || [];
      })
      .addCase(updateLeadEmailsThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Send email template ──
      .addCase(sendEmailTemplateToLead.fulfilled, (state, action) => {
        const { id, entry } = action.payload;
        if (state.currentLead?._id === id && entry?._id) {
          prependHistoryEntry(state.currentLead, entry);
        }
      })
      .addCase(sendEmailTemplateToLead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Send WhatsApp template ──
      .addCase(sendWhatsappTemplateToLead.fulfilled, (state, action) => {
        const { id, entry } = action.payload;
        if (state.currentLead?._id === id && entry?._id) {
          prependHistoryEntry(state.currentLead, entry);
        }
      })
      .addCase(sendWhatsappTemplateToLead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer;
