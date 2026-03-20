import ComplianceSetting, { FinancialYear } from "../models/ComplianceSetting.model.js";
import { CustomerCompliance } from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";

// ─── FINANCIAL YEARS ──────────────────────────────────────────────────────────

export const getFinancialYears = async () => {
  return FinancialYear.find().sort({ year: -1 }).lean();
};

export const createFinancialYear = async (year) => {
  const existing = await FinancialYear.findOne({ year });
  if (existing) throw new ApiError(400, "Financial year already exists");
  return FinancialYear.create({ year });
};

export const updateFinancialYear = async (yearId, year) => {
  const fy = await FinancialYear.findById(yearId);
  if (!fy) throw new ApiError(404, "Financial year not found");
  fy.year = year;
  await fy.save();
  return fy;
};

// ─── COMPLIANCE SETTINGS ── ────────────────────────────────────────────────────

export const getComplianceSettings = async (year) => {
  const filter = {};
  if (year) filter.year = year;
  return ComplianceSetting.find(filter)
    .populate("expiryTemplate", "name")
    .populate("completeTemplate", "name")
    .sort({ createdAt: 1 })
    .lean();
};

export const createComplianceSetting = async (data) => {
  const setting = await ComplianceSetting.create({
    name: data.name,
    year: data.year,
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
  if (data.year !== undefined) setting.year = data.year;
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
