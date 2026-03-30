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

// ─── GET SINGLE CUSTOMER (full detail) ───────────────────────────────────────
export const getCustomerById = async (customerId, year) => {
  const customer = await Customer.findById(customerId)
    .populate("saleBy", "name")
    .lean();

  if (!customer) throw new ApiError(404, "Customer not found");

  const dateRange = getFinancialYearRange(year);

  // Filters
  const complianceFilter = { customer: customerId };
  if (year) complianceFilter.financialYear = year;

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

  let [directors, services, compliances, emailHistory] = await Promise.all([
    Director.find({ customer: customerId }).lean(),
    CustomerService.find(serviceFilter)
      .populate("service", "name")
      .lean(),
    CustomerCompliance.find(complianceFilter)
      .sort({ financialYear: -1, createdAt: 1 })
      .lean(),
    EmailLog.find(historyFilter)
      .populate("template", "name")
      .sort({ date: -1 })
      .lean()
  ]);

  // AUTO-INITIALIZE: If requested year is empty, clone from settings
  if (year && compliances.length === 0) {
    try {
      await addFinancialYear(customerId, year);
      // Re-fetch compliances after init
      compliances = await CustomerCompliance.find(complianceFilter).sort({ financialYear: -1, createdAt: 1 }).lean();
    } catch (err) {
      if (err.statusCode !== 400) console.error("Auto-init compliance error:", err);
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
export const addService = async (customerId, data) => {
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
  const filter = { customer: customerId };
  if (year) filter.financialYear = year;

  const compliances = await CustomerCompliance.find(filter)
    .sort({ createdAt: 1 })
    .lean();

  return compliances;
};

// ─── ADD FINANCIAL YEAR (clone from ComplianceSetting templates) ─────────────
export const addFinancialYear = async (customerId, financialYear) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  // Check if already exists
  const existing = await CustomerCompliance.findOne({ customer: customerId, financialYear });
  if (existing) throw new ApiError(400, "Financial year already added for this customer");

  // Try to clone from ComplianceSettings if that model exists
  let templates = [];
  try {
    const { default: ComplianceSetting } = await import("../models/ComplianceSetting.model.js");
    templates = await ComplianceSetting.find({ financialYear }).lean();
  } catch (error) {
    console.error("Error fetching compliance templates:", error);
  }

  if (templates.length > 0) {
    // ⚠️ insertMany skips Mongoose casting — must explicitly cast to ObjectId
    const customerObjId = new mongoose.Types.ObjectId(customerId);
    const complianceDocs = templates.map((t) => ({
      customer: customerObjId,
      financialYear,
      name: t.name,
      expiryDate: t.expiryDate || undefined,
      status: "To Be Done"
    }));
    await CustomerCompliance.insertMany(complianceDocs);
  }

  return { financialYear };
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