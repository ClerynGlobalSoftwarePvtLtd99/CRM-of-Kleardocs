# Kleardocs CRM — Backend API Data Flow Architecture

> **Tech Stack:** Express.js, MySQL, Prisma ORM  
> **Base API URL:** `/api/v1`  
> **Auth:** JWT Bearer token via `Authorization: Bearer <token>` header  
> All protected routes require valid JWT. Invalid/expired token → `401 Unauthorized`.

---

## Table of Contents
1. [Auth](#1-auth)
2. [Dashboard](#2-dashboard)
3. [Leads](#3-leads)
4. [Customers](#4-customers)
5. [Services](#5-services)
6. [Compliances (Global)](#6-compliances-global)
7. [Invoices](#7-invoices)
8. [Recurring Invoices](#8-recurring-invoices)
9. [Payments](#9-payments)
10. [Templates](#10-templates)
11. [Accountant Jobs](#11-accountant-jobs)
12. [Users](#12-users)
13. [Compliance Settings](#13-compliance-settings)
14. [Settings](#14-settings)
15. [PDF Generation APIs](#15-pdf-generation-apis)
16. [WhatsApp & Email Send APIs](#16-whatsapp--email-send-apis)
17. [Error Response Format](#17-error-response-format)

---

## 1. Auth

### POST `/api/v1/auth/login`
**Frontend → Backend:**
```json
{ "phone": "9804492472", "password": "plaintext" }
```
**Backend Logic:**
1. Find user by phone in `users` table.
2. Compare password (bcrypt).
3. Generate JWT (`userId`, `name`, `type`, `role`), expiry 7d.

**Backend → Frontend (200):**
```json
{
  "status": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": { "id": "abc123", "name": "Jagjyot Singh", "type": "Admin", "phone": "9804492472" }
}
```
**Error (401):**
```json
{ "status": false, "message": "Invalid credentials" }
```

---

### POST `/api/v1/auth/logout`
**Frontend → Backend:** `{}` (just JWT header)  
**Backend Logic:** Optionally blacklist token / client just deletes token.  
**Backend → Frontend (200):**
```json
{ "status": true, "message": "Logged out successfully" }
```

---

## 2. Dashboard

All dashboard endpoints accept `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.

### GET `/api/v1/dashboard/leads`
**Backend Logic:** COUNT leads by date range per type.  
**Response (200):**
```json
{
  "status": true,
  "data": {
    "total": 1240,
    "new": 45,
    "interacted": 300,
    "hot": 80,
    "cold": 160
  }
}
```

### GET `/api/v1/dashboard/customers`
```json
{ "status": true, "data": { "total": 540, "withAnnualCompliance": 320 } }
```

### GET `/api/v1/dashboard/sales`
```json
{
  "status": true,
  "data": {
    "totalInvoices": 2295,
    "totalSales": 4580000,
    "totalPayments": 1800,
    "paymentReceived": 3900000,
    "unpaidPartialInvoices": 495,
    "totalDues": 680000
  }
}
```

### GET `/api/v1/dashboard/compliance-jobs`
```json
{
  "status": true,
  "data": {
    "expiredNotDoneCompliances": 142,
    "notDoneCompliances": 380,
    "ongoingCompliances": 55,
    "expiredNotDoneJobs": 12,
    "notDoneJobs": 60,
    "ongoingJobs": 18
  }
}
```

### GET `/api/v1/dashboard/graphs?startDate=&endDate=`
**Backend Logic:** GROUP BY date, count/sum per day.
```json
{
  "status": true,
  "data": {
    "dailyLeads": [{ "date": "2026-03-01", "count": 12 }],
    "dailyInteractions": [{ "date": "2026-03-01", "count": 30 }],
    "dailySales": [{ "date": "2026-03-01", "amount": 45000 }],
    "dailySalesCount": [{ "date": "2026-03-01", "count": 22 }]
  }
}
```

---

## 3. Leads

### GET `/api/v1/leads`
**Query Params:** `search`, `dateType` (created|lastFollowup|nextFollowup), `startDate`, `endDate`, `service`, `agent`, `source`, `type` (hot|cold), `priority`, `response`, `page`, `limit`

**Backend Logic:** Prisma `findMany` with dynamic `where` clause, `orderBy: { createdAt: 'desc' }`.

**Response (200):**
```json
{
  "status": true,
  "count": 1240,
  "data": [
    {
      "id": "678f8daa1b59325fcdf734a4",
      "name": "Test test",
      "phone": "1111111111",
      "companyName": "Test Corp",
      "service": { "id": "...", "name": "Annual Compliance" },
      "source": "Instagram",
      "type": "Hot",
      "priority": "High",
      "response": "Interested",
      "address": "Kolkata",
      "state": "WEST BENGAL",
      "agent": { "id": "...", "name": "Ritu Kaur" },
      "emails": ["test@gmail.com"],
      "nextFollowup": "2026-02-06T00:00:00.000Z",
      "lastFollowup": "2026-02-04T15:01:00.000Z",
      "isCustomer": false,
      "createdAt": "2026-02-02T09:00:00.000Z"
    }
  ]
}
```

---

### POST `/api/v1/leads`
**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9999999999",
  "companyName": "Acme Ltd",
  "serviceId": "676fdde22d4920b03d441720",
  "source": "Facebook",
  "type": "Hot",
  "priority": "High",
  "address": "Mumbai",
  "state": "MAHARASHTRA",
  "agentId": "user_id_here"
}
```
**Backend Logic:** Create record in `leads` table. Log history entry "Lead created".  
**Response (201):**
```json
{ "status": true, "message": "Lead created", "data": { "id": "new_lead_id", ...allFields } }
```

---

### GET `/api/v1/leads/:leadId`
**Response (200):** Full lead object including `emails[]`, `history[]`, `nextFollowup`, `lastFollowup`, `agent`, `service`.

---

### PUT `/api/v1/leads/:leadId`
**Request Body:** Any updatable lead fields.  
**Backend Logic:** `update` in `leads` table. Log history "Lead updated by [user]".  
**Response (200):** `{ "status": true, "message": "Lead updated", "data": {...updated lead} }`

---

### POST `/api/v1/leads/:leadId/convert`
**Request Body:**
```json
{
  "companyName": "Acme Pvt Ltd",
  "address": "Mumbai",
  "state": "MAHARASHTRA",
  "gst": "27AABCU9603R1ZX",
  "type": "Private Limited Company",
  "incorporationDate": "2020-01-01",
  "newlyIncorporated": false,
  "username": "ACME0001"
}
```
**Backend Logic:**
1. Create record in `customers` table linking `leadId`.
2. Mark lead `isCustomer = true`.
3. Auto-generate password (random 8-char).
4. Log history "Converted to Customer".

**Response (200):**
```json
{ "status": true, "message": "Converted to Customer", "data": { "customerId": "698092c965b9911c9c0b0033" } }
```

---

### POST `/api/v1/leads/:leadId/followup`
**Request Body:** `{ "followupDate": "2026-02-06", "phoneCall": true }`  
**Backend Logic:** Update `nextFollowup`, set `lastFollowup = now`. Create `leadHistory` entry.  
**Response (200):** `{ "status": true, "message": "Followup set" }`

---

### PUT `/api/v1/leads/:leadId/emails`
**Request Body:** `{ "emails": ["a@b.com", "c@d.com"] }`  
**Backend Logic:** Replace `emails` array in `leads` table.  
**Response (200):** `{ "status": true, "message": "Emails updated" }`

---

### PUT `/api/v1/leads/:leadId/assign`
**Request Body:** `{ "agentId": "user_id" }`  
**Backend Logic:** Update `agent` field. Create history entry "[CurrentUser] Assigned to [NewAgent]".  
**Response (200):** `{ "status": true, "message": "Agent updated" }`

---

### POST `/api/v1/leads/:leadId/interaction`
**Request Body:** `{ "details": "Customer is very interested", "phoneCalled": true }`  
**Backend Logic:** Insert into `leadHistory` table with `type = "interaction"`.  
**Response (201):** `{ "status": true, "message": "Interaction Added", "data": { "id": "...", "details": "...", "phoneCalled": true, "createdAt": "..." } }`

---

## 4. Customers

### GET `/api/v1/customers`
**Query Params:** `search`, `dateType`, `startDate`, `endDate`, `type`, `service`, `page`, `limit`  
**Response (200):**
```json
{
  "status": true,
  "count": 540,
  "data": [
    {
      "id": "698d975d7ee9313f5f04421a",
      "name": "ARAJ MEDIA PRIVATE LIMITED",
      "phone": "8668844789",
      "companyName": "ARAJ MEDIA PRIVATE LIMITED",
      "type": "Private Limited Company",
      "incorporationDate": "2026-01-20",
      "onboardingDate": "2026-02-12",
      "salesPerson": "Ritu Kaur",
      "newlyIncorporated": true,
      "services": [{ "name": "Startup India Registration" }, { "name": "Annual Compliance" }]
    }
  ]
}
```

### POST `/api/v1/customers`
**Request Body:** All customer fields (name, phone, companyName, address, state, gst, type, incorporationDate, newlyIncorporated, onboardingDate, saleBy, username).  
**Backend Logic:** Create in `customers` table, auto-generate password.  
**Response (201):** `{ "status": true, "data": { "id": "...", ...customer } }`

### GET `/api/v1/customers/export`
**Backend Logic:** Query all customers, build Excel (xlsx) using a library.  
**Response:** `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, file download.

### GET `/api/v1/customers/list`
Lightweight list for dropdowns.
```json
{ "status": true, "data": [{ "id": "...", "name": "...", "companyName": "..." }] }
```

### GET `/api/v1/customers/:customerId`
**Response (200):** Full customer object with all nested data:
```json
{
  "status": true,
  "data": {
    "id": "698d975d7ee9313f5f04421a",
    "name": "ARAJ MEDIA PRIVATE LIMITED",
    "phone": "8668844789",
    "companyName": "ARAJ MEDIA PRIVATE LIMITED",
    "type": "Private Limited Company",
    "address": "Mumbai",
    "state": "MAHARASHTRA",
    "gst": "27AABCU9603R1ZX",
    "incorporationDate": "2026-01-20",
    "onboardingDate": "2026-02-12",
    "newlyIncorporated": true,
    "salesPerson": "Ritu Kaur",
    "username": "ARAJ0555",
    "password": "ey53l5od",
    "emails": ["vishalbhoyar51@gmail.com"],
    "directors": [{ "id": "...", "name": "...", "phone": "..." }],
    "services": [{ "id": "...", "name": "Annual Compliance", "startDate": "...", "endDate": null, "status": "Active" }],
    "invoices": [{ "id": "...", "invoiceNo": "INV-24-2510624", "invoiceDate": "...", "total": 3000, "due": 1500 }],
    "recurringInvoices": [{ "id": "...", "status": "Active", "interval": 3, "intervalType": "Month" }],
    "emailHistory": [{ "date": "...", "templateName": "Startup India Registration" }]
  }
}
```

### PUT `/api/v1/customers/:customerId`
**Request Body:** Updatable customer fields.  
**Response (200):** `{ "status": true, "message": "Customer updated" }`

### PUT `/api/v1/customers/:customerId/emails`
**Request Body:** `{ "emails": ["..."] }`  
**Response (200):** `{ "status": true, "message": "Emails updated" }`

### POST `/api/v1/customers/:customerId/directors`
**Request Body:** `{ "name": "RAJ MISHRA", "phone": "7891858821" }`  
**Response (201):** `{ "status": true, "data": { "id": "...", "name": "RAJ MISHRA", "phone": "..." } }`

### DELETE `/api/v1/customers/:customerId/directors/:directorId`
**Response (200):** `{ "status": true, "message": "Director removed" }`

### POST `/api/v1/customers/:customerId/services`
**Request Body:**
```json
{
  "serviceId": "676fb41f6591cff83b2efdb6",
  "startDate": "2026-02-12",
  "professionalFees": 2000,
  "govtFees": 0,
  "gst": 18,
  "recurring": true,
  "interval": 3,
  "intervalType": "Month",
  "endDate": "2027-02-12"
}
```
**Backend Logic:** Create `customerService` entry. If `recurring = true`, also create `recurringInvoice` entry.  
**Response (201):** `{ "status": true, "message": "Service added" }`

### PUT `/api/v1/customers/:customerId/services/:serviceId/end`
**Backend Logic:** Set `endDate = today`, `status = "Inactive"` in `customerService`. Disable linked recurring invoice.  
**Response (200):** `{ "status": true, "message": "Service ended", "endDate": "2026-03-17" }`

### GET `/api/v1/customers/:customerId/compliances?year=2025-2026`
**Backend Logic:** Fetch compliance entries for customer filtered by financial year.  
**Response (200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "comp_id_1",
      "name": "Preparation & Filing of Form ADT-01",
      "expiryDate": "2023-03-09",
      "status": "To Be Done",
      "completedOn": null,
      "accountant": null
    }
  ]
}
```

### POST `/api/v1/customers/:customerId/financial-year`
**Request Body:** `{ "financialYear": "2025-2026" }`  
**Backend Logic:** Clone compliance template for that year into `customerCompliances` table.  
**Response (201):** `{ "status": true, "message": "Financial year added" }`

### PUT `/api/v1/customers/:customerId/compliances/:complianceId`
**Request Body:** `{ "status": "Done", "accountant": "Samrat", "completedOn": "2026-03-17" }`  
**Response (200):** `{ "status": true, "message": "Compliance updated" }`

---

## 5. Services

### GET `/api/v1/services`
**Response (200):**
```json
{
  "status": true,
  "count": 18,
  "data": [
    {
      "id": "676fb41f6591cff83b2efdb6",
      "name": "Annual Compliance",
      "status": true,
      "template": { "id": "...", "name": "Annual Compliance - Onboarding" },
      "professionalFees": 2000,
      "govtFees": 0,
      "hsn": "998399",
      "createdAt": 1735373855633
    }
  ]
}
```

### POST `/api/v1/services`
**Request Body:** `{ "name": "New Service", "status": true, "templateId": "...", "professionalFees": 1500, "govtFees": 0, "hsn": "998399" }`  
**Response (201):** `{ "status": true, "data": { "id": "...", ...service } }`

### PUT `/api/v1/services/:serviceId`
**Request Body:** Same fields as POST.  
**Response (200):** `{ "status": true, "message": "Service updated" }`

---

## 6. Compliances (Global)

### GET `/api/v1/compliances`
**Query Params:** `year`, `search`, `startDate`, `endDate`, `company`, `status`, `accountant`, `page`, `limit`  
**Backend Logic:** Join `customerCompliances` + `customers` + `complianceSettings` filtered by year.  
**Response (200):**
```json
{
  "status": true,
  "count": 3420,
  "data": [
    {
      "customerId": "6984429865b9911c9c0b14e6",
      "customerName": "NBCA SKILL (OPC) PRIVATE LIMITED",
      "customerPhone": "9863861745",
      "companyName": "NBCA SKILL (OPC) PRIVATE LIMITED",
      "complianceName": "Filing of Income Tax Returns",
      "expiryDate": "2024-10-30",
      "status": "To Be Done",
      "completedOn": null,
      "accountant": null
    }
  ]
}
```

---

## 7. Invoices

### GET `/api/v1/invoices`
**Query Params:** `search`, `startDate`, `endDate`, `filterType` (price|gst|total|due), `filterFn` (gte|eq|lte), `filterValue`, `page`, `limit`  
**Response (200):**
```json
{
  "status": true,
  "count": 2295,
  "data": [
    {
      "id": "69b3b47e7ee9313f5f049dd3",
      "invoiceNo": "INV-24-2510904",
      "invoiceDate": "2026-03-13",
      "customer": { "id": "...", "name": "RECEPTA HEALTHCARE PRIVATE LIMITED", "phone": "...", "companyName": "..." },
      "linkedService": "Annual Compliance",
      "price": 2000,
      "gst": 0,
      "total": 2000,
      "due": 2000
    }
  ]
}
```

### POST `/api/v1/invoices`
**Request Body:**
```json
{
  "customerId": "698d975d7ee9313f5f04421a",
  "invoiceDate": "2026-03-17",
  "recurring": false,
  "items": [
    { "serviceId": "676fb41f6591cff83b2efdb6", "professionalFees": 2000, "govtFees": 0, "gst": 18 }
  ]
}
```
**Backend Logic:**
1. Auto-generate `invoiceNo` using prefix + incrementing counter from `settings`.
2. Determine `placeOfSupply` from customer state code.
3. Create `invoice` record.
4. Create `invoiceItem` records.
5. If `recurring = true` → also create `recurringInvoice`.
6. Increment `invoiceNumber` in settings.

**Response (201):**
```json
{ "status": true, "message": "Invoice created", "data": { "id": "...", "invoiceNo": "INV-24-2510905" } }
```

### GET `/api/v1/invoices/:invoiceId`
**Response (200):** Full invoice + items + payments + customer + totals.
```json
{
  "status": true,
  "data": {
    "id": "69a543007ee9313f5f047332",
    "invoiceNo": "INV-24-2510796",
    "invoiceDate": "2026-03-02",
    "placeOfSupply": "9 - UTTAR PRADESH",
    "companyName": "Indbuy Global Private Limited",
    "customer": { "id": "...", "name": "Indbuy Global Private Limited", "phone": "9452638347", "emails": ["..."], "address": "..." },
    "items": [{ "no": 1, "hsn": "998399", "product": "Annual Compliance", "price": 3250, "amount": 3250 }],
    "payments": [{ "id": "...", "date": "2026-03-02", "amount": 3250, "type": "UPI", "note": "" }],
    "totals": { "subTotal": 3250, "gst": 0, "total": 3250, "paid": 3250, "due": 0 }
  }
}
```

### DELETE `/api/v1/invoices/:invoiceId`
**Backend Logic:** Cascade delete `invoiceItems` and `invoicePayments`.  
**Response (200):** `{ "status": true, "message": "Invoice deleted" }`

### POST `/api/v1/invoices/:invoiceId/payments`
**Request Body:** `{ "amount": 2000, "note": "quarterly", "mode": "UPI", "paymentDate": "2026-03-17" }`  
**Backend Logic:** Insert into `payments` table. Recalculate `due` on invoice.  
**Response (201):** `{ "status": true, "data": { "id": "...", "amount": 2000, ... } }`

### DELETE `/api/v1/invoices/:invoiceId/payments/:paymentId`
**Backend Logic:** Delete payment, recalculate `due` on invoice.  
**Response (200):** `{ "status": true, "message": "Payment deleted" }`

### GET `/api/v1/invoice/view/:invoiceId`
**Backend Logic:** Generate PDF on server (pdfkit/puppeteer), stream as response.  
**Response:** `Content-Type: application/pdf` (inline display)

### GET `/api/v1/invoice/download/:invoiceId`
**Response:** `Content-Disposition: attachment; filename="INV-24-2510796.pdf"`

### POST `/api/v1/invoices/:invoiceId/send-email`
**Request Body:** `{ "subject": "...", "body": "<html>..." }`  
**Backend Logic:** Read customer emails from invoice. Send via SMTP (nodemailer). Log in `emailHistory`.  
**Response (200):** `{ "status": true, "message": "Invoice email sent" }`

---

## 8. Recurring Invoices

### GET `/api/v1/recurringinvoices`
**Query Params:** `search`, `dateType` (created|start|end|next), `startDate`, `endDate`, `status`, `page`, `limit`  
**Response (200):**
```json
{
  "status": true,
  "count": 120,
  "data": [
    {
      "id": "ri_id_1",
      "createdAt": "2026-03-12T17:19:00.000Z",
      "customer": { "id": "...", "name": "...", "companyName": "..." },
      "linkedService": "Annual Compliance",
      "startDate": "2026-03-12",
      "endDate": "2027-03-12",
      "interval": 3,
      "intervalType": "Month",
      "nextDate": "2026-06-12",
      "status": "Active"
    }
  ]
}
```

### GET `/api/v1/recurringinvoices/:riId`
**Response (200):** Full recurring invoice with items + generated invoices sub-list.

### PUT `/api/v1/recurringinvoices/:riId/disable`
**Backend Logic:** Set `status = "Inactive"`. Stop future invoice generation.  
**Response (200):** `{ "status": true, "message": "Recurring invoice disabled" }`

### GET `/api/v1/recurringinvoices/export`
**Response:** CSV file download of all recurring invoices.

---

## 9. Payments

### GET `/api/v1/payments`
**Query Params:** `search` (name/phone/company/invoiceNo), `startDate`, `endDate`, `type` (cash|card|upi|netBanking), `page`, `limit`  
**Response (200):**
```json
{
  "status": true,
  "count": 1800,
  "data": [
    {
      "id": "pay_id_1",
      "payDate": "2026-03-02T14:30:00.000Z",
      "customer": { "id": "...", "name": "Indbuy Global Private Limited", "companyName": "..." },
      "invoice": { "id": "...", "invoiceNo": "INV-24-2510796" },
      "type": "UPI",
      "amount": 3250
    }
  ]
}
```

---

## 10. Templates

### GET `/api/v1/templates`
**Query Params:** `search` (name/subject)  
**Response (200):**
```json
{
  "status": true,
  "count": 17,
  "data": [
    {
      "id": "67acbbf9e074351df18a8316",
      "name": "Compliance Update",
      "subject": "Compliance Update - {{complianceName}} for {{companyName}}",
      "status": "Active",
      "body": "<html>...</html>",
      "createdAt": "2025-01-21T11:30:00.000Z",
      "attachments": []
    }
  ]
}
```

### POST `/api/v1/templates`
**Request Body:** `{ "name": "New Template", "subject": "...", "status": "Active", "body": "<html>..." }`  
**Response (201):** `{ "status": true, "data": { "id": "...", ...template } }`

### PUT `/api/v1/templates/:templateId`
**Request Body:** Same as POST.  
**Response (200):** `{ "status": true, "message": "Template updated" }`

### POST `/api/v1/templates/:templateId/attachments`
**Request:** `multipart/form-data` with `file` field.  
**Backend Logic:** Save file to storage (local disk or S3), record in `templateAttachments` table.  
**Response (201):** `{ "status": true, "data": { "fileUrl": "...", "fileName": "..." } }`

---

## 11. Accountant Jobs

### GET `/api/v1/jobs`
**Query Params:** `search`, `dateType` (created|expiry|completedOn), `startDate`, `endDate`, `status`, `accountant`, `page`, `limit`  
**Response (200):**
```json
{
  "status": true,
  "count": 240,
  "data": [
    {
      "id": "job_id_1",
      "createdAt": "2026-02-06T11:06:00.000Z",
      "jobTitle": "Preparation & Filing of Form DPT-03",
      "customer": { "id": "...", "name": "Test", "phone": "111", "companyName": "XSZCV" },
      "expiryDate": "1970-01-01",
      "status": "To Be Done",
      "completedOn": null,
      "accountant": "Jagjyot"
    }
  ]
}
```

### POST `/api/v1/jobs`
**Request Body:**
```json
{ "jobTitle": "INC 20A Filing", "customerId": "...", "status": "To Be Done", "accountant": "Samrat", "hasExpiry": true, "expiryDate": "2026-04-01" }
```
**Response (201):** `{ "status": true, "data": { "id": "...", ...job } }`

### PUT `/api/v1/jobs/:jobId`
**Request Body:** Same updatable fields.  
**Backend Logic:** If `status = "Done"`, auto-set `completedOn = now`.  
**Response (200):** `{ "status": true, "message": "Job updated" }`

### DELETE `/api/v1/jobs/:jobId`
**Response (200):** `{ "status": true, "message": "Job deleted" }`

---

## 12. Users

### GET `/api/v1/users`
**Query Params:** `type` (agent|accountant|admin)  
**Response (200):**
```json
{
  "status": true,
  "count": 7,
  "data": [
    { "id": "user_id_1", "name": "Amit Samanta", "phone": "8100521654", "type": "Admin", "status": "Active", "createdAt": "2025-01-05T16:49:00.000Z" }
  ]
}
```

### POST `/api/v1/users`
**Request Body:** `{ "name": "New Agent", "phone": "9000000000", "password": "pass123", "type": "Agent", "status": "Active" }`  
**Backend Logic:** Hash password (bcrypt). Create user.  
**Response (201):** `{ "status": true, "data": { "id": "...", "name": "...", "type": "Agent" } }`

### PUT `/api/v1/users/:userId`
**Request Body:** `{ "name": "...", "phone": "...", "password": "optional", "status": "Active" }`  
**Backend Logic:** If `password` is provided and non-empty, hash and update.  
**Response (200):** `{ "status": true, "message": "User updated" }`

---

## 13. Compliance Settings

### GET `/api/v1/financial-years`
**Response (200):**
```json
{ "status": true, "data": [{ "id": "fy1", "year": "2023-2024" }, { "id": "fy2", "year": "2024-2025" }, { "id": "fy3", "year": "2025-2026" }] }
```

### POST `/api/v1/financial-years`
**Request Body:** `{ "year": "2026-2027" }`  
**Response (201):** `{ "status": true, "data": { "id": "...", "year": "2026-2027" } }`

### PUT `/api/v1/financial-years/:yearId`
**Request Body:** `{ "year": "2025-2026" }`  
**Response (200):** `{ "status": true, "message": "Financial year updated" }`

### GET `/api/v1/compliance-settings?year=2025-2026`
**Response (200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "cs_id_1",
      "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
      "hasExpiry": true,
      "expiryDate": "2024-03-23",
      "isNew": true,
      "daysOfExpiry": 30,
      "expiryTemplate": { "id": "...", "name": "Compliance Update" },
      "completeTemplate": { "id": "...", "name": "Compliance Update" },
      "inc20": false
    }
  ]
}
```

### POST `/api/v1/compliance-settings`
**Request Body:** `{ "name": "New Compliance", "hasExpiry": true, "expiryDate": "2026-03-31", "inc20": false, "daysOfExpiry": 30, "expiryTemplateId": "...", "completeTemplateId": "...", "year": "2025-2026" }`  
**Response (201):** `{ "status": true, "data": { "id": "...", ...compliance } }`

### PUT `/api/v1/compliance-settings/:complianceId`
**Request Body:** Updatable fields.  
**Response (200):** `{ "status": true, "message": "Compliance setting updated" }`

---

## 14. Settings

### GET `/api/v1/settings`
**Response (200):**
```json
{
  "status": true,
  "data": {
    "invoicePrefix": "INV-24-25",
    "invoiceNumber": 10835,
    "emailFromName": "Startup Station",
    "fromEmail": "bizdev@startupstation.in",
    "invoiceTemplateId": "...",
    "recurringInvoiceTemplateId": "...",
    "gstTemplateId": "...",
    "serviceListTemplateId": "...",
    "ptaxTemplateId": "...",
    "websiteTemplateId": "...",
    "startupIndiaTemplateId": "...",
    "isoTemplateId": "...",
    "inc20TemplateId": "..."
  }
}
```

### PUT `/api/v1/settings`
**Request Body:** All settings fields.  
**Response (200):** `{ "status": true, "message": "Settings updated" }`

### GET `/api/v1/settings/email-count?startDate=&endDate=`
**Response (200):**
```json
{ "status": true, "total": 542, "data": [{ "date": "2026-03-01", "count": 12 }] }
```

---

## 15. PDF Generation APIs

### GET `/api/v1/customers/:customerId/director-report`
**Query Params:** `place`, `date`, `cin`, `noOfBoardMeetings`, `agmDate`, `profitTable` (JSON string), `directors` (JSON array), `signingDirectors` (JSON array)  
**Backend Logic:** Puppeteer renders HTML template with data → generates 6-page PDF.  
**Response:** PDF stream (inline).

---

### GET `/api/v1/customers/:customerId/boardresolution`
**Query Params:** `date1` (DD/MM/YYYY), `date2` (e.g., "4th February 2026")  
**Backend Logic:**
1. Fetch customer + directors.
2. If no directors → `{ "status": false, "message": "No Directors added to this customer" }` (400).
3. Render Board Resolution PDF with customer address + director signatures.

**Response:** PDF stream.

---

### GET `/api/v1/customers/:customerId/consent-letter`
**Query Params:** `date` (e.g., "5th February, 2026")  
**Backend Logic:** Render Consent Letter PDF using customer data + auditor details from settings.  
**Response:** PDF stream.

---

### GET `/api/v1/customers/:customerId/auditors-report`
**Query Params:** `cin`, `udin`, `date`  
**Backend Logic:** Render multi-page Auditor's Report PDF.  
**Response:** PDF stream.

---

## 16. WhatsApp & Email Send APIs

### POST `/api/v1/leads/:leadId/send-email`
**Request Body:**
```json
{ "templateId": "67acbbf9e074351df18a8316", "subject": "Annual Compliance Package for {{companyName}}", "body": "<html>...</html>" }
```
**Backend Logic:**
1. Fetch lead emails.
2. Replace template variables (`{{name}}`, `{{companyName}}`, etc.) with lead data.
3. Send via nodemailer SMTP (using `fromEmail` from settings).
4. Insert into `emailHistory` table with `{ leadId, templateId, date }`.
5. Create `leadHistory` entry "Email Template sent – [templateName]".

**Response (200):** `{ "status": true, "message": "Email sent successfully" }`

---

### POST `/api/v1/customers/:customerId/send-email`
Same as above but for customer emails and history.

---

### POST `/api/v1/leads/:leadId/send-whatsapp`
**Request Body:**
```json
{
  "templateName": "retargeting_v4",
  "mediaUrl": "https://example.com/file.pdf",
  "fileName": "compliance.pdf",
  "variables": { "name": "Acme Pvt Ltd" }
}
```
**Backend Logic:**
1. Call WhatsApp Business API (Meta/360dialog) with template + variables.
2. Log in `leadHistory` "Whatsapp Template: retargeting_v4".

**Response (200):** `{ "status": true, "message": "WhatsApp template sent" }`

---

### POST `/api/v1/customers/:customerId/send-whatsapp`
Same pattern for customers.

---

## 17. Error Response Format

All errors follow this structure:

```json
{
  "status": false,
  "message": "Descriptive error message here"
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Bad Request (validation error, missing fields) |
| 401 | Unauthorized (missing/invalid JWT) |
| 403 | Forbidden (user lacks permission) |
| 404 | Resource not found |
| 409 | Conflict (duplicate entry, e.g., phone already exists) |
| 500 | Internal Server Error |

---

## Prisma Database Schema — Key Tables

| Table | Key Fields |
|-------|-----------|
| `users` | id, name, phone, passwordHash, type (admin/agent/accountant), status |
| `leads` | id, name, phone, companyName, serviceId, source, type, priority, response, address, state, agentId, emails (JSON), nextFollowup, lastFollowup, isCustomer |
| `leadHistory` | id, leadId, userId, type, details, phoneCalled, createdAt |
| `customers` | id, leadId (nullable), name, phone, companyName, address, state, gst, type, incorporationDate, newlyIncorporated, onboardingDate, salesPerson, username, password, emails (JSON) |
| `directors` | id, customerId, name, phone |
| `services` | id, name, status, templateId, professionalFees, govtFees, hsn |
| `customerServices` | id, customerId, serviceId, startDate, endDate, status |
| `invoices` | id, customerId, customerServiceId, invoiceNo, invoiceDate, placeOfSupply, subTotal, gst, total, paid, due |
| `invoiceItems` | id, invoiceId, serviceId, hsn, productName, professionalFees, govtFees, gst, amount |
| `payments` | id, invoiceId, customerId, amount, note, mode, paymentDate |
| `recurringInvoices` | id, customerId, customerServiceId, startDate, endDate, interval, intervalType, nextDate, status |
| `templates` | id, name, subject, status, body, createdAt |
| `templateAttachments` | id, templateId, fileUrl, fileName |
| `emailHistory` | id, customerId (nullable), leadId (nullable), templateId, templateName, date |
| `complianceSettings` | id, year, name, hasExpiry, expiryDate, inc20, daysOfExpiry, expiryTemplateId, completeTemplateId |
| `customerCompliances` | id, customerId, complianceSettingId, year, status, completedOn, accountant |
| `jobs` | id, customerId, jobTitle, status, accountant, hasExpiry, expiryDate, completedOn |
| `financialYears` | id, year |
| `settings` | id, invoicePrefix, invoiceNumber, emailFromName, fromEmail, all template IDs |

---

## Cron Jobs / Background Tasks

| Task | Schedule | Logic |
|------|----------|-------|
| Generate Recurring Invoices | Daily (midnight) | Find active recurring invoices where `nextDate = today` → create invoice, update `nextDate += interval` |
| GST Filing Reminder Email | 2nd of every month | Send `gstTemplate` email to all customers with GST Filing service |
| Service List Email | 2 days after service start | Send `serviceListTemplate` |
| PTax Email | 7 days after compliance start | Send `ptaxTemplate` |
| Website Email | 10 days after service start | Send `websiteTemplate` |
| Startup India Email | 15 days after service start | Send `startupIndiaTemplate` |
| ISO Email | 20 days after compliance start | Send `isoTemplate` |
| INC20A Email | 120 and 150 days after incorporation | Send `inc20Template` to newly incorporated companies |

---

*End of Backend API Data Flow Architecture*
