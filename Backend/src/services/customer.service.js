import Customer, {
  Director,
  CustomerService,
  CustomerCompliance
} from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";
import crypto from "crypto";
import mongoose from "mongoose";
import EmailLog from "../models/EmailLog.model.js";

// ─── Helper: generate 8-char random password ─────────────────────────────────
const generatePassword = () => crypto.randomBytes(4).toString("hex");

// ─── Utility: Get Current Financial Year (April–March rule) ──────────────────
// Apr 1, 2026 – Mar 31, 2027  →  "2026-2027"
const getCurrentFinancialYear = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed; April = 3
  const year = now.getFullYear();
  return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

// ─── GET ALL CUSTOMERS (filters + pagination) ────────────────────────────────
export const getCustomers = async (query) => {
  const {
    search, dateType, startDate, endDate,
    type, service,
    page = 1, limit = 20
  } = query;

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

  // If filtering by service, first find matching customerService docs
  let customerIds = null;
  if (service) {
    const csMatches = await CustomerService.find({
      service: new mongoose.Types.ObjectId(service),
      status: "Active"
    }).select("customer");
    customerIds = csMatches.map((cs) => cs.customer);
    filter._id = { $in: customerIds };
  }

  const [customers, count] = await Promise.all([
    Customer.find(filter)
      .populate("saleBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Customer.countDocuments(filter)
  ]);

  // Attach active services to each customer
  const customerIdList = customers.map((c) => c._id);
  const allServices = await CustomerService.find({
    customer: { $in: customerIdList },
    status: "Active"
  })
    .populate("service", "name")
    .lean();

  const serviceMap = {};
  allServices.forEach((cs) => {
    const cid = cs.customer.toString();
    if (!serviceMap[cid]) serviceMap[cid] = [];
    serviceMap[cid].push({ name: cs.service?.name });
  });

  const enriched = customers.map((c) => ({
    ...c,
    salesPerson: c.saleBy?.name || null,
    services: serviceMap[c._id.toString()] || []
  }));

  return { customers: enriched, count };
};

// ─── CREATE CUSTOMER (standalone) ────────────────────────────────────────────
export const createCustomer = async (data) => {
  const password = generatePassword();

  const customer = await Customer.create({
    ...data,
    saleBy: data.saleBy || undefined,
    password,
    onboardingDate: data.onboardingDate ? new Date(data.onboardingDate) : new Date(),
    incorporationDate: data.incorporationDate ? new Date(data.incorporationDate) : undefined
  });

  return customer;
};

// ─── EXPORT ALL CUSTOMERS as data array (caller handles xlsx) ────────────────
export const getAllCustomersForExport = async () => {
  const customers = await Customer.find({ active: true })
    .populate("saleBy", "name")
    .sort({ createdAt: -1 })
    .lean();
  return customers;
};

// ─── LIGHTWEIGHT LIST for dropdowns ──────────────────────────────────────────
export const getCustomerList = async () => {
  return Customer.find({ active: true })
    .select("name companyName phone")
    .sort({ companyName: 1 })
    .lean();
};

// ─── GET SINGLE CUSTOMER (full detail) ───────────────────────────────────────
/**
 * Helper to get financial year start/end dates from string "2025-2026"
 * April 1st to March 31st
 */
const getFinancialYearRange = (yearString) => {
  if (!yearString || !yearString.includes('-')) return null;
  try {
    const [startYear, endYear] = yearString.split('-').map(Number);
    const startDate = new Date(startYear, 3, 1, 0, 0, 0, 0); 
    const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999);
    return { startDate, endDate };
  } catch (e) {
    return null;
  }
};

const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeName = (str = "") =>
  String(str)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TEMPLATE_ALIAS_MAP = {
  "compliance update": ["ROC Compliance Service", "Annual Compliance plus Bookkeeping", "Service List"],
  "tds return": ["TDS Return Service"],
  "professional tax registration services": ["Professional Tax Service"],
  "startup india registration": ["Startup India Service"],
  "gst registration": ["GST Registration"],
  "msme certification": ["MSME Certification"],
  "director resignation": ["Director Resignation"],
  "gst filing": ["GST Filing"]
};

