import Customer, {
  Director,
  CustomerService,
  CustomerCompliance
} from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";
import crypto from "crypto";
import mongoose from "mongoose";

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
export const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId)
    .populate("saleBy", "name")
    .lean();

  if (!customer) throw new ApiError(404, "Customer not found");

  const [directors, services, compliances] = await Promise.all([
    Director.find({ customer: customerId }).lean(),
    CustomerService.find({ customer: customerId })
      .populate("service", "name")
      .lean(),
    CustomerCompliance.find({ customer: customerId })
      .sort({ financialYear: -1, createdAt: 1 })
      .lean()
  ]);

  // Lazy-load Invoice & RecurringInvoice models if they exist
  let invoices = [];
  let recurringInvoices = [];
  try {
    const { default: Invoice } = await import("../models/Invoice.model.js");
    invoices = await Invoice.find({ customer: customerId })
      .select("invoiceNo invoiceDate linkedService price gst total due")
      .sort({ createdAt: -1 })
      .lean();
  } catch (_) {}
  try {
    const { default: RecurringInvoice } = await import("../models/RecurringInvoice.model.js");
    recurringInvoices = await RecurringInvoice.find({ customer: customerId })
      .select("startDate endDate linkedService interval intervalType nextDate status")
      .sort({ createdAt: -1 })
      .lean();
  } catch (_) {}

  return {
    ...customer,
    salesPerson: customer.saleBy?.name || null,
    directors,
    services: services.map((cs) => ({
      id: cs._id,
      name: cs.service?.name,
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
    recurringInvoices
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
  return customer;
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

// ─── ADD SERVICE TO CUSTOMER ─────────────────────────────────────────────────
export const addService = async (customerId, data) => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  const cs = await CustomerService.create({
    customer: customerId,
    service: data.serviceId,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    professionalFees: data.professionalFees || 0,
    govtFees: data.govtFees || 0,
    gst: data.gst ?? 18,
    recurring: data.recurring || false,
    interval: data.interval,
    intervalType: data.intervalType,
    status: "Active"
  });

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
    templates = await ComplianceSetting.find({ year: financialYear }).lean();
  } catch (_) {
    // ComplianceSetting model not yet built — start with empty set
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

  if (data.status) compliance.status = data.status;
  if (data.accountant !== undefined) compliance.accountant = data.accountant;
  if (data.completedOn) compliance.completedOn = new Date(data.completedOn);
  else if (data.status === "Done" && !compliance.completedOn) {
    compliance.completedOn = new Date();
  }

  await compliance.save();
  return compliance;
};