import ComplianceSetting, { FinancialYear } from "../models/ComplianceSetting.model.js";
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
  const setting = await ComplianceSetting.create({
    name: data.name,
    financialYear: data.financialYear || data.year, // Support both during migration
    hasExpiry: data.hasExpiry ?? false,
    expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    isNew: data.isNew ?? false,
    inc20: data.inc20 ?? false,
    daysOfExpiry: data.daysOfExpiry ?? 30,
    expiryTemplate: data.expiryTemplateId || undefined,
    completeTemplate: data.completeTemplateId || undefined
  });
  return setting;
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
  if (data.isNew !== undefined) setting.isNew = data.isNew;
  if (data.inc20 !== undefined) setting.inc20 = data.inc20;
  if (data.daysOfExpiry !== undefined) setting.daysOfExpiry = data.daysOfExpiry;
  if (data.expiryTemplateId !== undefined) setting.expiryTemplate = data.expiryTemplateId || null;
  if (data.completeTemplateId !== undefined) setting.completeTemplate = data.completeTemplateId || null;

  await setting.save();
  return setting;
};

export const deleteComplianceSetting = async (complianceId) => {
  const setting = await ComplianceSetting.findById(complianceId);
  if (!setting) throw new ApiError(404, "Compliance setting not found");
  await setting.deleteOne();
};