const resolveTemplateByName = async (name) => {
  if (!name || !name.trim()) return null;
  const { default: EmailTemplate } = await import("../models/EmailTemplate.model.js");
  const raw = name.trim();
  const normalized = normalizeName(raw);
  const aliases = TEMPLATE_ALIAS_MAP[normalized] || [];
  const candidates = [raw, ...aliases];

  const templates = await EmailTemplate.find({
    $or: candidates.map((n) => ({ name: { $regex: `^${escapeRegex(n)}$`, $options: "i" } }))
  })
    .select("name subject body content html type status updatedAt")
    .lean();

  if (!templates.length) return null;

  const score = (x) =>
    (x?.status === "Active" ? 2 : 0) +
    ((x?.body || x?.content || x?.html) ? 2 : 0) +
    (x?.subject ? 1 : 0);

  templates.sort((a, b) => score(b) - score(a));
  return templates[0] || null;
};

const cloneComplianceSettingsToCustomerYear = async (customerId, financialYear) => {
  let templates = [];
  try {
    const { default: ComplianceSetting } = await import("../models/ComplianceSetting.model.js");
    templates = await ComplianceSetting.find({ financialYear }).lean();
  } catch (error) {
    console.error("Error fetching compliance templates:", error);
  }

  if (templates.length === 0) return { inserted: 0 };

  // Insert only missing records (do not stop when 1 record already exists).
  // Uniqueness key uses name+expiryDate to allow same name with different dates.
  const existingCompliances = await CustomerCompliance.find({
    customer: customerId,
    financialYear
  })
    .select("name expiryDate")
    .lean();

  const toDateKey = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");
  const existingKeySet = new Set(
    existingCompliances.map((c) => `${c.name}__${toDateKey(c.expiryDate)}`)
  );

  const customerObjId = new mongoose.Types.ObjectId(customerId);
  const complianceDocs = templates
    .filter((t) => !existingKeySet.has(`${t.name}__${toDateKey(t.expiryDate)}`))
    .map((t) => ({
      customer: customerObjId,
      financialYear,
      name: t.name,
      expiryDate: t.expiryDate || undefined,
      status: "To Be Done",
      hasExpiry: !!t.hasExpiry
    }));

  if (complianceDocs.length > 0) {
    await CustomerCompliance.insertMany(complianceDocs);
  }

  return { inserted: complianceDocs.length };
};

