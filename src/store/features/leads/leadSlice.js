import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';

export const fetchAllLeads = createAsyncThunk(
  'leads/fetchAllLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leads');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/leads/${customerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/addLead',
  async ({ customerId, lead }, { rejectWithValue }) => {
    try {
      const response = await api.post('/leads', { ...lead, customerId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, lead }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/${id}`, lead);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch leads';
      })
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch leads';
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.leads.push(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l._id !== action.payload);
      });
  },
});

export default leadSlice.reducer;
