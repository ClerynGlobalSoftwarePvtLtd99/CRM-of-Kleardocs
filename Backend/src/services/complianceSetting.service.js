import ComplianceSetting, { FinancialYear } from "../models/ComplianceSetting.model.js";
import EmailTemplate from "../models/EmailTemplate.model.js";
import { CustomerCompliance } from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";

// ─── FINANCIAL YEARS ──────────────────────────────────────────────────────────

export const getFinancialYears = async () => {
  return FinancialYear.find().sort({ financialYear: -1 }).lean();
};

export const createFinancialYear = async (year) => {
  const existing = await FinancialYear.findOne({ financialYear: year });
  if (existing) throw new ApiError(400, "Financial year already exists");
  return FinancialYear.create({ financialYear: year });
};

export const updateFinancialYear = async (yearId, year) => {
  const fy = await FinancialYear.findById(yearId);
  if (!fy) throw new ApiError(404, "Financial year not found");
  fy.financialYear = year;
  await fy.save();
  return fy;
};

// ─── COMPLIANCE SETTINGS ── ────────────────────────────────────────────────────

export const getComplianceSettings = async (year) => {
  const filter = {};
  if (year) filter.financialYear = year;
  return ComplianceSetting.find(filter)
    .populate("expiryTemplate", "name")
    .populate("completeTemplate", "name")
    .sort({ createdAt: 1 })
    .lean();
};

export const createComplianceSetting = async (data) => {
  // Resolve templates if names are provided instead of IDs
  let expiryTemplateId = data.expiryTemplateId
  let completeTemplateId = data.completeTemplateId

  if (!expiryTemplateId && data.expiryTemplate && data.expiryTemplate !== 'None') {
    const t = await EmailTemplate.findOne({ name: data.expiryTemplate })
    if (t) expiryTemplateId = t._id
  }
  if (!completeTemplateId && data.completeTemplate && data.completeTemplate !== 'None') {
    const t = await EmailTemplate.findOne({ name: data.completeTemplate })
    if (t) completeTemplateId = t._id
  }

  const setting = await ComplianceSetting.create({
    name: data.name,
    financialYear: data.financialYear || data.year,
    hasExpiry: data.hasExpiry ?? false,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    forNewCompany: data.forNewCompany ?? false,
    inc20: data.inc20 ?? false,
    daysOfExpiry: data.daysOfExpiry ?? 30,
    expiryTemplate: expiryTemplateId || undefined,
    completeTemplate: completeTemplateId || undefined
  });
  
  return ComplianceSetting.findById(setting._id)
    .populate("expiryTemplate", "name")
    .populate("completeTemplate", "name")
    .lean();
};

export const updateComplianceSetting = async (complianceId, data) => {
  const setting = await ComplianceSetting.findById(complianceId);
  if (!setting) throw new ApiError(404, "Compliance setting not found");

  if (data.name !== undefined) setting.name = data.name;
  if (data.financialYear !== undefined || data.year !== undefined) {
    setting.financialYear = data.financialYear || data.year;
  }
  if (data.hasExpiry !== undefined) setting.hasExpiry = data.hasExpiry;
  if (data.expiryDate !== undefined) setting.expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
  if (data.forNewCompany !== undefined) setting.forNewCompany = data.forNewCompany;
  if (data.inc20 !== undefined) setting.inc20 = data.inc20;
  if (data.daysOfExpiry !== undefined) setting.daysOfExpiry = data.daysOfExpiry;

  // Resolve templates if names are provided
  if (data.expiryTemplateId !== undefined) {
    setting.expiryTemplate = data.expiryTemplateId || null;
  } else if (data.expiryTemplate !== undefined) {
    if (data.expiryTemplate === 'None') {
      setting.expiryTemplate = null;
    } else {
      const t = await EmailTemplate.findOne({ name: data.expiryTemplate });
      if (t) setting.expiryTemplate = t._id;
    }
  }

  if (data.completeTemplateId !== undefined) {
    setting.completeTemplate = data.completeTemplateId || null;
  } else if (data.completeTemplate !== undefined) {
    if (data.completeTemplate === 'None') {
      setting.completeTemplate = null;
    } else {
      const t = await EmailTemplate.findOne({ name: data.completeTemplate });
      if (t) setting.completeTemplate = t._id;
    }
  }

  await setting.save();
  return ComplianceSetting.findById(setting._id)
    .populate("expiryTemplate", "name")
    .populate("completeTemplate", "name")
    .lean();
};

export const deleteComplianceSetting = async (complianceId) => {
  const setting = await ComplianceSetting.findById(complianceId);
  if (!setting) throw new ApiError(404, "Compliance setting not found");
  await setting.deleteOne();
};
