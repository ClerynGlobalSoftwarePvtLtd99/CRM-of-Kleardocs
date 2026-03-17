# Kleardocs CRM — Frontend Data Flow Architecture

> **Tech Stack:** React (Vite), React Router DOM, Axios, Context API / Redux, TinyMCE (rich text editor), Recharts (column charts), date-range-picker library
> **Base URL (Frontend):** `http://localhost:5173` (dev) / Production domain
> **API Base URL:** `/api/v1`

---

## Table of Contents

1. [Global Layout & Auth Guard](#1-global-layout--auth-guard)
2. [Dashboard](#2-dashboard)
3. [Leads](#3-leads)
4. [Lead Detail Page](#4-lead-detail-page)
5. [Customers](#5-customers)
6. [Customer Detail Page](#6-customer-detail-page)
7. [Services](#7-services)
8. [Compliances](#8-compliances)
9. [Add Invoice](#9-add-invoice)
10. [Invoices](#10-invoices)
11. [Invoice Detail Page](#11-invoice-detail-page)
12. [Recurring Invoices](#12-recurring-invoices)
13. [Recurring Invoice Detail Page](#13-recurring-invoice-detail-page)
14. [Payments](#14-payments)
15. [Templates](#15-templates)
16. [Accountant Jobs](#16-accountant-jobs)
17. [Users](#17-users)
18. [Compliance Settings](#18-compliance-settings)
19. [Settings](#19-settings)
20. [Logout](#20-logout)
21. [Global UI Patterns](#21-global-ui-patterns)

---

## 1. Global Layout & Auth Guard

### App Bootstrap (`App.jsx`)
```
App loads
  ↓
Check localStorage/sessionStorage for JWT token
  ↓ token present             ↓ token absent
Render <Layout>           Redirect → /login
  (Left Sidebar + Outlet)
```

### Left Sidebar Menu Items
| # | Menu Label | Route |
|---|-----------|-------|
| 1 | Dashboard | `/` |
| 2 | Leads | `/leads` |
| 3 | Customers | `/customers` |
| 4 | Services | `/services` |
| 5 | Compliances | `/compliances` |
| 6 | Add Invoice | `/addinvoice` |
| 7 | Invoice | `/invoices` |
| 8 | Recurring Invoice | `/recurringinvoices` |
| 9 | Payments | `/payments` |
| 10 | Template | `/templates` |
| 11 | Accountant Jobs | `/accountantjobs` |
| 12 | Users | `/users` |
| 13 | Compliance Settings | `/compliance-settings` |
| 14 | Settings | `/settings` |
| 15 | Logout | (modal trigger) |

### Loader
- A full-screen animated loader is shown while any page-level API call is pending.
- Global spinner state managed via Context (`LoadingContext`).

### Toast Notification
- After any **create / update / delete** action → show toast (bottom-right, green for success, red for error).
- Managed globally (e.g., `react-hot-toast` or `react-toastify`).

---

## 2. Dashboard

**Route:** `/`  
**Component:** `Dashboard.jsx`

### On Page Mount
1. Fetch summary statistics using the selected global date range.
2. Fetch graph data for charts.
3. Show user identity in top-right (avatar initials + "Welcome, Full Name").

### Top Bar — Date Range Picker
- **Component:** `<DateRangePicker />`
- Default range: **Current month** (e.g., Mar 01, 2026 – Mar 31, 2026).
- Shows two calendar months (left = current, right = next).
- Quick presets below calendars: **Today | Yesterday | Last 7 Days**.
- **OK button** (right side) confirms the range.
- On confirm → all dashboard sections re-fetch with `startDate` & `endDate` query params.
- Cross (✕) button resets to default range.

### Section A — Leads Summary Cards
Triggered by: page mount + date range change.
```
Fetch GET /api/v1/dashboard/leads?startDate=&endDate=
  ↓ response
Render 5 stat cards:
  [Total Leads] [New Leads] [Interacted Leads] [Hot Leads] [Cold Leads]
```

### Section B — Customer Summary Cards
```
Fetch GET /api/v1/dashboard/customers?startDate=&endDate=
  ↓ response
Render 2 stat cards:
  [Total Customers] [Customers with Annual Compliance]
```

### Section C — Sales Summary Cards
```
Fetch GET /api/v1/dashboard/sales?startDate=&endDate=
  ↓ response
Render 6 stat cards:
  [Total Invoices] [Total Sales (₹)] [Total Payments (count)]
  [Payment Received (₹)] [Unpaid/Partial Paid Invoices] [Total Dues (₹)]
```

### Section D — Compliances & Jobs Summary Cards
```
Fetch GET /api/v1/dashboard/compliance-jobs?startDate=&endDate=
  ↓ response
Render 6 stat cards:
  [Expired Not Done Compliances] [Not Done Compliances] [Ongoing Compliances]
  [Expired Not Done Jobs] [Not Done Jobs] [Ongoing Jobs]
```

### Section E — Compare Graphs (Column Charts)
- **Library:** Recharts `<BarChart />`
- Own date range picker for graphs (independent of top bar, default = 1 month).
- 4 Column Charts stacked vertically:

| Chart | Data |
|-------|------|
| Daily New Leads | Bar per day — count of new leads |
| Daily Interacted Leads | Bar per day — count of interactions |
| Daily Sales (₹) | Bar per day — revenue |
| Daily Sales Count | Bar per day — invoice count |

```
On graph date range change:
  Fetch GET /api/v1/dashboard/graphs?startDate=&endDate=
  ↓ response: { dailyLeads: [], dailyInteractions: [], dailySales: [], dailySalesCount: [] }
  ↓
  Re-render all 4 charts
```

---

## 3. Leads

**Route:** `/leads`  
**Component:** `Leads.jsx`

### On Page Mount
```
Fetch GET /api/v1/leads   (default: no filter, latest first)
  ↓
Populate leads table
Show header: "Leads (total_count)" on left | "New Lead" button on right
```

### "New Lead" Button
Click → open `<AddLeadModal />` (centered overlay, rest of screen blurred).

#### AddLeadModal — Form Fields
| Field | Type | Notes |
|-------|------|-------|
| Name | text input | required |
| Phone | text input | required |
| Company Name | text input | |
| Service | dropdown | fetched from `/api/v1/services` |
| Source | dropdown | Instagram, Facebook, WhatsApp, Others |
| Type | dropdown | Hot, Cold |
| Priority | dropdown | High, Medium, Low, None |
| Address | textarea | |
| State | dropdown | All 29 states + 8 UTs of India |
| Agent | dropdown | fetched from `/api/v1/users?type=agent` |

**"Add New Lead" Button** inside form:
```
POST /api/v1/leads   { name, phone, companyName, service, source, type, priority, address, state, agent }
  ↓ 201 Created
Close modal
Show success toast "Lead Added"
Prepend new row to leads table (or re-fetch)
```

### Filter Section (Two Rows)
**Row 1:**
| Filter | Type |
|--------|------|
| Name / Phone / Company Name | text search |
| Date Type | dropdown: Created / Last Followup / Next Followup |
| Date Range | DateRangePicker (two-month, same presets) |
| Service | dropdown (all services) |

**Row 2:**
| Filter | Type |
|--------|------|
| Agent | dropdown (all agents) |
| Source | dropdown (Instagram, Facebook, WhatsApp, Others) |
| Type | dropdown (Hot, Cold) |
| Priority | dropdown (High, Medium, Low) |
| Response | dropdown (Interested, Medium, Not Interested) |
| Filter button | triggers fetch |
| Cross (✕) button | clears all filters, re-fetches default |

```
On Filter button click:
  GET /api/v1/leads?search=&dateType=&startDate=&endDate=&service=&agent=&source=&type=&priority=&response=
  ↓ response: { data: [...] }
  ↓
Re-render table
```

### Leads Table — Column Structure
| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 | Col 7 | Col 8 | Col 9 | Col 10 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|--------|
| Avatar (initials) | Name + Mobile | Status badges (CUSTOMER/CALL) | Company + Service | Source + Created datetime | Agent + Response badge | Next Followup date + Last Followup datetime | Type (Hot/Cold) | Priority (High/Medium/Low) | Details button |

**"Details" Button** → navigate to `/lead/:leadId`.

---

## 4. Lead Detail Page

**Route:** `/lead/:leadId`  
**Component:** `LeadDetail.jsx`

### On Page Mount
```
Fetch GET /api/v1/leads/:leadId
  ↓ response: { lead: { name, phone, companyName, service, source, type, priority, response, address, state, agent, emails[], nextFollowup, lastFollowup, history[], ...} }
  ↓
Render all sections
```

### Section 1 — Header Row
**Left:** "Lead Details" title  
**Right buttons:** `Convert to Customer` | `Next Followup` | `Emails` | `Edit`

---

#### Button: "Convert to Customer"
Opens `<ConvertToCustomerModal />`.

**Form Fields:**
| Field | Type | Pre-filled |
|-------|------|-----------|
| Company Name | text | from lead |
| Address | text | from lead |
| State | dropdown | from lead |
| GST | text | |
| Type | dropdown | Private Limited Company, Proprietorship, Partnership, Public Limited Company, Section 8, FPC, LLP, Trust, Others |
| Incorporation Date | date picker | |
| Newly Incorporated? | toggle | |
| Username | text | |

**"Convert to Customer" Button:**
```
POST /api/v1/leads/:leadId/convert
  Body: { companyName, address, state, gst, type, incorporationDate, newlyIncorporated, username }
  ↓ 200 OK → { customerId: "698092c..." }
  ↓
Close modal
Show toast "Lead converted to Customer"
Navigate to /customer/:customerId
```

---

#### Button: "Next Followup"
Opens `<NextFollowupModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Followup Date | date picker (calendar) |
| Also make a phone call? | toggle |

**"Set Next Followup" Button:**
```
POST /api/v1/leads/:leadId/followup
  Body: { followupDate, phoneCall: true/false }
  ↓ 200 OK
Close modal
Show toast "Followup Set"
Update "Next Followup" field in Section 2
Record entry in Lead History section
```

---

#### Button: "Emails"
Opens `<EditEmailsModal />`.

**Current emails** listed with individual **Delete (✕)** buttons.  
**Add Email row:** text input + "Add" button (adds to local list, not yet saved).  
**"Update Emails" Button:**
```
PUT /api/v1/leads/:leadId/emails
  Body: { emails: ["email1@...", "email2@..."] }
  ↓ 200 OK
Close modal
Show toast "Emails Updated"
Refresh email list in Section 2
```

---

#### Button: "Edit" (Lead)
Opens `<EditLeadModal />` pre-filled with existing data.

**Form Fields:** Name, Phone, Company Name, Service (dropdown), Source (dropdown), Type (Hot/Cold), Priority, Response (Interested / Medium / Not Interested / None), Address (textarea), State (dropdown).

**"Update Lead" Button:**
```
PUT /api/v1/leads/:leadId
  Body: { name, phone, companyName, service, source, type, priority, response, address, state }
  ↓ 200 OK
Close modal
Show toast "Lead Updated"
Refresh Section 1 & Section 2
```

---

### Section 2 — Lead Info Row
**Left side** status badges: `CUSTOMER` | `CALL` | `HOT` | `HIGH` | `Interested`  
**Agent:** agent name display  
**Right side buttons:** `Change Assign` | `Send Template` | `Send WhatsApp Template`

---

#### Button: "Change Assign"
Opens `<ChangeAssignModal />`.

Form: dropdown of all agents (`GET /api/v1/users?type=agent`).  
**"Update Agent" Button:**
```
PUT /api/v1/leads/:leadId/assign
  Body: { agentId: "..." }
  ↓ 200 OK
Close modal
Show toast "Agent Updated"
Update agent display in Section 2
Record in Lead History
```

---

#### Button: "Send Template" (Email)
Opens `<SendEmailTemplateModal />`.

**Form Fields:**

1. **Select Email Template** (dropdown) — fetched from `/api/v1/templates`
   - 18 templates (Compliance Update, Annual Compliance Service – Jagjyot Singh, etc.)
2. **Subject** — auto-fills based on selected template (mapping stored front-end)
3. **Variable tokens shown:** `{{name}}` `{{companyName}}` `{{address}}`
4. **Rich Text Editor** (TinyMCE) — loads the selected template's HTML body automatically when template changes.
5. Lead's emails (already set) shown beneath editor.

**"Send Email" Button:**
```
POST /api/v1/leads/:leadId/send-email
  Body: { templateId, subject, body (HTML), emails[] }
  ↓ 200 OK
Close modal
Show toast "Email Sent"
Record "Email Template sent - [name]" in Lead History with View button
```

**"View" button in History** (for sent emails):  
Opens preview popup showing: Subject + full HTML rendered email body.

---

#### Button: "Send WhatsApp Template"
Opens `<SendWhatsAppModal />`.

**Step 1 — Select Template:**
- Dropdown with 60+ WhatsApp template names (retargeting_v4, ac2500, durgapuja, etc.)
- Selecting a template → cross button appears beside template selector (clears preview)
- Selecting a template → loads preview on right panel

**Step 2 — Split Panel:**

| LEFT PANEL | RIGHT PANEL |
|------------|-------------|
| "Header Variables (Document)" section | WhatsApp message preview (green bubble UI) |
| - Media URL input | Template message text |
| - File name input | Template CTA buttons |
| "Body Variables" section | |
| - Name input | |
| "Send Template via WhatsApp" button | |

```
On "Send Template via WhatsApp" click:
POST /api/v1/leads/:leadId/send-whatsapp
  Body: { templateName, mediaUrl, fileName, variables: { name } }
  ↓ 200 OK
Close modal
Show toast "WhatsApp Template Sent"
Record in Lead History
```

---

### Section 2 — Customer Details (Info Display)
- Customer Name, Phone, Company Name, Service, Source, Created datetime, Last Followup datetime, Emails list, Address, State.

### Section 3 — Lead History
**Left:** "Lead History" title  
**Right:** "Add Interaction" button

#### "Add Interaction" Button
Opens `<AddInteractionModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Interaction Details | text input (required) |
| Phone call made? | toggle |

**"Add Interaction" Button inside modal:**
```
POST /api/v1/leads/:leadId/interaction
  Body: { details, phoneCalled: true/false }
  ↓ 200 OK
Close modal
Show toast "Interaction Added"
Prepend new entry to Lead History list
```

**Lead History List** (latest first, each entry shows):
- Timestamp (e.g., "2nd February 2026 4:00 pm")
- Agent/user name
- Action text (e.g., "Assigned to Ritu Kaur", "Whatsapp Template: retargeting_v4", "Email Template sent – [name] [View button]", "CALLED" badge + interaction text)

---

## 5. Customers

**Route:** `/customers`  
**Component:** `Customers.jsx`

### On Page Mount
```
Fetch GET /api/v1/customers   (default: latest first)
  ↓
Render header: "Customers (total)" | "New Customer" button | "Export" button
Populate customer list
```

### "New Customer" Button
Opens `<AddCustomerModal />`.

**Form Fields:**
| Field | Type | Notes |
|-------|------|-------|
| Name | text | required |
| Phone | text | required |
| Company Name | text | |
| Address | text | |
| State | dropdown | All states of India |
| GST | text | |
| Type | dropdown | Private Limited Company, Proprietorship, Partnership, Public Limited Company, Section 8, FPC, LLP, Trust, Others |
| Incorporation Date | date picker | |
| Newly Incorporated? | toggle | |
| Onboarding Date | date picker | (default today) |
| Sale By | text/dropdown | |
| Username | text | |

**"Add New Customer" Button:**
```
POST /api/v1/customers
  Body: { name, phone, companyName, address, state, gst, type, incorporationDate, newlyIncorporated, onboardingDate, saleBy, username }
  ↓ 201 Created
Close modal
Show toast "Customer Added"
Prepend to customer list
```

### "Export" Button
```
GET /api/v1/customers/export   (returns CSV/Excel file stream)
  ↓
Browser auto-downloads the Excel file
```

### Filter Section
| Filter | Type |
|--------|------|
| Name / Phone / Company | text search |
| Data Type | dropdown: Onboarding Date / Incorporation Date |
| Date Range | DateRangePicker |
| Types | dropdown (all company types) |
| Service | dropdown (all services) |
| Search icon | triggers fetch |
| Cross icon | clears filters |

```
GET /api/v1/customers?search=&dateType=&startDate=&endDate=&type=&service=
```

### Customer List (Card/Row View)
Each row shows:
- Avatar (initials)
- Name + Phone
- Company Name + Company Type
- Incorporation date + Onboarding date
- Active services tags (e.g., "Annual Compliance", "Startup India Registration")
- **Details** button → `/customer/:customerId`

---

## 6. Customer Detail Page

**Route:** `/customer/:customerId`  
**Component:** `CustomerDetail.jsx`

### On Page Mount
```
Fetch GET /api/v1/customers/:customerId
  ↓ response: { customer: { name, phone, companyName, type, onboardingDate, incorporationDate, salesPerson, emails[], address, state, username, password, directors[], services[], invoices[], recurringInvoices[], annualCompliances[], emailHistory[], ... } }
  ↓
Render all sections
```

### Section 1 — Header Row 1
**Left:** "Customer Details" heading  
**Right buttons (top row):** `Director Report` | `Board Resolution` | `Emails` | `Add Accountant Job` | `Edit` | `Send Template`

### Section 1 — Header Row 2
**Left:** Company Name + "New Incorporation" badge (if newly incorporated)  
**Right buttons (second row):** `Consent Letter` | `Auditor's Report` | `Send WhatsApp Template` | `Add Director` | `Add Services`

---

#### Button: "Director Report"
Opens `<DirectorReportModal />`.

**Form Fields:**
- Profit Table (Particulars with two header columns + 8 financial rows, each with 2 text inputs)
- Directors list: "Add Director" sub-button → adds row with [Name | Designation | Appointment Date | Resignation Date | Delete icon]
- AGM Date (date input)
- CIN (text input)
- No of Board Meetings (number input)
- Report Place (text input)
- Report Date (date input)
- Signing Directors: "Add Signing Director" sub-button → adds row with [Name | DIN | Delete icon]

**"Generate PDF" Button:**
```
GET /api/v1/customers/:customerId/director-report?place=&date=&cin=&noOfBoardMeetings=&agmDate=&profitTable={...}&directors=[...]&signingDirectors=[...]
  ↓ PDF stream
Open PDF in new browser tab (6-page document)
```

---

#### Button: "Board Resolution"
Opens `<BoardResolutionModal />`.

**Form Fields:**
- Board Resolution Date (date picker, only past dates selectable)

**"Generate PDF" Button:**
```
GET /api/v1/customers/:customerId/boardresolution?date1=DD/MM/YYYY&date2=4th February 2026
  ↓ PDF stream
Open PDF in new tab
(Error if no directors added: show error message from API)
```

---

#### Button: "Emails" (Customer)
Same pattern as Lead Emails:
```
PUT /api/v1/customers/:customerId/emails
  Body: { emails: [...] }
  ↓ 200 OK → refresh email display in Section 2
```

---

#### Button: "Add Accountant Job"
Opens `<AddJobModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Job Title | text |
| Status | dropdown: To Be Done / Ongoing / Done |
| Accountant | dropdown (Samrat / Tapas / Jagjyot) |
| Has Expiry Date? | toggle |
| Expiry Date | date picker (shows only if toggle ON) |

```
POST /api/v1/jobs
  Body: { jobTitle, customerId, status, accountant, hasExpiry, expiryDate }
  ↓ 201 Created
Close modal
Show toast "Job Added"
```

---

#### Button: "Edit" (Customer)
Opens `<EditCustomerModal />` pre-filled.

**Form Fields:** Name, Phone, Company Name, Address, State (dropdown), GST, Type (dropdown), Incorporation Date, Newly Incorporated? (toggle), Onboarding Date, Username.

```
PUT /api/v1/customers/:customerId
  Body: { name, phone, companyName, address, state, gst, type, incorporationDate, newlyIncorporated, onboardingDate, username }
  ↓ 200 OK
Close modal
Show toast "Customer Updated"
Refresh Section 2
```

---

#### Button: "Send Template" (Email — Customer)
Same as Lead's "Send Template" but sends to customer emails.
```
POST /api/v1/customers/:customerId/send-email
  Body: { templateId, subject, body, emails[] }
```

---

#### Button: "Consent Letter"
Opens `<ConsentLetterModal />`.

Form: Date input (calendar).

**"Generate PDF" Button:**
```
GET /api/v1/customers/:customerId/consent-letter?date=5th February, 2026
  ↓ PDF stream → open in new tab
```

---

#### Button: "Auditor's Report"
Opens `<AuditorReportModal />`.

**Form Fields:** CIN (text), UDIN (text), Auditor's Report Date (date picker).

**"Generate PDF" Button:**
```
GET /api/v1/customers/:customerId/auditors-report?cin=&udin=&date=
  ↓ PDF stream → open in new tab
```

---

#### Button: "Send WhatsApp Template" (Customer)
Same modal as Lead's Send WhatsApp Template.
```
POST /api/v1/customers/:customerId/send-whatsapp
```

---

#### Button: "Add Director"
Opens `<AddDirectorModal />`.

**Form Fields:** Name (text), Phone (text).

**"Add Director" Button:**
```
POST /api/v1/customers/:customerId/directors
  Body: { name, phone }
  ↓ 201 Created
Close modal
Show toast "Director Added"
Refresh Directors section in customer detail
```

Directors list shows each director with **Delete icon:**
```
DELETE /api/v1/customers/:customerId/directors/:directorId
  ↓ 200 OK
Remove from directors list, show toast
```

---

#### Button: "Add Services"
Opens `<AddServiceModal />` (on customer).

**Form Fields:**
| Field | Type | Notes |
|-------|------|-------|
| Select Service | dropdown | All active services from `/api/v1/services` |
| Service Start Date | date picker | |
| Professional Fees | number | |
| Government Fees | number | |
| GST (%) | number | |
| Recurring Invoice? | toggle | |
| Interval | number | (shows if toggle ON) |
| Interval Type | dropdown: Day / Month | (shows if toggle ON) |
| Invoice End Date | date picker | (shows if toggle ON) |

```
POST /api/v1/customers/:customerId/services
  Body: { serviceId, startDate, professionalFees, govtFees, gst, recurring, interval, intervalType, endDate }
  ↓ 201 Created
Close modal, toast "Service Added"
Refresh Services section
```

---

### Section 2 — Customer Info Display
Two columns:
- **Left:** Customer Name, Phone, Company Name, Type, Onboarding Date, Incorporation Date, Sales Person
- **Right:** Emails list, Address, State, Username, Password

### Section 3 — Directors
Each director: Name + Phone + Delete icon.

### Section 4 — Annual Compliance
**Left:** "Annual Compliance" title  
**Middle:** Select Financial Year dropdown + **View** button  
**Right:** "Add Financial Year" button

**"Add Financial Year" Button:**
```
POST /api/v1/customers/:customerId/financial-year
  Body: { financialYear: "2025-2026" }
  ↓ 200 OK → refresh year dropdown
```

**"View" Button:**
```
GET /api/v1/customers/:customerId/compliances?year=2025-2026
  ↓ response: { compliances: [{ name, expiryDate, status, completedOn, accountant }] }
  ↓
Render compliance table
```

**Compliance Table Columns:** Compliance Name | Expiry Date | Status | Completed On | Accountant | **Modify** button

**"Modify" Button (per compliance row):**
Opens `<ModifyComplianceModal />` with title = compliance name.

Form Fields: Compliance Status (Done/Ongoing/To Be Done), Assigned Accountant (None/Samrat/Tapas/Jagjyot).

```
PUT /api/v1/customers/:customerId/compliances/:complianceId
  Body: { status, accountant }
  ↓ 200 OK
Close modal, toast "Compliance Updated"
Refresh compliance row
```

### Section 5 — Services Table
Columns: Service Name | Start Date | End Date | Status | **Add Invoice** | **End Service**

**"Add Invoice" Button (per service):**
Opens `<AddInvoiceModal />`.

Form Fields: Invoice Date (date picker, default today), Professional Fees, Government Fees, GST (%), Recurring Invoice? (toggle + Interval, Interval Type, Invoice End Date if ON).

```
POST /api/v1/invoices
  Body: { customerId, serviceId, invoiceDate, professionalFees, govtFees, gst, recurring, interval, intervalType, endDate }
  ↓ 201 Created
Close modal, toast "Invoice Created"
Refresh Invoices section
```

**"End Service" Button (per service row):**
Opens confirmation popup: "End Service? Service: [name] | Cancel | Confirm"

```
PUT /api/v1/customers/:customerId/services/:serviceId/end
  ↓ 200 OK
Close modal, toast "Service Ended"
Fill "End Date" column for that service row
Set Status = "Inactive"
```

### Section 6 — Invoices Table
Columns: Invoice Date | Invoice No | Linked Service | Price (₹) | GST (₹) | Total (₹) | Due (₹) | **View** button

**"View" Button:** → navigate to `/invoice/:invoiceId`

### Section 7 — Recurring Invoices Table
Columns: Start Date | End Date | Linked Service | Interval | Next Date | Status | **View** button

**"View" Button:** → navigate to `/recurringinvoice/:riId` (or scroll to Recurring Invoice Details within customer page).

**"Disable Recurring Invoice" Button (inside Recurring Invoice Detail):**
```
PUT /api/v1/recurringinvoices/:riId/disable
  ↓ 200 OK → Status changes to "Inactive"
```

### Section 8 — Email Template History
Columns: Date | Template Name | **View** button

**"View" Button** → open email preview popup (Subject + HTML body rendered, same as history view in Leads).

---

## 7. Services

**Route:** `/services`  
**Component:** `Services.jsx`

### On Page Mount
```
Fetch GET /api/v1/services
  ↓ response: { count, data: [{ id, name, template, hsn, professionalFees, govtFees, status }] }
  ↓
Header: "Services (count)" | "New Service" button
Render services table
```

### "New Service" Button
Opens `<AddServiceFormModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Name | text |
| Status | dropdown: Active / Inactive |
| Services Start Email Template | dropdown (all templates) |
| Professional Fees | number |
| Government Fees | number |
| HSN Code | text |

```
POST /api/v1/services
  Body: { name, status, templateId, professionalFees, govtFees, hsn }
  ↓ 201 Created
Close modal, toast "Service Added"
Append to table
```

### Services Table
Columns: Name | Email Template | HSN Code | Professional Fees | Govt Fees | Status | **Edit** button

**"Edit" Button:**
Opens `<EditServiceModal />` pre-filled.

```
PUT /api/v1/services/:serviceId
  Body: { name, status, templateId, professionalFees, govtFees, hsn }
  ↓ 200 OK
Close modal, toast "Service Updated"
Refresh table row
```

---

## 8. Compliances

**Route:** `/compliances`  
**Component:** `Compliances.jsx`

### On Page Mount
```
Fetch GET /api/v1/compliances?year=<currentYear>
  ↓ response: { count, data: [...] }
  ↓
Header: "Compliances (count)" | Financial Year dropdown | View button
Render compliance table
```

### Financial Year Dropdown + View Button
- Dropdown: 2023-2024 | 2024-2025 | 2025-2026
- Click **View** → `GET /api/v1/compliances?year=selectedYear` → re-render table

### Filter Section (Row)
| Filter | Type |
|--------|------|
| Name / Phone / Company | text |
| Select Completed Date Range | DateRangePicker |
| Company Name | dropdown (all customers) |
| Status | dropdown: Done / Ongoing / To Be Done |
| Accountant | dropdown: Samrat / Tapas / Jagjyot |
| Filter button | triggers GET with all params |
| Cross button | reset to defaults |

```
GET /api/v1/compliances?year=&search=&startDate=&endDate=&company=&status=&accountant=
```

### Compliance Table
Columns: Customer Name (linked to `/customer/:id`) | Customer Company | Compliance Name | Expiry | Status | Completed On | Accountant

---

## 9. Add Invoice

**Route:** `/addinvoice`  
**Component:** `AddInvoice.jsx`

### On Page Mount
```
Fetch GET /api/v1/customers/list   (for customer dropdown)
Fetch GET /api/v1/services         (for product dropdown)
  ↓
Render invoice creation form
```

### Section 2 — Invoice Details

**Select Customer** (dropdown + search filter)
- Dropdown lists all customers as "CompanyName – CustomerName"
- Searchable/filterable inline

**Invoice Date** (date picker, default today) — shown only when Recurring Invoice toggle is OFF.

**Recurring Invoice? (Toggle)**
- When ON, show:
  - Interval (number input, default 0)
  - Interval Type (dropdown: Day / Month)
  - Invoice End Date (date picker, default today)

---

### Section 3 — Invoice Items Table
**Columns:** No | Name/Product (2 sub-rows: Professional Fees | Govt Fees) | Price | GST (%) | Amount | Delete icon

**Adding a product row:**
- Select Product dropdown (left side) — lists all services as "ServiceName – ₹professionalFees"
- Click **Add Product** button → appends new row with pre-filled fees from service data

**Per Row Logic:**
- Professional Fees (₹) — editable number
- Government Fees (₹) — editable number
- GST % — editable number
- Amount = Professional Fees + Govt Fees + (Professional Fees × GST / 100) — auto-computed
- GST amount = Professional Fees × GST / 100 — auto-computed

**TOTAL Row (bottom):**
- Total Price = sum of all (Prof Fees + Govt Fees)
- Total GST = sum of all (individual GST amounts)
- Total Amount = Total Price + Total GST
- Auto-updates live as any value changes.

**Delete icon:** removes that row, recalculates totals.

---

### Section 4 — CREATE INVOICE Button (full-width)

```
POST /api/v1/invoices
  Body: {
    customerId,
    invoiceDate,
    recurring, interval, intervalType, endDate,  // if recurring
    items: [{ serviceId, professionalFees, govtFees, gst }]
  }
  ↓ 201 Created → { invoiceId, invoiceNo }
Show toast "Invoice Created"
Navigate to /invoice/:invoiceId
```

---

## 10. Invoices

**Route:** `/invoices`  
**Component:** `Invoices.jsx`

### On Page Mount
```
Fetch GET /api/v1/invoices?page=1&limit=20
  ↓ response: { count: 2295, data: [...] }
  ↓
Header: "Invoices (2295)"
Render table
```

### Filter Section
| Filter | Type |
|--------|------|
| Name / Phone / Company | text |
| Invoice Date Range | DateRangePicker |
| Type | dropdown: Price / GST / Total / Due |
| Function | dropdown: ≥ / = / ≤ |
| Value | number input |
| Filter button | triggers fetch |
| Cross button | reset |

```
GET /api/v1/invoices?search=&startDate=&endDate=&filterType=&filterFn=&filterValue=
```

### Invoices Table
Columns: Invoice No | Invoice Date | Customer Name (linked) + Company | Linked Service | Price (₹) | GST (₹) | Total (₹) | Due (₹) | **Details** button | Eye icon (preview PDF) | Download icon

**"Details" Button:**  → `/invoice/:invoiceId`

**Eye icon (View PDF Preview):**
```
GET /api/v1/invoice/view/:invoiceId
  ↓ PDF stream → opens in new tab
```

**Download icon:**
```
GET /api/v1/invoice/download/:invoiceId
  ↓ PDF stream with Content-Disposition: attachment
  → browser auto-downloads as INV-XX-XXXX.pdf
```

---

## 11. Invoice Detail Page

**Route:** `/invoice/:invoiceId`  
**Component:** `InvoiceDetail.jsx`

### On Page Mount
```
Fetch GET /api/v1/invoices/:invoiceId
  ↓ response: { invoice: { invoiceNo, invoiceDate, placeOfSupply, companyName, customer: { name, phone, emails[], address }, items[], payments[], totals: { subTotal, gst, total, paid, due } } }
  ↓
Render all sections
```

### Section 1 — Header  
**Left:** "Invoice Details"  
**Right buttons:** `Email Invoice` (green) | `Add Payment` (orange) | `Delete Invoice` (red) | `View` (green) | `Download` (yellow)

---

#### Button: "Email Invoice"
Opens `<SendInvoiceEmailModal />`.

Pre-filled rich-text editor with invoice email template.  
Variables shown: `{{name}}` `{{companyName}}` `{{address}}` `{{invoiceNo}}` `{{invoiceDate}}` `{{invoiceAmount}}`

```
POST /api/v1/invoices/:invoiceId/send-email
  Body: { subject, body (HTML) }
  ↓ 200 OK → toast "Invoice Email Sent"
```

---

#### Button: "Add Payment"
Opens `<AddPaymentModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Pay Amount | number input (pre-fill = due amount) |
| Note | text input |
| Payment Mode | dropdown: Cash / Card / UPI / Net Banking |
| Payment Date | date picker (default today) |

```
POST /api/v1/invoices/:invoiceId/payments
  Body: { amount, note, mode, paymentDate }
  ↓ 201 Created
Close modal, toast "Payment Added"
Refresh Payments section & Totals section
```

---

#### Button: "Delete Invoice"
Opens confirmation popup: "Delete this Invoice Permanently? This will also delete all invoice items and invoice payments. This cannot be undone. | Cancel | Confirm"

```
On Confirm:
DELETE /api/v1/invoices/:invoiceId
  ↓ 200 OK
Navigate back to /invoices
Show toast "Invoice Deleted"
```

---

#### Button: "View" (PDF)
```
GET /api/v1/invoice/view/:invoiceId
  ↓ PDF → new browser tab
```

#### Button: "Download"
```
GET /api/v1/invoice/download/:invoiceId
  ↓ PDF download (filename: INV-XX-XXXX.pdf)
```

---

### Section 2 — Invoice Info
**Left column:** Invoice No | Invoice Date | Place of Supply | Company Name  
**Right column:** Customer Name (hyperlink to `/customer/:id`) | Customer Phone | Emails | Customer Address

### Section 3 — Invoice Items Table
Columns: No | HSN/SAC | Product | Price | Amount  
Footer: **TOTAL** row with summed Price + Amount

### Section 4 — Payments Section
Columns: No | Date | Amount | Type | Note | **Delete** button

**Delete Payment Button:**
```
DELETE /api/v1/invoices/:invoiceId/payments/:paymentId
  ↓ 200 OK
Remove row, refresh Totals
```

### Section 5 — Totals
| Label | Value |
|-------|-------|
| Sub Total | ₹ X |
| GST | ₹ X |
| Total | ₹ X |
| Paid | ₹ X |
| Due | ₹ X |

---

## 12. Recurring Invoices

**Route:** `/recurringinvoices`  
**Component:** `RecurringInvoices.jsx`

### On Page Mount
```
Fetch GET /api/v1/recurringinvoices
  ↓ response: { count, data: [...] }
  ↓
Header: "Recurring Invoices (count)" | "Export" button (right)
Render table
```

### Export Button
```
GET /api/v1/recurringinvoices/export
  ↓ CSV file download
```

### Filter Section
| Filter | Type |
|--------|------|
| Name / Phone / Company | text |
| Data Type | dropdown: Created / Start Date / End Date / Next Date |
| Date Range | DateRangePicker |
| Status | dropdown: Active / Inactive |
| Filter button | triggers fetch |
| Cross button | reset |

```
GET /api/v1/recurringinvoices?search=&dateType=&startDate=&endDate=&status=
```

### Table
Columns: Created datetime | Customer Name + Company (linked) | Linked Service | Invoice Start Date | Invoice End Date | Interval | Next Invoice Date | Status | **Details** button

**"Details" Button:** → navigate to the specific customer's recurring invoice section or `/recurringinvoice/:riId`.

---

## 13. Recurring Invoice Detail Page

**Route:** `/recurringinvoice/:riId` (or accessed from customer page)  
**Component:** `RecurringInvoiceDetail.jsx`

### On Page Mount
```
Fetch GET /api/v1/recurringinvoices/:riId
  ↓
Render detail sections
```

### Header
**Left:** "Recurring Invoice Details"  
**Right:** "Disable Recurring Invoice" button

**"Disable Recurring Invoice" → Confirmation popup:**
```
PUT /api/v1/recurringinvoices/:riId/disable
  ↓ 200 OK
Status → "Inactive", toast
```

### Left Column
Invoice Start Date | Invoice End Date | Next Invoice Date | Interval | Status | Created datetime

### Right Column
Customer Name (linked) | Customer Phone | Company Name | Customer Address | Place of Supply

### Invoice Items Table
Columns: No | HSN/SAC | Product | Price | GST | % | Amount

### Invoices Sub-Table (generated invoices)
Columns: Invoice Date | Invoice No | Price | GST | Total | Due | **View** button

---

## 14. Payments

**Route:** `/payments`  
**Component:** `Payments.jsx`

### On Page Mount
```
Fetch GET /api/v1/payments
  ↓ response: { count, data: [...] }
  ↓
Header: "Payments (count)"
Render table
```

### Filter Section
| Filter | Type |
|--------|------|
| Name / Phone / Company / Invoice No | text |
| Payment Date Range | DateRangePicker |
| Type | dropdown: Cash / Card / UPI / Net Banking |
| Filter button | |
| Cross button | reset |

```
GET /api/v1/payments?search=&startDate=&endDate=&type=
```

### Table
Columns: Pay Date + Time | Customer Name (linked to `/customer/:id`) | Customer Company (linked) | Invoice No (linked to `/invoice/:id`) | Payment Type | Amount (₹)

---

## 15. Templates

**Route:** `/templates`  
**Component:** `Templates.jsx`

### On Page Mount
```
Fetch GET /api/v1/templates
  ↓
Header: "Email Templates (count)" | "NEW EMAIL TEMPLATE" button
Render templates table
```

### "NEW EMAIL TEMPLATE" Button
Opens `<AddTemplateModal />`.

**Form Fields:**
- Name (text)
- Subject (text)
- Status (dropdown: Active / Inactive)
- Variable tokens displayed as reference: `{{name}}`, `{{companyName}}`, `{{address}}`, `{{username}}`, `{{password}}`, `{{invoiceNo}}`, `{{invoiceDate}}`, `{{invoiceAmount}}`, `{{complianceName}}`, `{{complianceDoneDate}}`, `{{complianceExpiryDate}}`
- **Rich Text Editor** (TinyMCE) for email body HTML

**"ADD NEW TEMPLATE" Button:**
```
POST /api/v1/templates
  Body: { name, subject, status, body (HTML) }
  ↓ 201 Created
Close modal, toast "Template Added"
Append to table
```

### Filter Section
- Name / Subject text search field + search icon + cross icon
```
GET /api/v1/templates?search=
```

### Templates Table
Columns: Created datetime | Name | Subject | Status | **Manage** (Attachments) | **Edit**

**"Manage" Button (Attachments):**
Opens `<EmailAttachmentsModal />`.

Shows: "Email Attachments — Template Name: [name]"  
**Add New File** button → opens system file picker → uploads chosen file:
```
POST /api/v1/templates/:templateId/attachments
  Body: FormData { file }
  ↓ 200 OK → file listed in attachments
```

**"Edit" Button:**
Opens `<EditTemplateModal />` pre-filled with current template data.

```
PUT /api/v1/templates/:templateId
  Body: { name, subject, status, body (HTML) }
  ↓ 200 OK
Close modal, toast "Template Updated"
Refresh row
```

---

## 16. Accountant Jobs

**Route:** `/accountantjobs`  
**Component:** `AccountantJobs.jsx`

### On Page Mount
```
Fetch GET /api/v1/jobs
Fetch GET /api/v1/customers/list   (for customer dropdown in form)
  ↓
Header: "Accountant Jobs (count)" | "NEW JOB" button
Render jobs table
```

### "NEW JOB" Button
Opens `<AddJobModal />`.

**Form Fields:**
| Field | Type | Notes |
|-------|------|-------|
| Job Title | text | |
| Select Customer | dropdown (scrollable) | "CompanyName – CompanyName" format, all customers |
| Status | dropdown | To Be Done / Ongoing / Done |
| Accountant | dropdown | Samrat / Tapas / Jagjyot |
| Has Expiry Date? | toggle | |
| Expiry Date | date picker | shows only when toggle ON; default today |

```
POST /api/v1/jobs
  Body: { jobTitle, customerId, status, accountant, hasExpiry, expiryDate }
  ↓ 201 Created
Close modal, toast "Job Added"
Prepend new row to table
```

### Filter Section
| Filter | Type |
|--------|------|
| Name / Phone / Company | text |
| Date Type | dropdown: Created (default) / Expiry Date / Completed On |
| Date Range | DateRangePicker |
| Status | dropdown: Done / Ongoing / To Be Done |
| Accountant | dropdown: Samrat / Tapas / Jagjyot |
| Filter icon | triggers fetch |
| Cross icon | reset |

**Fixed left columns:** Created | Job Name | Customer | Expiry | Status | Completed | Accountant  
**Scrollable right column:** Modify (Edit + Delete icons)

### Jobs Table
Columns: Created datetime | Job Name | Customer (Name + Phone) | Expiry | Status | Completed On | Accountant | **Edit icon** | **Delete icon**

**Edit icon:**
Opens `<EditJobModal />` pre-filled.

```
PUT /api/v1/jobs/:jobId
  Body: { jobTitle, customerId, status, accountant, hasExpiry, expiryDate }
  ↓ 200 OK
Close modal, toast "Job Updated"
Refresh row
```

**Delete icon:**
Opens confirmation: "Delete this Job Permanently? Job: [jobTitle] for [accountant] | Cancel | Confirm"

```
DELETE /api/v1/jobs/:jobId
  ↓ 200 OK
Remove row, toast "Job Deleted"
```

---

## 17. Users

**Route:** `/users`  
**Component:** `Users.jsx`

### On Page Mount
```
Fetch GET /api/v1/users
  ↓
Header: "Users (count)" | "new user" button
Render users table
```

### "new user" Button
Opens `<AddUserModal />`.

**Form Fields:**
| Field | Type | Notes |
|-------|------|-------|
| User Name | text | |
| Phone | number | (without +91 prefix — it's shown separately) |
| Password | text | |
| Type | dropdown | Agent (default) / Accountant / Admin |
| Status | dropdown | Active / Inactive |

```
POST /api/v1/users
  Body: { name, phone, password, type, status }
  ↓ 201 Created
Close modal, toast "User Added"
Append to users table
```

### Users Table
Columns: Created datetime | Name | Phone (+91 prefix) | Type | Status | **Manage** (Sessions) | **Edit** button

**"Manage" Button (Sessions):** Not functional (placeholder).

**"Edit" Button:**
Opens `<EditUserModal />`.

**Form Fields:**
- User Name (text)
- +91 prefix shown, Phone (number)
- Password (text, optional — "Keep blank if not changed")
- Type (Admin: shown but disabled — cannot be changed once set)
- Status (dropdown: Active / Inactive)

```
PUT /api/v1/users/:userId
  Body: { name, phone, password (optional), status }
  ↓ 200 OK
Close modal, toast "User Updated"
Refresh row
```

---

## 18. Compliance Settings

**Route:** `/compliance-settings`  
**Component:** `ComplianceSettings.jsx`

### On Page Mount
```
Fetch GET /api/v1/financial-years
Fetch GET /api/v1/compliance-settings?year=<latestYear>
  ↓
Render Section 1 (Financial Year list) and Section 2 (Compliance table)
```

---

### Sub-Section 1 — Financial Year Settings

**Header:** "Financial Year Settings" (left) | "ADD FINANCIAL YEAR" button (right)

**"ADD FINANCIAL YEAR" Button:**
Opens `<AddFinancialYearModal />`.

Form: Financial Year text input (e.g., "2025-2026").

```
POST /api/v1/financial-years
  Body: { year: "2025-2026" }
  ↓ 201 Created
Close modal, append to Financial Year list
```

**Financial Year List** (each row: Year + **Modify** button):

**"Modify" Button:**
Opens `<EditFinancialYearModal />`.

```
PUT /api/v1/financial-years/:yearId
  Body: { year: "2025-2026" }
  ↓ 200 OK
Close modal, update list row
```

---

### Sub-Section 2 — Annual Compliances Settings

**Header:** "Annual Compliances Settings" (left) | Financial Year dropdown + **Load** button (middle) | **Add Compliance** button (right)

**Load Button:**
```
GET /api/v1/compliance-settings?year=selectedYear
  ↓ response: { compliances: [...] }
Re-render compliance table
```

**"Add Compliance" Button:**
Opens `<AddComplianceModal />`.

**Form Fields:**
| Field | Type |
|-------|------|
| Compliance Name | text |
| Has Expiry? | toggle |
| Expiry Date | date picker (shows if toggle ON) |
| Inc20? | dropdown: Yes / No |
| Days of Expiry after INC Date | number |
| Expiry Template | dropdown (all templates, default "None") |
| Complete Template | dropdown (all templates) |

```
POST /api/v1/compliance-settings
  Body: { name, hasExpiry, expiryDate, inc20, daysOfExpiry, expiryTemplateId, completeTemplateId, year }
  ↓ 201 Created
Close modal, append to table
```

**Compliance Settings Table:**
Columns: Compliance Name | Expiry Date | New (yes/no) | Expiry After (days) | Expiry Template | Complete Template | **Modify** button

**"Modify" Button (per compliance):**
Opens `<EditComplianceModal />` pre-filled.

```
PUT /api/v1/compliance-settings/:complianceId
  Body: { name, hasExpiry, inc20, daysOfExpiry, expiryTemplateId, completeTemplateId }
  ↓ 200 OK
Close modal, refresh table row
```

---

## 19. Settings

**Route:** `/settings`  
**Component:** `Settings.jsx`

### On Page Mount
```
Fetch GET /api/v1/settings
  ↓ response: { invoicePrefix, invoiceNumber, emailFromName, fromEmail, invoiceTemplate, recurringTemplate, gstTemplate, serviceListTemplate, ptaxTemplate, websiteTemplate, startupIndiaTemplate, isoTemplate, inc20Template }
  ↓
Pre-fill all input fields
```

---

### Sub-Section 1 — Settings Form

**Two-column layout (Left | Right):**

| Left Field | Right Field |
|------------|-------------|
| Invoice Prefix | Invoice Number |
| Email From Name | From Email |
| Invoice Template (dropdown) | Recurring Invoice Template (dropdown) |
| GST Template (2nd of every month) | Service List Template (after 2 days) |
| PTax Template (after 7 days) | Website Template (after 10 days) |
| Startup India Template (after 15 days) | ISO Template (after 20 days) |
| INC20 Template (after 120 & 150 days) — full width | |

All template selectors are dropdowns of all email templates.

**"Update Settings" Button (full-width):**
```
PUT /api/v1/settings
  Body: { invoicePrefix, invoiceNumber, emailFromName, fromEmail, invoiceTemplateId, recurringTemplateId, gstTemplateId, serviceListTemplateId, ptaxTemplateId, websiteTemplateId, startupIndiaTemplateId, isoTemplateId, inc20TemplateId }
  ↓ 200 OK
Show toast "Settings Updated" (green, bottom-right)
```

---

### Sub-Section 2 — Email Count

**Header row:** "Email Count" | DateRangePicker | **Go** button | "Total Emails: X"

**Go Button:**
```
GET /api/v1/settings/email-count?startDate=&endDate=
  ↓ response: { total, data: [{ date, count }] }
Render table: Date | Count
```

---

## 20. Logout

**Menu sidebar** "Logout" click → opens confirmation modal:

**"Logout?" modal:** "Are you sure you want to Logout? | Cancel | Confirm"

```
On Confirm:
POST /api/v1/auth/logout   (or just client-side token removal)
  ↓
Clear localStorage/sessionStorage (remove JWT token)
Navigate to /login
```

---

## 21. Global UI Patterns

### Date Range Picker (Reusable Component)
```
<DateRangePicker
  value={{ startDate, endDate }}
  onChange={(range) => setDateRange(range)}
  presets={["Today", "Yesterday", "Last 7 Days"]}
  showOkButton={true}
/>
```
- Left calendar = current month, Right calendar = next month
- Days beyond today are greyed out / unselectable
- Single click = start = end date. Second click = end date (if after start)
- Quick preset buttons auto-set range and apply immediately
- Custom range requires clicking **OK** to apply

### Modals (Overlays)
- Centered on screen
- Background: dark semi-transparent blur (`backdrop-filter: blur(4px)`)
- Close on clicking X button or pressing Escape

### Toast Notifications
- Bottom-right corner
- Green = success, Red = error
- Auto-dismiss after ~3 seconds

### Hyperlinks (Customer/Invoice)
- Customer Name and Company Name throughout the app → `/customer/:customerId`
- Invoice No → `/invoice/:invoiceId`

### Avatar Initials Logic
```js
// For "Ritu Kaur" → "RK"
const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
```

### Pagination
- Table views use pagination or infinite scroll (server-side paging with `?page=&limit=` params).

### API Error Handling
- All Axios calls wrapped in try/catch
- On 401 → clear token, redirect to `/login`
- On other errors → show red toast with `error.response.data.message`

---

*End of Frontend Data Flow Architecture*