// ─── GET SINGLE CUSTOMER (full detail) ───────────────────────────────────────
export const getCustomerById = async (customerId, year) => {
  const customer = await Customer.findById(customerId)
    .populate("saleBy", "name")
    .lean();

  if (!customer) throw new ApiError(404, "Customer not found");

  // Auto-detect current financial year if none explicitly requested.
  // This ensures compliances are always shown on initial page load.
  const effectiveYear = year || getCurrentFinancialYear();
  const dateRange = getFinancialYearRange(effectiveYear);

  // Always filter by the effective year — current FY when not specified.
  const complianceFilter = { customer: customerId, financialYear: effectiveYear };

  const serviceFilter = { customer: customerId };
  if (dateRange) {
    serviceFilter.$or = [
      { startDate: { $lte: dateRange.endDate }, endDate: { $gte: dateRange.startDate } },
      { startDate: { $lte: dateRange.endDate }, endDate: null }
    ];
  }

  const historyFilter = { customer: customerId };
  if (dateRange) {
    historyFilter.date = { $gte: dateRange.startDate, $lte: dateRange.endDate };
  }

  const invoiceFilter = { customer: customerId };
  if (dateRange) {
    invoiceFilter.invoiceDate = { $gte: dateRange.startDate, $lte: dateRange.endDate };
  }

  const recurringFilter = { customer: customerId };
  if (dateRange) {
    recurringFilter.startDate = { $gte: dateRange.startDate, $lte: dateRange.endDate };
  }

  const attachedFinancialYears = Array.isArray(customer.financialYears) ? customer.financialYears : [];

  let [directors, services, compliances, emailHistory] = await Promise.all([
    Director.find({ customer: customerId }).lean(),
    CustomerService.find(serviceFilter)
      .populate("service", "name")
      .lean(),
    CustomerCompliance.find(complianceFilter)
      .sort({ financialYear: -1, createdAt: 1 })
      .lean(),
    EmailLog.find(historyFilter)
      .populate("template", "name subject body content html type status")
      .sort({ date: -1 })
      .lean()
  ]);

  // Fallback: for legacy logs where template ref is missing,
  // resolve template details from templateName for preview rendering.
  try {
    const missingTemplateLogs = emailHistory.filter(
      (log) => !log.template && typeof log.templateName === "string" && log.templateName.trim()
    );
    if (missingTemplateLogs.length > 0) {
      const uniqueNames = [...new Set(missingTemplateLogs.map((l) => l.templateName.trim()))];
      const templateMap = new Map();
      for (const name of uniqueNames) {
        const resolved = await resolveTemplateByName(name);
        if (resolved) templateMap.set(normalizeName(name), resolved);
      }

      emailHistory = emailHistory.map((log) => {
        if (log.template) return log;
        const fallback = templateMap.get(normalizeName(log.templateName || ""));
        return fallback ? { ...log, template: fallback } : log;
      });
    }
  } catch (err) {
    console.error("Email template fallback resolution failed:", err);
  }

  // Auto-init: clone any missing compliance settings for the effective year.
  // This is idempotent — already-existing records are skipped by cloneComplianceSettingsToCustomerYear.
  // Runs on every page load so any newly added global settings are backfilled automatically.
  if (attachedFinancialYears.includes(effectiveYear)) {
    try {
      await cloneComplianceSettingsToCustomerYear(customerId, effectiveYear);
      compliances = await CustomerCompliance.find(complianceFilter).sort({ financialYear: -1, createdAt: 1 }).lean();
    } catch (err) {
      console.error("Auto-init compliance error:", err);
    }
  }

  // Lazy-load Invoice & RecurringInvoice models
  let invoices = [];
  let recurringInvoices = [];
  try {
    const { default: Invoice } = await import("../models/Invoice.model.js");
    const rawInvoices = await Invoice.find(invoiceFilter)
      .populate("items.service", "name")
      .sort({ createdAt: -1 })
      .lean();
    
    invoices = rawInvoices.map(inv => ({
      ...inv,
      id: inv._id,
      date: inv.invoiceDate, // Standardize naming for frontend
      linkedService: inv.items?.[0]?.description || inv.items?.[0]?.service?.name || '-',
      price: inv.subTotal || 0,
      gstAmount: inv.totalGst || 0,
      total: inv.total || 0,
    }));
  } catch (_) {}

  try {
    const { default: RecurringInvoice } = await import("../models/RecurringInvoice.model.js");
    const rawRecurring = await RecurringInvoice.find(recurringFilter)
      .populate("items.service", "name")
      .sort({ createdAt: -1 })
      .lean();
    
    recurringInvoices = rawRecurring.map(ri => ({
      ...ri,
      id: ri._id,
      linkedService: ri.items?.[0]?.description || ri.items?.[0]?.service?.name || '-',
    }));
  } catch (_) {}

  return {
    ...customer,
    salesPerson: customer.saleBy?.name || null,
    directors,
    services: services.map((cs) => ({
      id: cs._id,
      name: cs.service?.name || "Standard Service",
      startDate: cs.startDate,
      endDate: cs.endDate,
      status: cs.status,
      professionalFees: cs.professionalFees,
      govtFees: cs.govtFees,
      gst: cs.gst,
      recurring: cs.recurring
    })),
    financialYears: [...attachedFinancialYears].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0)),
    compliances,
    invoices,
    recurringInvoices,
    emailHistory: emailHistory.map(log => ({
      id: log._id,
      date: log.date,
      name: log.template?.name || log.templateName || 'Unknown Template',
      template: log.template
    }))
  };
};

