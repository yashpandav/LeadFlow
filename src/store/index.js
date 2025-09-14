import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboard/dashboardSlice';
import customerReducer from './features/customer/customerSlice';
import leadReducer from './features/leads/leadSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    customers: customerReducer,
    leads: leadReducer,
  },
});
