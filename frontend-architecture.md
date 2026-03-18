# 🚀 CRM FRONTEND ARCHITECTURE & COMPLETE MENU FLOW

---

# 📌 Objective

This document defines complete frontend flow, UI behavior, state flow, and interaction system for all CRM modules.

👉 Goal:

- Any developer can build frontend without confusion  
- Every button → defined behavior  
- Every UI → mapped to API  

---

# 🧠 CORE PRINCIPLE

## 1. Unidirectional Data Flow

UI → State → API → Response → UI Update  

✔ Predictable  
✔ Debuggable  
✔ Scalable  

👉 This is standard in modern frontend architecture  

---

# 🏗️ GLOBAL FRONTEND SYSTEM

## 🔹 Global Rules

- Loader on every API call  
- Toast (bottom-right) on:  
  - Create  
  - Update  
  - Delete  
- Modal for all forms  
- Table = reusable component  
- Form = reusable component  

---

## 🔹 Global Flow

User Action  
 → Component  
 → Local State  
 → Global State  
 → API Call  
 → Backend  
 → Response  
 → UI Update  
 → Toast  

---

# 📊 1. DASHBOARD (DEEP FLOW)

## UI Structure

- Header (User + Date Filter)  
- KPI Cards  
- Sales Section  
- Compliance & Jobs Section  
- Graph Section  

---

## 🔁 DATE FILTER FLOW

Click Date Picker  
 → Select Range (2 calendars)  
 → Click OK  
 → API: /dashboard?from&to  
 → Update State  
 → Re-render all widgets  

---

## 🔁 KPI FLOW

Click KPI  
 → Navigate with filter  

Example:  
Total Leads → /leads?filter=all  

---

## 🔁 GRAPH FLOW

Select Range  
 → API call  
 → Map data  
 → Render 4 graphs:  
   - Leads  
   - Interactions  
   - Sales  
   - Sales Count  

---

# 📂 2. LEADS MODULE (CORE SYSTEM)

## UI Sections

- Header + Count  
- Filter Section (2 rows)  
- Table  
- Add Lead Modal  

---

## 🔁 ADD LEAD FLOW

Click Add Lead  
 → Open Modal  
 → Fill Form  
 → Validate  
 → POST /leads  
 → Success Toast  
 → Close Modal  
 → Refetch Table  

---

## 🔁 FILTER FLOW

Update Filters  
 → Build Query Params  
 → API Call  
 → Update Table  

---

## 🔁 TABLE FLOW

Each row:

- Avatar (Name initials)  
- Name + Phone  
- Company + Service  
- Source + Created Date  
- Agent + Response  
- Followups  
- Type + Priority  
- Details Button  

---

## 🔁 DETAILS NAVIGATION

Click Details  
 → Navigate → /lead/:id  

---

# 📄 3. LEAD DETAILS PAGE (MOST IMPORTANT)

## SECTION 1 (HEADER ACTIONS)

Buttons:

- Convert to Customer  
- Next Followup  
- Emails  
- Edit  

---

## 🔁 CONVERT TO CUSTOMER

Click Button  
 → Open Modal  
 → Fill Form  
 → POST /customers/convert  
 → Redirect to Customer Page  

---

## 🔁 NEXT FOLLOWUP

Select Date  
 → Toggle Call  
 → Save  
 → Update Lead  
 → Add to History  

---

## 🔁 EMAIL MANAGEMENT

Add Email  
 → Store in state  
 → Update  
 → Save API  
 → Reflect in UI  

---

## 🔁 EDIT LEAD

Load existing data  
 → Modify  
 → PATCH /lead  
 → Update UI  

---

## 🔁 SECOND SECTION (ACTIONS)

Buttons:

- Change Assign  
- Send Template  
- Send WhatsApp Template  

---

## 🔁 CHANGE ASSIGN

Select Agent  
 → API update  
 → Update UI  
 → Add History  

---

## 🔁 SEND EMAIL TEMPLATE

Select Template  
 → Auto fill subject  
 → Render editor  
 → Send  
 → API call  
 → Log History  

---

