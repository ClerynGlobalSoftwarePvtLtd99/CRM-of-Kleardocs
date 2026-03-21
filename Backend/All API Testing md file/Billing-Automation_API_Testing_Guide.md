# 💰 Billing + Automation — Full Code Reference

> **Day 4 | Kleardocs CRM**
> Tech: Express.js, MongoDB, Mongoose, Zod, node-cron
> Base URLs: `/api/v1/invoices` · `/api/v1/payments` · `/api/v1/recurringinvoices`
> Auth: JWT Bearer (all routes protected)

---

## Table of Contents

1. [File Structure](#1-file-structure)
2. [Models](#2-models)
3. [Validation](#3-validation)
4. [Service Functions](#4-service-functions)
5. [Controllers](#5-controllers)
6. [Routes](#6-routes)
7. [Cron Job](#7-cron-job)
8. [app.js + server.js Registration](#8-appjs--serverjs-registration)
9. [API Reference Table](#9-api-reference-table)
10. [Request & Response Examples](#10-request--response-examples)

---

## 1. File Structure

```
Backend/src/
├── models/
│   ├── Invoice.model.js            ← Invoice + InvoiceItem (sub-schema) + InvoicePayment
│   ├── RecurringInvoice.model.js   ← RecurringInvoice + items sub-schema
│   └── Payment.model.js            ← Re-exports InvoicePayment
├── validations/
│   └── invoice.validation.js       ← createInvoiceSchema + addPaymentSchema
├── services/
│   └── invoice.service.js          ← All 11 service functions
├── controllers/
│   └── invoice.controller.js       ← All invoice/payment/recurring controllers
├── routes/
│   ├── invoice.routes.js           ← /api/v1/invoices (+ nested payments)
│   ├── payment.routes.js           ← /api/v1/payments
│   └── recurringInvoice.routes.js  ← /api/v1/recurringinvoices
└── cron/
    └── automation.cron.js          ← Daily 6AM recurring invoice generator
```

---

## 2. Models

### `Invoice.model.js` — Exports: `Invoice` (default), `InvoicePayment`

```js
import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  no: { type: Number },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  hsn: { type: String, default: "998399" },
  description: { type: String },
  professionalFees: { type: Number, default: 0 },
  govtFees: { type: Number, default: 0 },
  price: { type: Number, default: 0 },      // professionalFees + govtFees
  gstPercent: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },  // calculated
  amount: { type: Number, default: 0 }      // price + gstAmount
});

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true }, // INV-25-260001
  invoiceDate: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  placeOfSupply: { type: String },
  items: [invoiceItemSchema],
  subTotal: { type: Number, default: 0 },
  totalGst: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  due: { type: Number, default: 0 },        // auto-updated on payment add/delete
  isRecurring: { type: Boolean, default: false },
  recurringInvoice: { type: mongoose.Schema.Types.ObjectId, ref: "RecurringInvoice" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ["Cash","UPI","Card","Net Banking","Cheque","Other"], default: "UPI" },
  note: { type: String },
  paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const InvoicePayment = mongoose.model("InvoicePayment", paymentSchema);
export default mongoose.model("Invoice", invoiceSchema);
```

---

### `RecurringInvoice.model.js`

```js
const recurringInvoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [riItemSchema],
  startDate: { type: Date },
  endDate: { type: Date },
  nextDate: { type: Date },          // cron uses this to know when to generate next
  lastGenerated: { type: Date },
  interval: { type: Number, default: 1 },
  intervalType: { type: String, enum: ["Day", "Month"], default: "Month" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
```

---

## 3. Validation

```js
// validations/invoice.validation.js
const invoiceItemSchema = z.object({
  serviceId: mongoId.optional(),
  description: z.string().optional(),
  hsn: z.string().optional(),
  professionalFees: z.number().min(0).default(0),
  govtFees: z.number().min(0).default(0),
  gstPercent: z.number().min(0).max(100).default(0)
});

export const createInvoiceSchema = z.object({
  customerId: mongoId,
  invoiceDate: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
  recurring: z.boolean().optional().default(false),
  interval: z.number().optional(),
  intervalType: z.enum(["Day", "Month"]).optional(),
  endDate: z.string().optional()
});

export const addPaymentSchema = z.object({
  amount: z.number().positive(),
  mode: z.enum(["Cash","UPI","Card","Net Banking","Cheque","Other"]).default("UPI"),
  note: z.string().optional(),
  paymentDate: z.string().optional()
});
```

---

## 4. Service Functions

All in `invoice.service.js`:

| # | Function | Description |
|---|----------|-------------|
| 1 | `getInvoices(query)` | List invoices — filter by date, amount, search |
| 2 | `createInvoice(data, userId)` | Create invoice with auto-calculated totals + auto-number |
| 3 | `getInvoiceById(id)` | Full invoice with items + payments |
| 4 | `deleteInvoice(id)` | Delete invoice + all its payments |
| 5 | `addPayment(invoiceId, data)` | Add payment + auto-recalc `due` |
| 6 | `deletePayment(invoiceId, paymentId)` | Delete payment + auto-recalc `due` |
| 7 | `getAllPayments(query)` | Global payment list with filters |
| 8 | `getRecurringInvoices(query)` | List recurring invoices |
| 9 | `getRecurringInvoiceById(id)` | Full recurring detail + generated invoices |
| 10 | `disableRecurringInvoice(id)` | Set status = Inactive |
| 11 | `generateDueRecurringInvoices()` | Cron function — auto-generate overdue recurring invoices |

### Auto-Calculation Logic

```
Item.price = professionalFees + govtFees
Item.gstAmount = price × (gstPercent / 100)
Item.amount = price + gstAmount

Invoice.subTotal = Σ item.price
Invoice.totalGst = Σ item.gstAmount
Invoice.total = subTotal + totalGst
Invoice.paid = Σ payments (recalculated on add/delete)
Invoice.due = total - paid
```

### Invoice Number Format

```
INV-{shortYear}-{nextShortYear}{5-digit padded count}
Example: INV-25-260001, INV-25-260002 ...
```

---

## 5. Controllers

All handlers in `invoice.controller.js`:

```js
// Invoice
export const getInvoices = async (req, res) => { ... }
export const createInvoice = async (req, res) => { ... }
export const getInvoiceById = async (req, res) => { ... }
export const deleteInvoice = async (req, res) => { ... }

// Payments
export const addPayment = async (req, res) => { ... }
export const deletePayment = async (req, res) => { ... }
export const getAllPayments = async (req, res) => { ... }

// Recurring
export const getRecurringInvoices = async (req, res) => { ... }
export const getRecurringInvoiceById = async (req, res) => { ... }
export const disableRecurringInvoice = async (req, res) => { ... }
```

---

## 6. Routes

### `invoice.routes.js`

```js
router.get("/", getInvoices);
router.post("/", checkRole("admin","agent"), validate(createInvoiceSchema), createInvoice);
router.get("/:invoiceId", getInvoiceById);
router.delete("/:invoiceId", checkRole("admin"), deleteInvoice);
router.post("/:invoiceId/payments", checkRole("admin","agent"), validate(addPaymentSchema), addPayment);
router.delete("/:invoiceId/payments/:paymentId", checkRole("admin"), deletePayment);
```

### `payment.routes.js`

```js
router.get("/", getAllPayments);   // GET /api/v1/payments
```

### `recurringInvoice.routes.js`

```js
router.get("/", getRecurringInvoices);
router.get("/:riId", getRecurringInvoiceById);
router.put("/:riId/disable", checkRole("admin"), disableRecurringInvoice);
```

---

## 7. Cron Job

```js
// src/cron/automation.cron.js
import cron from "node-cron";
import { generateDueRecurringInvoices } from "../services/invoice.service.js";

export const startRecurringInvoiceCron = () => {
  // Runs every day at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    const count = await generateDueRecurringInvoices();
    console.log(`[CRON] ✅ Generated ${count} recurring invoice(s)`);
  });
};
```

**How it works:**
1. Cron fires at 6AM daily
2. Finds all `RecurringInvoice` where `status = Active` AND `nextDate <= now`
3. Generates a full `Invoice` for each (with correct totals)
4. Updates `ri.lastGenerated = now` and sets `ri.nextDate` to next interval
5. Auto-disables recurring invoice if `nextDate > endDate`

---

## 8. `app.js` + `server.js` Registration

```js
// app.js — imports
import "models/Invoice.model.js";
import "models/RecurringInvoice.model.js";
import InvoiceRoutes from "./routes/invoice.routes.js";
import PaymentRoutes from "./routes/payment.routes.js";
import RecurringInvoiceRoutes from "./routes/recurringInvoice.routes.js";

// app.js — route registration
app.use("/api/v1/invoices", InvoiceRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/recurringinvoices", RecurringInvoiceRoutes);

// server.js — cron start
import { startRecurringInvoiceCron } from "./src/cron/automation.cron.js";
await connectDB();
startRecurringInvoiceCron();  // ← after DB connects
```

---

## 9. API Reference Table

| # | Method | Endpoint | Role | Description |
|---|--------|----------|------|-------------|
| 1 | GET | `/api/v1/invoices` | All | List invoices (filter + paginate) |
| 2 | POST | `/api/v1/invoices` | admin/agent | Create invoice |
| 3 | GET | `/api/v1/invoices/:id` | All | Full invoice + payments |
| 4 | DELETE | `/api/v1/invoices/:id` | admin | Delete invoice + payments |
| 5 | POST | `/api/v1/invoices/:id/payments` | admin/agent | Add payment + auto-update due |
| 6 | DELETE | `/api/v1/invoices/:id/payments/:pId` | admin | Delete payment + auto-update due |
| 7 | GET | `/api/v1/payments` | All | Global payments list |
| 8 | GET | `/api/v1/recurringinvoices` | All | List recurring invoices |
| 9 | GET | `/api/v1/recurringinvoices/:id` | All | Full recurring detail |
| 10 | PUT | `/api/v1/recurringinvoices/:id/disable` | admin | Disable recurring invoice |

---

## 10. Request & Response Examples — All 10 Endpoints

---

### 🔵 API 1 — GET `/api/v1/invoices` — List Invoices

```
GET http://localhost:5000/api/v1/invoices
GET http://localhost:5000/api/v1/invoices?search=Raj&page=1&limit=10
GET http://localhost:5000/api/v1/invoices?startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "count": 2,
    "data": [
      {
        "_id": "69bd3ae2bb8f2114a1e7a6ef",
        "invoiceNo": "INV-25-260001",
        "customer": { "name": "Raj Mishra", "companyName": "Raj Innovations Pvt Ltd" },
        "total": 3540, "paid": 2000, "due": 1540
      }
    ]
  }
}
```

---

### 🟢 API 2 — POST `/api/v1/invoices` — Create Invoice

**Request:**
```json
{
  "customerId": "69bcf4fb3b2c2f7ac07dd287",
  "invoiceDate": "2026-03-20",
  "items": [
    {
      "serviceId": "676fb41f6591cff83b2efdb6",
      "description": "Annual Compliance – ROC Filing",
      "hsn": "998399",
      "professionalFees": 5000,
      "govtFees": 2000,
      "gstPercent": 18
    },
    {
      "description": "ITR Filing",
      "professionalFees": 2000,
      "govtFees": 0,
      "gstPercent": 18
    }
  ],
  "recurring": false
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "_id": "65f1b2c3...",
    "invoiceNo": "INV-25-260001",
    "invoiceDate": "2026-03-20",
    "placeOfSupply": "19 - WEST BENGAL",
    "items": [
      {
        "no": 1, "description": "Annual Compliance – ROC Filing",
        "hsn": "998399", "professionalFees": 5000, "govtFees": 2000,
        "price": 7000, "gstPercent": 18, "gstAmount": 1260, "amount": 8260
      },
      {
        "no": 2, "description": "ITR Filing",
        "professionalFees": 2000, "govtFees": 0,
        "price": 2000, "gstPercent": 18, "gstAmount": 360, "amount": 2360
      }
    ],
    "subTotal": 9000, "totalGst": 1620, "total": 10620,
    "paid": 0, "due": 10620
  }
}
```

---

### 🔵 API 3 — GET `/api/v1/invoices/:invoiceId` — Full Invoice + Payments

```
GET http://localhost:5000/api/v1/invoices/69bd3ae2bb8f2114a1e7a6ef
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "69bd3ae2bb8f2114a1e7a6ef",
    "invoiceNo": "INV-25-260001",
    "customer": { "name": "Raj Mishra", "companyName": "Raj Innovations Pvt Ltd", "state": "WEST BENGAL" },
    "subTotal": 9000, "totalGst": 1620, "total": 10620,
    "paid": 2000, "due": 8620,
    "payments": [
      {
        "_id": "69bd3d99bb8f2114a1e7a701",
        "amount": 2000, "mode": "UPI",
        "note": "Partial payment via PhonePe",
        "paymentDate": "2026-03-20T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 🔴 API 4 — DELETE `/api/v1/invoices/:invoiceId` — Delete Invoice

```
DELETE http://localhost:5000/api/v1/invoices/69bd3ae2bb8f2114a1e7a6ef
Authorization: Bearer <token>
```
**Response (200):**
```json
{ "statusCode": 200, "success": true, "message": "Invoice deleted successfully", "data": null }
```
> Deletes the invoice AND all its payments permanently.

---

### 🟢 API 5 — POST `/api/v1/invoices/:invoiceId/payments` — Add Payment

```
POST http://localhost:5000/api/v1/invoices/69bd3ae2bb8f2114a1e7a6ef/payments
Authorization: Bearer <token>
Content-Type: application/json
```
**Request:**
```json
{
  "amount": 2000,
  "mode": "UPI",
  "note": "Partial payment via PhonePe",
  "paymentDate": "2026-03-20"
}
```
**Response (201):**
```json
{
  "statusCode": 201,
  "message": "Payment added successfully",
  "data": {
    "payment": {
      "_id": "69bd3d99bb8f2114a1e7a701",
      "amount": 2000, "mode": "UPI",
      "note": "Partial payment via PhonePe"
    },
    "invoiceTotals": {
      "total": 3540,
      "paid": 2000,
      "due": 1540
    }
  }
}
```
> Payment modes: `Cash` / `UPI` / `Card` / `Net Banking` / `Cheque` / `Other`

---

### 🔴 API 6 — DELETE `/api/v1/invoices/:invoiceId/payments/:paymentId` — Delete Payment

```
DELETE http://localhost:5000/api/v1/invoices/69bd3ae2bb8f2114a1e7a6ef/payments/69bd3d99bb8f2114a1e7a701
Authorization: Bearer <token>
```
**Response (200):**
```json
{ "statusCode": 200, "success": true, "message": "Payment deleted successfully", "data": null }
```
> `Invoice.paid` and `Invoice.due` auto-recalculate after deletion.

---

### 🔵 API 7 — GET `/api/v1/payments` — Global Payments List

```
GET http://localhost:5000/api/v1/payments
GET http://localhost:5000/api/v1/payments?type=UPI
GET http://localhost:5000/api/v1/payments?search=Raj&startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "count": 3,
    "data": [
      {
        "_id": "69bd3d99bb8f2114a1e7a701",
        "amount": 2000, "mode": "UPI",
        "paymentDate": "2026-03-20T00:00:00.000Z",
        "customer": { "name": "Raj Mishra", "phone": "9999988888" },
        "invoice": { "invoiceNo": "INV-25-260001" }
      }
    ]
  }
}
```
**Filters:** `type` (mode) · `search` (name/phone) · `startDate` · `endDate` · `page` · `limit`

---

### 🔵 API 8 — GET `/api/v1/recurringinvoices` — List Recurring Invoices

```
GET http://localhost:5000/api/v1/recurringinvoices
GET http://localhost:5000/api/v1/recurringinvoices?status=Active&page=1
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "count": 1,
    "data": [
      {
        "_id": "69bd4100bb8f2114a1e7a710",
        "customer": { "name": "Raj Mishra", "companyName": "Raj Innovations Pvt Ltd" },
        "interval": 1, "intervalType": "Month",
        "nextDate": "2026-04-20T00:00:00.000Z",
        "status": "Active"
      }
    ]
  }
}
```

---

### 🔵 API 9 — GET `/api/v1/recurringinvoices/:riId` — Full Recurring Detail

```
GET http://localhost:5000/api/v1/recurringinvoices/69bd4100bb8f2114a1e7a710
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "69bd4100bb8f2114a1e7a710",
    "customer": { "name": "Raj Mishra", "emails": ["raj@rajinnov.com"] },
    "items": [{ "description": "Monthly Accounting", "professionalFees": 3000, "gstPercent": 18 }],
    "interval": 1, "intervalType": "Month",
    "startDate": "2026-03-20T00:00:00.000Z",
    "endDate": "2027-03-20T00:00:00.000Z",
    "nextDate": "2026-04-20T00:00:00.000Z",
    "lastGenerated": "2026-03-20T00:00:00.000Z",
    "status": "Active",
    "invoices": [
      { "invoiceNo": "INV-25-260001", "total": 3540, "paid": 2000, "due": 1540 }
    ]
  }
}
```

---

### 🟡 API 10 — PUT `/api/v1/recurringinvoices/:riId/disable` — Disable Recurring Invoice

```
PUT http://localhost:5000/api/v1/recurringinvoices/69bd4100bb8f2114a1e7a710/disable
Authorization: Bearer <token>
```
> No request body needed.

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Recurring invoice disabled",
  "data": { "_id": "69bd4100bb8f2114a1e7a710", "status": "Inactive" }
}
```
> Once disabled, cron stops auto-generating invoices. Create a new recurring invoice to resume.

---

## Error Responses

| Code | Scenario |
|------|----------|
| 400 | Validation failed (missing fields) |
| 400 | Payment amount exceeds due |
| 401 | Missing or invalid JWT |
| 403 | Insufficient role |
| 404 | Invoice / Payment / RecurringInvoice not found |

```json
{ "success": false, "statusCode": 404, "message": "Invoice not found", "errors": [] }
```

---

## Cron Reference

```
"0 6 * * *"   ← every day at 6:00 AM (production)
"*/5 * * * *" ← every 5 minutes (for testing)
```


**Request:**
```json
{
  "customerId": "69bcf4fb3b2c2f7ac07dd287",
  "invoiceDate": "2026-03-20",
  "items": [
    {
      "description": "Monthly Accounting",
      "professionalFees": 3000,
      "govtFees": 0,
      "gstPercent": 18
    }
  ],
  "recurring": true,
  "interval": 1,
  "intervalType": "Month",
  "endDate": "2027-03-20"
}
```

**Response (201):**
```json
{
  "data": {
    "invoiceNo": "INV-25-260002",
    "isRecurring": true,
    "recurringInvoice": "65f1b2c4...",
    "total": 3540, "due": 3540
  }
}
```

> 🔄 Every month on the same day, the cron auto-generates a new invoice for this customer.

---

### POST `/api/v1/invoices/:id(InvoiceID)/payments` — Add Payment

**Request:**
```json
{
  "amount": 5000,
  "mode": "UPI",
  "note": "Paid via PhonePe",
  "paymentDate": "2026-03-20"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Payment added successfully",
  "data": {
    "_id": "65f1b2c5...",
    "amount": 5000, "mode": "UPI",
    "note": "Paid via PhonePe"
  }
}
```

> ✅ `Invoice.paid` updates to **5000** and `Invoice.due` updates to **5620** automatically.

---

### GET `/api/v1/invoices/:id` — Invoice with Payments

```json
{
  "data": {
    "invoiceNo": "INV-25-260001",
    "customer": { "name": "Raj Mishra", "companyName": "Raj Innovations Pvt Ltd" },
    "subTotal": 9000, "totalGst": 1620, "total": 10620,
    "paid": 5000, "due": 5620,
    "payments": [
      {
        "_id": "65f1b2c5...",
        "amount": 5000, "mode": "UPI",
        "note": "Paid via PhonePe",
        "paymentDate": "2026-03-20T00:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/api/v1/recurringinvoices/:id`

```json
{
  "data": {
    "_id": "65f1b2c4...",
    "customer": { "name": "Raj Mishra" },
    "interval": 1, "intervalType": "Month",
    "startDate": "2026-03-20", "endDate": "2027-03-20",
    "nextDate": "2026-04-20",
    "lastGenerated": "2026-03-20",
    "status": "Active",
    "invoices": [
      { "_id": "...", "invoiceNo": "INV-25-260002", "total": 3540, "due": 3540 }
    ]
  }
}
```

---

## Error Responses

| Code | Scenario |
|------|----------|
| 400 | Validation failed |
| 400 | Payment amount exceeds due amount |
| 401 | Unauthorized |
| 403 | Insufficient role |
| 404 | Invoice / Payment / RecurringInvoice not found |

---

## Dependency Added

```bash
node-cron    # already installed in this project
```

**Cron Schedule Reference:**
```
"0 6 * * *"   ← every day at 6:00 AM
"*/5 * * * *" ← every 5 minutes (for testing)
"0 */6 * * *" ← every 6 hours
```
