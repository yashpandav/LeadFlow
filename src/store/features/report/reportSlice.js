import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';

export const getReportData = createAsyncThunk(
  'report/getReportData',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/reports', { params: filters });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    customers: [],
    leads: [],
    leadsByStatus: [],
    leadConversionFunnel: [],
    leadValueByStatus: [],
    customerGrowth: [],
    topCustomersByLeadValue: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReportData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getReportData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload.customers;
        state.leads = action.payload.leads;
        state.leadsByStatus = action.payload.leadsByStatus;
        state.leadConversionFunnel = action.payload.leadConversionFunnel;
        state.leadValueByStatus = action.payload.leadValueByStatus;
        state.customerGrowth = action.payload.customerGrowth;
        state.topCustomersByLeadValue = action.payload.topCustomersByLeadValue;
      })
      .addCase(getReportData.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      });
  },
});

export default reportSlice.reducer;
