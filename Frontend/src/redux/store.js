import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import customersReducer from './slices/customersSlice';
import invoicesReducer from './slices/invoicesSlice';
import dashboardReducer from './slices/dashboardSlice';
import settingsReducer from './slices/settingsSlice';
import complianceReducer from './slices/complianceSlice';
import usersReducer from './slices/usersSlice';
import servicesReducer from './slices/servicesSlice';

import jobsReducer from './slices/jobsSlice';
import usersReducer from './slices/usersSlice';
import templatesReducer from './slices/templatesSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    leads: leadsReducer,
    customers: customersReducer,
    invoices: invoicesReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    compliance: complianceReducer,
    jobs: jobsReducer,
    users: usersReducer,
    templates: templatesReducer,
    users: usersReducer,
    services: servicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
