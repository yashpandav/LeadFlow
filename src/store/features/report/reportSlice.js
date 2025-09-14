import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';

export const getReportData = createAsyncThunk('report/getReportData', async () => {
  const response = await api.get('/reports');
  return response.data.data;
});

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    customers: [],
    leads: [],
    leadsByStatus: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReportData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getReportData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload.customers;
        state.leads = action.payload.leads;
        state.leadsByStatus = action.payload.leadsByStatus;
      })
      .addCase(getReportData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;
