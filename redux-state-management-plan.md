# Global State Management Plan: Kleardocs CRM

This document provides a detailed structural plan for implementing global state management using **React Redux (v9.x)**, **Redux Toolkit (v2.x)**, and **Axios**.

---

## 1. Technical Stack & Dependencies

-   **Redux Toolkit (RTK)**: For efficient store setup, slices, and `createAsyncThunk`.
-   **React-Redux**: To bridge Redux with React components.
-   **Axios**: For making HTTP requests to the backend API (`/api/v1`).

### Installation
```bash
npm install @reduxjs/toolkit@latest react-redux@latest axios
```

---

## 2. Directory Structure

The state management logic will reside in `src/redux/` and `src/api/`.

```text
src/
├── api/
│   └── axiosInstance.js      # Centralized Axios config & interceptors
├── redux/
│   ├── store.js              # Global Store configuration
│   ├── hooks.js              # Typed hooks (useAppDispatch, useAppSelector)
│   └── slices/               # Feature-specific state slices
│       ├── authSlice.js      # Authentication, User Profile
│       ├── leadsSlice.js     # Leads CRUD & Interactions
│       ├── customersSlice.js # Customers, Directors & Services
│       ├── invoicesSlice.js  # Invoices & Payments
│       ├── dashboardSlice.js # KPI & Graph Data
│       └── uiSlice.js        # Global Loaders, Modals, & Toasts
```

---

## 3. Axios Configuration (`src/api/axiosInstance.js`)

A single instance to handle authentication headers and global error logic.

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for global errors (e.g. 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 4. Slice Definitions

Each slice follows a standard pattern: `initialState`, `asyncThunks` for CRUD, and `extraReducers` for async lifecycle management.

### A. Auth Slice (`authSlice.js`)
Handles login status and current user details.
-   **State**: `{ user: null, token: null, isAuthenticated: false, loading: false }`
-   **Actions**: `login`, `logout`, `getCurrentUser`.
-   **CRUD**: POST `/auth/login`, GET `/auth/me`.

### B. Leads Slice (`leadsSlice.js`)
Handles all lead-related data and filtering.
-   **State**: `{ list: [], current: null, filters: {}, stats: {}, loading: false }`
-   **Actions**: `fetchLeads`, `fetchLeadById`, `createLead`, `updateLead`, `addInteraction`.
-   **API Endpoints**:
    -   GET `/leads?query...`
    -   POST `/leads`
    -   PUT `/leads/:id`
    -   POST `/leads/:id/interaction`

### C. Customers Slice (`customersSlice.js`)
Handles customer details, services, and compliance tracking.
-   **State**: `{ list: [], current: null, services: [], compliances: [], loading: false }`
-   **Actions**: `fetchCustomers`, `fetchCustomerById`, `addService`, `updateComplianceStatus`.
-   **API Endpoints**:
    -   GET `/customers`
    -   GET `/customers/:id`
    -   POST `/customers/:id/services`
    -   PUT `/customers/:id/compliances/:mid`

### D. Invoices & Payments Slice (`invoicesSlice.js`)
Tracks financial documents and transactions.
-   **State**: `{ list: [], payments: [], loading: false }`
-   **Actions**: `fetchInvoices`, `createInvoice`, `fetchPayments`, `addPayment`.
-   **API Endpoints**:
    -   GET `/invoices`
    -   POST `/invoices`
    -   GET `/payments`
    -   POST `/payments`

### E. Dashboard Slice (`dashboardSlice.js`)
Stores summary data for the main overview.
-   **State**: `{ kpis: {}, graphs: {}, dateRange: {}, loading: false }`
-   **Actions**: `fetchDashboardStats`, `fetchGraphData`.

---

## 5. Global UI Management (`uiSlice.js`)

Centralized control for app-wide UI feedback.
-   **State**: `{ isLoading: false, toast: { message: '', type: null } }`
-   **Reducers**: `setLoadingState`, `showToast`, `clearToast`.
-   **Logic**: Async thunks across other slices can trigger `isLoading = true` during pending states.

---

## 6. Implementation Workflow

1.  **Phase 1**: Install dependencies and setup `axiosInstance`.
2.  **Phase 2**: Configure `store.js` and wrap the App in `<Provider>`.
3.  **Phase 3**: Implement `authSlice` to handle login persistence.
4.  **Phase 4**: Develop module slices (Leads, Customers) incrementally.
5.  **Phase 5**: Integrate Redux state into UI components via `useSelector` and `useDispatch`.

---

## 7. Global Success/Error Handling

To ensure consistent user feedback, a common middleware or `extraReducers` logic will be used:
-   **Successful Mutation**: Automatically trigger a "Success" toast from `uiSlice`.
-   **Failed Request**: Automatically trigger an "Error" toast with the backend message.
