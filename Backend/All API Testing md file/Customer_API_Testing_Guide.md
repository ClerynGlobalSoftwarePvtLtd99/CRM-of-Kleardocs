# 👥 Customer Section — Full Code Reference

> **Day 3 | Kleardocs CRM**  
> Tech: Express.js, MongoDB, Mongoose, Zod, ExcelJS  
> Base URL: `/api/v1/customers`  
> Auth: JWT Bearer (all routes protected)

---

## Table of Contents

1. [File Structure](#1-file-structure)
2. [Model — `Customer.model.js`](#2-model--customermodeljs)
3. [Validation — `customer.validation.js`](#3-validation--customervalidationjs)
4. [Service — `customer.service.js`](#4-service--customerservicejs)
5. [Controller — `customer.controller.js`](#5-controller--customercontrollerjs)
6. [Routes — `customer.routes.js`](#6-routes--customerroutesjs)
7. [Register in `app.js`](#7-register-in-appjs)
8. [API Reference Table](#8-api-reference-table)
9. [Request & Response Examples](#9-request--response-examples)

---

## 1. File Structure

```
Backend/src/
├── models/
│   └── Customer.model.js          ← Customer + Director + CustomerService + CustomerCompliance
├── validations/
│   └── customer.validation.js     ← All Zod schemas
├── services/
│   └── customer.service.js        ← Business logic (14 functions)
├── controllers/
│   └── customer.controller.js     ← HTTP handlers
└── routes/
    └── customer.routes.js         ← Express router (14 endpoints)
```

---

## 2. Model — `Customer.model.js`

This single file exports **4** Mongoose models:

| Export | Model Name | Purpose |
|--------|-----------|---------|
| `default` | `Customer` | Core customer record |
| `Director` | `Director` | Directors linked to a customer |
| `CustomerService` | `CustomerService` | Services subscribed by customer |
| `CustomerCompliance` | `CustomerCompliance` | Per-year compliance checklist |

```js
// models/Customer.model.js
import mongoose from "mongoose";

// ─── Director Sub-Schema ─────────────────────────────────────────────────────
const directorSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    name: { type: String, required: true },
    phone: { type: String }
  },
  { timestamps: true }
);

// ─── Customer Service Sub-Schema ─────────────────────────────────────────────
const customerServiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    professionalFees: { type: Number, default: 0 },
    govtFees: { type: Number, default: 0 },
    gst: { type: Number, default: 18 },
    recurring: { type: Boolean, default: false },
    interval: { type: Number },
    intervalType: { type: String, enum: ["Day", "Month"] }
  },
  { timestamps: true }
);

// ─── Customer Compliance Sub-Schema ──────────────────────────────────────────
const customerComplianceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    financialYear: { type: String, required: true }, // "2025-2026"
    name: { type: String, required: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ["To Be Done", "Ongoing", "Done"],
      default: "To Be Done"
    },
    completedOn: { type: Date },
    accountant: { type: String }
  },
  { timestamps: true }
);

// ─── Customer Main Schema ─────────────────────────────────────────────────────
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    state: { type: String },
    gst: { type: String },
    type: {
      type: String,
      enum: [
        "Sole Proprietorship", "Partnership", "LLP",
        "Private Limited Company", "Public Limited Company",
        "OPC", "Trust", "NGO", "Other"
      ]
    },
    incorporationDate: { type: Date },
    newlyIncorporated: { type: Boolean, default: false },
    onboardingDate: { type: Date, default: Date.now },
    username: { type: String, unique: true, sparse: true },
    password: { type: String }, // plain-text generated password for portal
    emails: [{ type: String }],
    saleBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Director = mongoose.model("Director", directorSchema);
export const CustomerService = mongoose.model("CustomerService", customerServiceSchema);
export const CustomerCompliance = mongoose.model("CustomerCompliance", customerComplianceSchema);
export default mongoose.model("Customer", customerSchema);
```

---

## 3. Validation — `customer.validation.js`

```js
// validations/customer.validation.js
import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");

const COMPANY_TYPES = [
  "Sole Proprietorship", "Partnership", "LLP",
  "Private Limited Company", "Public Limited Company",
  "OPC", "Trust", "NGO", "Other"
];

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  companyName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  gst: z.string().optional(),
  type: z.enum(COMPANY_TYPES).optional(),
  incorporationDate: z.string().optional(),
  newlyIncorporated: z.boolean().optional().default(false),
  onboardingDate: z.string().optional(),
  saleBy: mongoId.optional(),
  username: z.string().min(3).optional(),
  emails: z.array(z.string().email()).optional()
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const updateEmailsSchema = z.object({
  emails: z.array(z.string().email())
});

export const addDirectorSchema = z.object({
  name: z.string().min(2, "Director name required"),
  phone: z.string().optional()
});

export const addCustomerServiceSchema = z.object({
  serviceId: mongoId,
  startDate: z.string().optional(),
  professionalFees: z.number().min(0).optional(),
  govtFees: z.number().min(0).optional(),
  gst: z.number().min(0).max(100).optional().default(18),
  recurring: z.boolean().optional().default(false),
  interval: z.number().optional(),
  intervalType: z.enum(["Day", "Month"]).optional(),
  endDate: z.string().optional()
});

export const addFinancialYearSchema = z.object({
  financialYear: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY")
});

export const updateComplianceSchema = z.object({
  status: z.enum(["To Be Done", "Ongoing", "Done"]).optional(),
  accountant: z.string().optional(),
  completedOn: z.string().optional()
});
```

---

## 4. Service — `customer.service.js`

> Contains all business logic. Controllers call service functions only.

```js
// services/customer.service.js
import Customer, { Director, CustomerService, CustomerCompliance } from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";
import crypto from "crypto";
import mongoose from "mongoose";

const generatePassword = () => crypto.randomBytes(4).toString("hex");

// ── 1. GET ALL CUSTOMERS (filters + pagination) ────────────────────────────
export const getCustomers = async (query) => {
  const { search, dateType, startDate, endDate, type, service, page = 1, limit = 20 } = query;
  const filter = { active: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } }
    ];
  }

  if (startDate || endDate) {
    const dateField = dateType === "incorporationDate" ? "incorporationDate" : "onboardingDate";
    filter[dateField] = {};
    if (startDate) filter[dateField].$gte = new Date(startDate);
    if (endDate) filter[dateField].$lte = new Date(endDate);
  }

  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);

  if (service) {
    const csMatches = await CustomerService.find({
      service: new mongoose.Types.ObjectId(service), status: "Active"
    }).select("customer");
    filter._id = { $in: csMatches.map((cs) => cs.customer) };
  }

  const [customers, count] = await Promise.all([
    Customer.find(filter).populate("saleBy", "name")
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Customer.countDocuments(filter)
  ]);

  // Attach active services names
  const ids = customers.map((c) => c._id);
  const allServices = await CustomerService.find({ customer: { $in: ids }, status: "Active" })
    .populate("service", "name").lean();
  const serviceMap = {};
  allServices.forEach((cs) => {
    const cid = cs.customer.toString();
    if (!serviceMap[cid]) serviceMap[cid] = [];
    serviceMap[cid].push({ name: cs.service?.name });
  });

  return {
    customers: customers.map((c) => ({
      ...c, salesPerson: c.saleBy?.name || null,
      services: serviceMap[c._id.toString()] || []
    })),
    count
  };
};

// ── 2. CREATE CUSTOMER ─────────────────────────────────────────────────────
export const createCustomer = async (data) => {
  const password = generatePassword();
  return Customer.create({
    ...data, password,
    saleBy: data.saleBy || undefined,
    onboardingDate: data.onboardingDate ? new Date(data.onboardingDate) : new Date(),
    incorporationDate: data.incorporationDate ? new Date(data.incorporationDate) : undefined
  });
};

// ── 3. ALL CUSTOMERS FOR EXPORT ────────────────────────────────────────────
export const getAllCustomersForExport = async () => {
  return Customer.find({ active: true }).populate("saleBy", "name")
    .sort({ createdAt: -1 }).lean();
};

// ── 4. LIGHTWEIGHT LIST (dropdowns) ───────────────────────────────────────
export const getCustomerList = async () => {
  return Customer.find({ active: true }).select("name companyName phone")
    .sort({ companyName: 1 }).lean();
};

// ── 5. GET SINGLE CUSTOMER (full detail) ──────────────────────────────────
export const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId).populate("saleBy", "name").lean();
  if (!customer) throw new ApiError(404, "Customer not found");

  const [directors, services, compliances] = await Promise.all([
    Director.find({ customer: customerId }).lean(),
    CustomerService.find({ customer: customerId }).populate("service", "name").lean(),
    CustomerCompliance.find({ customer: customerId }).sort({ financialYear: -1, createdAt: 1 }).lean()
  ]);

  // Lazy load invoice models
  let invoices = [], recurringInvoices = [];
  try {
    const { default: Invoice } = await import("../models/Invoice.model.js");
    invoices = await Invoice.find({ customer: customerId })
      .select("invoiceNo invoiceDate linkedService price gst total due")
      .sort({ createdAt: -1 }).lean();
  } catch (_) {}
  try {
    const { default: RecurringInvoice } = await import("../models/RecurringInvoice.model.js");
    recurringInvoices = await RecurringInvoice.find({ customer: customerId })
      .select("startDate endDate linkedService interval intervalType nextDate status")
      .sort({ createdAt: -1 }).lean();
  } catch (_) {}

  return {
    ...customer, salesPerson: customer.saleBy?.name || null,
    directors,
    services: services.map((cs) => ({
      id: cs._id, name: cs.service?.name, startDate: cs.startDate, endDate: cs.endDate,
      status: cs.status, professionalFees: cs.professionalFees,
      govtFees: cs.govtFees, gst: cs.gst, recurring: cs.recurring
    })),
    compliances, invoices, recurringInvoices
  };
};

// ── 6. UPDATE CUSTOMER ─────────────────────────────────────────────────────
export const updateCustomer = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  Object.assign(customer, {
    ...data, saleBy: data.saleBy || customer.saleBy,
    incorporationDate: data.incorporationDate ? new Date(data.incorporationDate) : customer.incorporationDate,
    onboardingDate: data.onboardingDate ? new Date(data.onboardingDate) : customer.onboardingDate
  });
  await customer.save();
  return customer;
};

// ── 7. UPDATE EMAILS ───────────────────────────────────────────────────────
export const updateEmails = async (customerId, emails) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  customer.emails = emails;
  await customer.save();
};

// ── 8. ADD DIRECTOR ────────────────────────────────────────────────────────
export const addDirector = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  return Director.create({ customer: customerId, ...data });
};

// ── 9. DELETE DIRECTOR ─────────────────────────────────────────────────────
export const deleteDirector = async (customerId, directorId) => {
  const director = await Director.findOne({ _id: directorId, customer: customerId });
  if (!director) throw new ApiError(404, "Director not found");
  await director.deleteOne();
};

// ── 10. ADD SERVICE ────────────────────────────────────────────────────────
export const addService = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  return CustomerService.create({
    customer: customerId, service: data.serviceId,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    professionalFees: data.professionalFees || 0,
    govtFees: data.govtFees || 0, gst: data.gst ?? 18,
    recurring: data.recurring || false, interval: data.interval,
    intervalType: data.intervalType, status: "Active"
  });
};

// ── 11. END SERVICE ────────────────────────────────────────────────────────
export const endService = async (customerId, customerServiceId) => {
  const cs = await CustomerService.findOne({ _id: customerServiceId, customer: customerId });
  if (!cs) throw new ApiError(404, "Customer service not found");
  cs.endDate = new Date();
  cs.status = "Inactive";
  await cs.save();
  return { endDate: cs.endDate };
};

// ── 12. GET COMPLIANCES BY YEAR ────────────────────────────────────────────
export const getCompliances = async (customerId, year) => {
  const filter = { customer: customerId };
  if (year) filter.financialYear = year;
  return CustomerCompliance.find(filter).sort({ createdAt: 1 }).lean();
};

// ── 13. ADD FINANCIAL YEAR (clone from ComplianceSetting templates) ────────
export const addFinancialYear = async (customerId, financialYear) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  const existing = await CustomerCompliance.findOne({ customer: customerId, financialYear });
  if (existing) throw new ApiError(400, "Financial year already added for this customer");

  let templates = [];
  try {
    const { default: ComplianceSetting } = await import("../models/ComplianceSetting.model.js");
    templates = await ComplianceSetting.find({ year: financialYear }).lean();
  } catch (_) { /* ComplianceSetting model not yet built */ }

  if (templates.length > 0) {
    await CustomerCompliance.insertMany(
      templates.map((t) => ({
        customer: customerId, financialYear,
        name: t.name, expiryDate: t.expiryDate || undefined, status: "To Be Done"
      }))
    );
  }

  return { financialYear };
};

// ── 14. UPDATE SINGLE COMPLIANCE ──────────────────────────────────────────
export const updateCompliance = async (customerId, complianceId, data) => {
  const compliance = await CustomerCompliance.findOne({ _id: complianceId, customer: customerId });
  if (!compliance) throw new ApiError(404, "Compliance not found");

  if (data.status) compliance.status = data.status;
  if (data.accountant !== undefined) compliance.accountant = data.accountant;
  if (data.completedOn) compliance.completedOn = new Date(data.completedOn);
  else if (data.status === "Done" && !compliance.completedOn) compliance.completedOn = new Date();

  await compliance.save();
  return compliance;
};
```

---

## 5. Controller — `customer.controller.js`

```js
// controllers/customer.controller.js
import * as customerService from "../services/customer.service.js";
import { ApiResponse } from "../utils/response.js";
import ExcelJS from "exceljs";

export const getCustomers = async (req, res) => {
  const { customers, count } = await customerService.getCustomers(req.query);
  res.status(200).json(new ApiResponse(200, { count, data: customers }, "Customers fetched"));
};

export const createCustomer = async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
};

export const exportCustomers = async (req, res) => {
  const customers = await customerService.getAllCustomersForExport();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Customers");
  sheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Company Name", key: "companyName", width: 35 },
    { header: "Type", key: "type", width: 28 },
    { header: "GST", key: "gst", width: 22 },
    { header: "State", key: "state", width: 22 },
    { header: "Address", key: "address", width: 40 },
    { header: "Incorporation Date", key: "incorporationDate", width: 20 },
    { header: "Onboarding Date", key: "onboardingDate", width: 20 },
    { header: "Newly Incorporated", key: "newlyIncorporated", width: 18 },
    { header: "Username", key: "username", width: 20 },
    { header: "Sales Person", key: "salesPerson", width: 22 }
  ];
  customers.forEach((c) => {
    sheet.addRow({
      ...c, salesPerson: c.saleBy?.name || "",
      newlyIncorporated: c.newlyIncorporated ? "Yes" : "No",
      incorporationDate: c.incorporationDate ? new Date(c.incorporationDate).toLocaleDateString("en-IN") : "",
      onboardingDate: c.onboardingDate ? new Date(c.onboardingDate).toLocaleDateString("en-IN") : ""
    });
  });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

export const getCustomerList = async (req, res) => {
  const list = await customerService.getCustomerList();
  res.status(200).json(new ApiResponse(200, list, "Customer list fetched"));
};

export const getCustomerById = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.status(200).json(new ApiResponse(200, customer, "Customer fetched"));
};

export const updateCustomer = async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.customerId, req.body);
  res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully"));
};

export const updateEmails = async (req, res) => {
  await customerService.updateEmails(req.params.customerId, req.body.emails);
  res.status(200).json(new ApiResponse(200, null, "Emails updated successfully"));
};

export const addDirector = async (req, res) => {
  const director = await customerService.addDirector(req.params.customerId, req.body);
  res.status(201).json(new ApiResponse(201, director, "Director added successfully"));
};

export const deleteDirector = async (req, res) => {
  await customerService.deleteDirector(req.params.customerId, req.params.directorId);
  res.status(200).json(new ApiResponse(200, null, "Director removed successfully"));
};

export const addService = async (req, res) => {
  const cs = await customerService.addService(req.params.customerId, req.body);
  res.status(201).json(new ApiResponse(201, cs, "Service added successfully"));
};

export const endService = async (req, res) => {
  const result = await customerService.endService(req.params.customerId, req.params.serviceId);
  res.status(200).json(new ApiResponse(200, result, "Service ended successfully"));
};

export const getCompliances = async (req, res) => {
  const compliances = await customerService.getCompliances(req.params.customerId, req.query.year);
  res.status(200).json(new ApiResponse(200, compliances, "Compliances fetched"));
};

export const addFinancialYear = async (req, res) => {
  const result = await customerService.addFinancialYear(req.params.customerId, req.body.financialYear);
  res.status(201).json(new ApiResponse(201, result, "Financial year added successfully"));
};

export const updateCompliance = async (req, res) => {
  const compliance = await customerService.updateCompliance(
    req.params.customerId, req.params.complianceId, req.body
  );
  res.status(200).json(new ApiResponse(200, compliance, "Compliance updated successfully"));
};
```

---

## 6. Routes — `customer.routes.js`

```js
// routes/customer.routes.js
import express from "express";
import {
  getCustomers, createCustomer, exportCustomers, getCustomerList,
  getCustomerById, updateCustomer, updateEmails,
  addDirector, deleteDirector, addService, endService,
  getCompliances, addFinancialYear, updateCompliance
} from "../controllers/customer.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createCustomerSchema, updateCustomerSchema, updateEmailsSchema,
  addDirectorSchema, addCustomerServiceSchema, addFinancialYearSchema, updateComplianceSchema
} from "../validations/customer.validation.js";

const router = express.Router();
router.use(auth);

// Special routes BEFORE :customerId (avoids route conflict)
router.get("/export", exportCustomers);
router.get("/list", getCustomerList);

// Customer CRUD
router.get("/", getCustomers);
router.post("/", checkRole("admin", "agent"), validate(createCustomerSchema), createCustomer);
router.get("/:customerId", getCustomerById);
router.put("/:customerId", checkRole("admin", "agent"), validate(updateCustomerSchema), updateCustomer);

// Emails
router.put("/:customerId/emails", checkRole("admin", "agent"), validate(updateEmailsSchema), updateEmails);

// Directors
router.post("/:customerId/directors", checkRole("admin", "agent"), validate(addDirectorSchema), addDirector);
router.delete("/:customerId/directors/:directorId", checkRole("admin"), deleteDirector);

// Services
router.post("/:customerId/services", checkRole("admin", "agent"), validate(addCustomerServiceSchema), addService);
router.put("/:customerId/services/:serviceId/end", checkRole("admin", "agent"), endService);

// Compliances
router.get("/:customerId/compliances", getCompliances);
router.post("/:customerId/financial-year", checkRole("admin"), validate(addFinancialYearSchema), addFinancialYear);
router.put("/:customerId/compliances/:complianceId", checkRole("admin", "accountant"), validate(updateComplianceSchema), updateCompliance);

export default router;
```

---

## 7. Register in `app.js`

```js
// In src/app.js — add these two lines:

import CustomerRoutes from "./routes/customer.routes.js";   // ← add import
// ...
app.use("/api/v1/customers", CustomerRoutes);               // ← add route
```

---

## 8. API Reference Table

| # | Method | Endpoint | Auth Role | Description |
|---|--------|----------|-----------|-------------|
| 1 | GET | `/api/v1/customers` | All | List customers (filter + paginate) |
| 2 | POST | `/api/v1/customers` | admin/agent | Create new customer |
| 3 | GET | `/api/v1/customers/export` | All | Download Excel file |
| 4 | GET | `/api/v1/customers/list` | All | Dropdown list (id, name, phone) |
| 5 | GET | `/api/v1/customers/:id` | All | Full customer detail |
| 6 | PUT | `/api/v1/customers/:id` | admin/agent | Update customer |
| 7 | PUT | `/api/v1/customers/:id/emails` | admin/agent | Replace email list |
| 8 | POST | `/api/v1/customers/:id/directors` | admin/agent | Add director |
| 9 | DELETE | `/api/v1/customers/:id/directors/:dId` | admin | Remove director |
| 10 | POST | `/api/v1/customers/:id/services` | admin/agent | Attach service |
| 11 | PUT | `/api/v1/customers/:id/services/:sId/end` | admin/agent | End service |
| 12 | GET | `/api/v1/customers/:id/compliances?year=` | All | Get compliance list |
| 13 | POST | `/api/v1/customers/:id/financial-year` | admin | Add financial year |
| 14 | PUT | `/api/v1/customers/:id/compliances/:cId` | admin/accountant | Update compliance |

---

## 9. Request & Response Examples

### POST `/api/v1/customers` — Create Customer

**Request:**
```json
{
  "name": "Raj Mishra",
  "phone": "9999988888",
  "companyName": "Raj Innovations Pvt Ltd",
  "address": "Kolkata, WB",
  "state": "WEST BENGAL",
  "gst": "19AABCU9603R1ZX",
  "type": "Private Limited Company",
  "incorporationDate": "2024-01-15",
  "newlyIncorporated": true,
  "onboardingDate": "2026-03-20",
  "username": "RAJINNOV001"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
    "name": "Raj Mishra",
    "phone": "9999988888",
    "companyName": "Raj Innovations Pvt Ltd",
    "type": "Private Limited Company",
    "password": "a3f9b2c1",
    "username": "RAJINNOV001",
    "active": true,
    "createdAt": "2026-03-20T05:39:00.000Z"
  }
}
```

---

### GET `/api/v1/customers?search=raj&type=Private Limited Company&page=1&limit=10`

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "count": 2,
    "data": [
      {
        "_id": "65f1b2c3...",
        "name": "Raj Mishra",
        "phone": "9999988888",
        "companyName": "Raj Innovations Pvt Ltd",
        "type": "Private Limited Company",
        "salesPerson": "Ritu Kaur",
        "services": [{ "name": "Annual Compliance" }]
      }
    ]
  }
}
```

---

### POST `/api/v1/customers/:id/directors`

**Request:**
```json
{ "name": "Priya Sharma", "phone": "8800112233" }
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Director added successfully",
  "data": {
    "_id": "65f1b2c4...",
    "customer": "65f1b2c3...",
    "name": "Priya Sharma",
    "phone": "8800112233"
  }
}
```

---

### POST `/api/v1/customers/:id/services`

**Request:**
```json
{
  "serviceId": "676fb41f6591cff83b2efdb6",
  "startDate": "2026-03-20",
  "professionalFees": 2000,
  "govtFees": 0,
  "gst": 18,
  "recurring": true,
  "interval": 3,
  "intervalType": "Month",
  "endDate": "2027-03-20"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Service added successfully",
  "data": {
    "_id": "65f1b2c5...",
    "status": "Active",
    "professionalFees": 2000,
    "govtFees": 0,
    "gst": 18,
    "recurring": true,
    "interval": 3,
    "intervalType": "Month"
  }
}
```

---

### POST `/api/v1/customers/:id/financial-year`

**Request:**
```json
{ "financialYear": "2025-2026" }
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Financial year added successfully",
  "data": { "financialYear": "2025-2026" }
}
```

> ⚡ **Auto-create logic:** Clones all compliance entries from `ComplianceSetting` model (for matching year) into `CustomerCompliance`. If `ComplianceSetting` model doesn't exist yet, starts with empty set.

---

> ### ⚠️ Why is compliances array empty?
> Compliance data only appears after you complete **both steps below** in order.

---

### 🔧 STEP 1 — Create Compliance Templates (only once per year)

> **This will be available after the Compliance Settings module is built.**  
> Creates global templates for a financial year that every customer clones from.

```
POST http://localhost:5000/api/v1/compliance-settings
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
  "year": "2025-2026",
  "hasExpiry": true,
  "expiryDate": "2025-03-31",
  "inc20": false,
  "daysOfExpiry": 30
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Compliance setting created",
  "data": {
    "_id": "65f1b2c9...",
    "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
    "year": "2025-2026",
    "expiryDate": "2025-03-31"
  }
}
```

> Repeat this for all compliance items of the year (e.g. ADT-01, AOC-4, MGT-7, ITR, etc.)

---

### 🔧 STEP 2 — Add Financial Year to Customer (clones templates → creates compliance rows)

```
POST http://localhost:5000/api/v1/customers/:id/financial-year
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "financialYear": "2025-2026"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Financial year added successfully",
  "data": { "financialYear": "2025-2026" }
}
```

> ✅ This auto-creates one `CustomerCompliance` row per template found for `"2025-2026"`.  
> ❌ If no templates exist yet (Step 1 not done), compliance list will be empty.

---

### ✅ STEP 3 — Now GET compliances will show data

### GET `/api/v1/customers/:id/compliances?year=2025-2026`

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    {
      "_id": "65f1b2c6...",
      "name": "Preparation & Filing of Form ADT-01",
      "financialYear": "2025-2026",
      "expiryDate": "2025-03-09",
      "status": "To Be Done",
      "completedOn": null,
      "accountant": null
    }
  ]
}
```

---

### PUT `/api/v1/customers/:id/compliances/:cId`

**Request:**
```json
{ "status": "Done", "accountant": "Samrat", "completedOn": "2026-03-20" }
```

**Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Compliance updated successfully",
  "data": {
    "status": "Done",
    "accountant": "Samrat",
    "completedOn": "2026-03-20T00:00:00.000Z"
  }
}
```

---

### GET `/api/v1/customers/:id` — Full Detail Response

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "_id": "65f1b2c3...",
    "name": "Raj Mishra",
    "phone": "9999988888",
    "companyName": "Raj Innovations Pvt Ltd",
    "type": "Private Limited Company",
    "address": "Kolkata, WB",
    "state": "WEST BENGAL",
    "gst": "19AABCU9603R1ZX",
    "incorporationDate": "2024-01-15T00:00:00.000Z",
    "onboardingDate": "2026-03-20T00:00:00.000Z",
    "newlyIncorporated": true,
    "username": "RAJINNOV001",
    "password": "a3f9b2c1",
    "emails": ["raj@rajinnov.com"],
    "salesPerson": "Ritu Kaur",
    "directors": [
      { "_id": "...", "name": "Priya Sharma", "phone": "8800112233" }
    ],
    "services": [
      {
        "id": "...", "name": "Annual Compliance",
        "startDate": "2026-03-20", "endDate": null,
        "status": "Active", "professionalFees": 2000,
        "govtFees": 0, "gst": 18, "recurring": true
      }
    ],
    "compliances": [],
    "invoices": [],
    "recurringInvoices": []
  }
}
```

---

## Error Responses

| Code | Scenario |
|------|----------|
| 400 | Validation failed (Zod schema) |
| 400 | Financial year already added |
| 401 | Missing / invalid JWT |
| 403 | Insufficient role |
| 404 | Customer / Director / Service / Compliance not found |
| 500 | Internal server error |

**Error format:**
```json
{ "success": false, "statusCode": 404, "message": "Customer not found" }
```

---

## Dependency Added

```bash
pnpm add exceljs   # Required for GET /customers/export
```

Package version: **exceljs@4.4.0**