## 🔁 SEND WHATSAPP TEMPLATE

Select Template  
 → Fill Variables  
 → Preview  
 → Send API  
 → Store History  

---

## 🔁 THIRD SECTION (HISTORY SYSTEM)

CORE FEATURE:

Every Action → Log Entry  

Examples:

- Assigned  
- Email sent  
- WhatsApp sent  
- Interaction added  

---

## 🔁 ADD INTERACTION

Fill Form  
 → Submit  
 → API  
 → Add History Row  
 → Toast  

---

# 👥 4. CUSTOMERS MODULE

## UI Structure

- Header  
- Filter  
- Table  
- Add Customer Modal  

---

## 🔁 ADD CUSTOMER

Fill Form  
 → POST /customers  
 → Refresh Table  

---

## 🔁 EXPORT

Click Export  
 → Download Excel  

---

## 🔁 DETAILS NAVIGATION

Click Row  
 → /customer/:id  

---

# 📄 5. CUSTOMER DETAILS (SUPER COMPLEX)

## SECTION 1 ACTIONS

- Director Report  
- Board Resolution  
- Emails  
- Add Job  
- Edit  
- Send Template  

---

## 🔁 DIRECTOR REPORT

Fill Financial Data  
 → Add Directors  
 → Generate PDF  
 → Download  

---

## 🔁 BOARD RESOLUTION

Select Date  
 → Generate PDF  

---

## 🔁 ADD DIRECTOR

Add Name + Phone  
 → Update list  

---

## 🔁 ADD SERVICE

Select Service  
 → Add Fees  
 → Toggle Recurring  
 → Save  

---

# 📊 6. SERVICES (INSIDE CUSTOMER)

## FLOW

Add Service  
 → API  
 → Update Table  

---

## 🔁 END SERVICE

Click End  
 → Confirm  
 → Set End Date  

---

## 🔁 ADD INVOICE (FROM SERVICE)

Click Add Invoice  
 → Pre-fill service  
 → Submit  
 → Create Invoice  

---

# 🧾 7. INVOICE MODULE

## TABLE FLOW

Fetch invoices  
 → Render  
 → Actions  

---

## 🔁 VIEW INVOICE

Click View  
 → Open PDF  

---

## 🔁 EMAIL INVOICE

Open Editor  
 → Send Email  

---

## 🔁 DELETE

Confirm  
 → Delete API  
 → Remove row  

---

# 🔁 8. RECURRING INVOICE

## FLOW

Setup during service  
 → Backend handles generation  
 → UI fetch only  

---

# 💳 9. PAYMENTS

## 🔁 ADD PAYMENT

Select Invoice  
 → Add Amount  
 → Save  
 → Update Invoice  

---

## 🔁 PAYMENT TABLE

Filter → API → Render  

---

# 📩 10. TEMPLATE

## 🔁 CREATE TEMPLATE

Editor  
 → Save  

---

## 🔁 USE TEMPLATE

Select → Auto fill → Send  

---

# 📋 11. ACCOUNTANT JOBS

## FLOW

Create Job  
 → Assign  
 → Set Status  

---

# 👤 12. USERS

## FLOW

Create User  
 → Assign Role  
 → Save  

---

# ⚙️ 13. COMPLIANCE SETTINGS

## FLOW

Create Compliance Type  
 → Used in system  

---

# ⚙️ 14. SETTINGS

## FLOW

Update config  
 → Save API  

---

# 🔐 15. LOGOUT

Clear Token  
 → Redirect Login  

---

# 🧠 FINAL SYSTEM FLOW

Leads  
 → Followups  
 → Convert  
 → Customers  
 → Services  
 → Invoice  
 → Payments  
 → Compliance  

---

# 🚀 IMPORTANT FOR DEVELOPERS

✔ Every button = API  
✔ Every action = History  
✔ Every form = Modal  
✔ Every update = Toast  

---

# 🏁 FINAL NOTE

This architecture is:

- Modular  
- Scalable  
- Production-ready  
- Developer-friendly  

👉 A good frontend architecture must be modular, reusable, and well-structured for long-term scalability  