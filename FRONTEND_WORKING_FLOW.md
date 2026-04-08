# Frontend Working Flow

This file explains how frontend works end-to-end for junior developers.

## 1) Frontend Boot Flow

Files:
- `Frontend/src/main.jsx`
- `Frontend/src/App.jsx`

```mermaid
flowchart TD
    A[Browser loads app] --> B[main.jsx mounts React root]
    B --> C[Redux Provider wraps App]
    C --> D[App.jsx checks auth state]
    D --> E{Authenticated?}
    E -- No --> F[Show Login page]
    E -- Yes --> G[Render BrowserRouter + AdminLayout]
    G --> H[Route to selected page]
```

## 2) Routing Flow

Main route file:
- `Frontend/src/App.jsx`

Important routes include:
- `/dashboard`
- `/leads`
- `/customers`
- `/customer/:id`
- `/invoices`
- `/invoice/:id`
- `/compliance-settings`
- `/templates`

```mermaid
flowchart LR
    R[BrowserRouter] --> L[AdminLayout]
    L --> P1[Dashboard]
    L --> P2[Customers]
    L --> P3[CustomerDetails]
    L --> P4[Invoices]
    L --> P5[ComplianceSettings]
    L --> P6[Templates]
```

## 3) Redux + API Data Flow

Pattern used across features:

```mermaid
sequenceDiagram
    participant U as User
    participant C as React Component
    participant S as Redux Slice (Thunk)
    participant A as Axios
    participant B as Backend API

    U->>C: Click action (Load/Add/Update)
    C->>S: dispatch(asyncThunk(payload))
    S->>A: HTTP request
    A->>B: API call
    B-->>A: JSON response
    A-->>S: response.data
    S-->>C: state updated
    C-->>U: UI re-rendered
```

## 4) Example: Customer Details Page Flow

File:
- `Frontend/src/pages/CustomerDetailsPage.jsx`

On load:
1. Reads `customerId` from route params.
2. Dispatches `fetchCustomerById`.
3. Renders sections:
   - Annual Compliance
   - Services
   - Invoices
   - Recurring Invoices
   - Email Template History

On actions:
- Add financial year -> updates customer FY list
- Load year -> fetches compliances for that year
- End service -> confirm modal -> API call -> refresh data
- View email history -> opens email details modal with preview data

## 5) UI Pattern Used in this Project

- Page-level container holds data and handlers
- Reusable components render tables/cards
- Modals handle create/edit/confirm flows
- Toasts (`react-hot-toast`) show success/error feedback
- Loading states shown with `ContentLoader` or `Loader`

## 6) Frontend Debug Checklist

If something does not show on UI:
1. Check Redux state in DevTools.
2. Check Network tab response payload.
3. Verify component receives expected props.
4. Confirm field names match response (`body` vs `content`, etc.).
5. Validate auth token/session (`/auth/me` errors can block fetches).