// ─── UPDATE CUSTOMER ──────────────────────────────────────────────────────────
export const updateCustomer = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  Object.assign(customer, {
    ...data,
    saleBy: data.saleBy || customer.saleBy,
    incorporationDate: data.incorporationDate
      ? new Date(data.incorporationDate)
      : customer.incorporationDate,
    onboardingDate: data.onboardingDate
      ? new Date(data.onboardingDate)
      : customer.onboardingDate
  });

  await customer.save();
  
  // Re-populate for frontend display
  await customer.populate("saleBy", "name");
  
  const updatedCustomer = customer.toObject();
  updatedCustomer.salesPerson = updatedCustomer.saleBy?.name || null;
  
  return updatedCustomer;
};

// ─── UPDATE EMAILS ────────────────────────────────────────────────────────────
export const updateEmails = async (customerId, emails) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");
  customer.emails = emails;
  await customer.save();
};

// ─── ADD DIRECTOR ─────────────────────────────────────────────────────────────
export const addDirector = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  const director = await Director.create({ customer: customerId, ...data });
  return director;
};

// ─── DELETE DIRECTOR ──────────────────────────────────────────────────────────
export const deleteDirector = async (customerId, directorId) => {
  const director = await Director.findOne({ _id: directorId, customer: customerId });
  if (!director) throw new ApiError(404, "Director not found");
  await director.deleteOne();
};

// ─── ADD SERVICE TO CUSTOMER (with multi-module sync) ────────────────────────
export const addService = async (customerId, data, userId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  // Fetch service master data (using dynamic import for flexibility)
  const { default: Service } = await import("../models/Service.model.js");
  const serviceMaster = await Service.findById(data.serviceId);
  if (!serviceMaster) throw new ApiError(404, "Service master not found");

  const startDate = data.startDate ? new Date(data.startDate) : new Date();

  // 1. Create the Customer Service record
  const cs = await CustomerService.create({
    customer: customerId,
    service: data.serviceId,
    startDate,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    professionalFees: data.professionalFees || 0,
    govtFees: data.govtFees || 0,
    gst: data.gst ?? 18,
    recurring: data.recurring || false,
    interval: data.interval || 1, 
    intervalType: data.intervalType || "Month",
    status: "Active"
  });

  // 1.1 Create an invoice for this service (for Invoice History)
  try {
    const { createInvoice } = await import("./invoice.service.js");
    await createInvoice(
      {
        customerId,
        invoiceDate: startDate,
        items: [
          {
            serviceId: data.serviceId,
            description: serviceMaster.name,
            professionalFees: data.professionalFees || 0,
            govtFees: data.govtFees || 0,
            gstPercent: data.gst ?? 18,
            hsn: serviceMaster.hsn || "998399"
          }
        ]
      },
      userId
    );
  } catch (err) {
    // Non-blocking: service creation should not fail due to invoice generation
    console.error("Auto-invoice creation failed:", err);
  }

  // 1.2 Add related email template to Email Template History
  try {
    const templateName = serviceMaster.template || serviceMaster.name;
    const templateDoc = await resolveTemplateByName(templateName);

    await EmailLog.create({
      customer: customerId,
      template: templateDoc?._id,
      templateName: templateDoc?.name || templateName,
      date: new Date()
    });
  } catch (err) {
    // Non-blocking: service creation should not fail due to logging
    console.error("Auto email-history log failed:", err);
  }

  // 2. If "Annual Compliance" → Add to Compliance History 
  if (serviceMaster.name === "Annual Compliance") {
    // Generate Financial Year (April-March logic)
    const month = startDate.getMonth(); // 0-indexed, Jan=0, Mar=2, Apr=3
    const year = startDate.getFullYear();
    const financialYear = month >= 3 ? `${year}-${year+1}` : `${year-1}-${year}`;

    // Call addFinancialYear to clone all tasks from ComplianceSetting master
    try {
      await addFinancialYear(customerId, financialYear);
    } catch (error) {
      // If already exists, we skip. Otherwise, we log it.
      if (error.statusCode !== 400) {
        console.error("Error cloning compliance tasks:", error);
      }
    }
  }

  // 3. If Recurring enabled → Create Recurring Invoice 
  if (data.recurring) {
    const { default: RecurringInvoice } = await import("../models/RecurringInvoice.model.js");
    await RecurringInvoice.create({
      customer: customerId,
      items: [{
        service: data.serviceId,
        description: serviceMaster.name,
        professionalFees: data.professionalFees || 0,
        govtFees: data.govtFees || 0,
        gstPercent: data.gst ?? 18,
      }],
      startDate,
      nextDate: startDate, 
      interval: data.interval || 1,
      intervalType: data.intervalType || "Month",
      status: "Active"
    });
  }

  return cs;
};

