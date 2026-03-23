import * as service from "../services/complianceSetting.service.js";
import { ApiResponse } from "../utils/response.js";

// ─── FINANCIAL YEARS ──────────────────────────────────────────────────────────

export const getFinancialYears = async (req, res) => {
  const data = await service.getFinancialYears();
  res.status(200).json(new ApiResponse(200, data, "Financial years fetched"));
};

export const createFinancialYear = async (req, res) => {
  const data = await service.createFinancialYear(req.body.financialYear || req.body.year);
  res.status(201).json(new ApiResponse(201, data, "Financial year created"));
};

export const updateFinancialYear = async (req, res) => {
  const data = await service.updateFinancialYear(req.params.yearId, req.body.financialYear || req.body.year);
  res.status(200).json(new ApiResponse(200, data, "Financial year updated"));
};

// ─── COMPLIANCE SETTINGS ──────────────────────────────────────────────────────

export const getComplianceSettings = async (req, res) => {
  const data = await service.getComplianceSettings(req.query.financialYear || req.query.year);
  res.status(200).json(new ApiResponse(200, data, "Compliance settings fetched"));
};

export const createComplianceSetting = async (req, res) => {
  const data = await service.createComplianceSetting(req.body);
  res.status(201).json(new ApiResponse(201, data, "Compliance setting created"));
};

export const updateComplianceSetting = async (req, res) => {
  const data = await service.updateComplianceSetting(req.params.complianceId, req.body);
  res.status(200).json(new ApiResponse(200, data, "Compliance setting updated"));
};

export const deleteComplianceSetting = async (req, res) => {
  await service.deleteComplianceSetting(req.params.complianceId);
  res.status(200).json(new ApiResponse(200, null, "Compliance setting deleted"));
};
