import * as complianceService from "../services/compliance.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";

export const getAllCompliances = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.financialYear) filters.financialYear = req.query.financialYear;

    const compliances = await complianceService.getAllCompliances(filters);
    res.status(200).json(new ApiResponse(200, compliances, "Compliances retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCompliance = async (req, res, next) => {
  try {
    const updatedCompliance = await complianceService.updateComplianceStatus(req.params.id, req.body);
    if (!updatedCompliance) {
      throw new ApiError(404, "Compliance record not found");
    }
    res.status(200).json(new ApiResponse(200, updatedCompliance, "Compliance updated successfully"));
  } catch (error) {
    next(error);
  }
};