// ─── END SERVICE ──────────────────────────────────────────────────────────────
export const endService = async (customerId, customerServiceId) => {
  const cs = await CustomerService.findOne({
    _id: customerServiceId,
    customer: customerId
  });
  if (!cs) throw new ApiError(404, "Customer service not found");

  cs.endDate = new Date();
  cs.status = "Inactive";
  await cs.save();

  return { endDate: cs.endDate };
};

// ─── GET COMPLIANCES BY FINANCIAL YEAR ───────────────────────────────────────
export const getCompliances = async (customerId, year) => {
  // Default to current financial year when none specified
  const effectiveYear = year || getCurrentFinancialYear();
  const filter = { customer: customerId, financialYear: effectiveYear };

  const compliances = await CustomerCompliance.find(filter)
    .sort({ createdAt: 1 })
    .lean();

  return compliances;
};

// ─── ADD FINANCIAL YEAR (clone from ComplianceSetting templates) ─────────────
export const addFinancialYear = async (customerId, financialYear) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  const existingYears = Array.isArray(customer.financialYears) ? customer.financialYears : [];

  // Add the year to the customer record only if not already present.
  // Do NOT throw 400 — we always want to clone any missing compliance records below.
  if (!existingYears.includes(financialYear)) {
    customer.financialYears = [...existingYears, financialYear];
    await customer.save();
  }

  // PERMANENTLY assign compliance records from global settings templates.
  // This is idempotent: existing records are skipped, only missing ones are inserted.
  await cloneComplianceSettingsToCustomerYear(customerId, financialYear);

  // Return the assigned compliance records so the frontend can display them immediately.
  const compliances = await CustomerCompliance.find({
    customer: customerId,
    financialYear
  })
    .sort({ createdAt: 1 })
    .lean();

  return { financialYear, compliances };
};

// ─── UPDATE SINGLE COMPLIANCE ─────────────────────────────────────────────────
export const updateCompliance = async (customerId, complianceId, data) => {
  // Find by _id only first (insertMany stores customer as ObjectId, findOne by both is safer)
  const compliance = await CustomerCompliance.findById(complianceId);
  if (!compliance) throw new ApiError(404, "Compliance not found");

  // Verify it belongs to this customer
  if (compliance.customer.toString() !== customerId.toString()) {
    throw new ApiError(403, "Compliance does not belong to this customer");
  }

  if (data.name !== undefined) compliance.name = data.name;
  if (data.status !== undefined) compliance.status = data.status;
  if (data.accountant !== undefined) compliance.accountant = data.accountant;
  if (data.completedOn) compliance.completedOn = new Date(data.completedOn);
  
  // Detailed configuration fields
  if (data.hasExpiry !== undefined) compliance.hasExpiry = data.hasExpiry;
  if (data.isInc20 !== undefined) compliance.isInc20 = data.isInc20;
  if (data.daysAfterInc !== undefined) compliance.daysAfterInc = data.daysAfterInc;
  if (data.expiryTemplate !== undefined) compliance.expiryTemplate = data.expiryTemplate;
  if (data.completeTemplate !== undefined) compliance.completeTemplate = data.completeTemplate;
  else if (data.status === "Done" && !compliance.completedOn) {
    compliance.completedOn = new Date();
  }

  await compliance.save();
  return compliance;
};