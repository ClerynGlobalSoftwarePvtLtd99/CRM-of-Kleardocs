import * as dashboardService from "../services/dashboard.service.js";
import { ApiResponse } from "../utils/response.js";

export const getLeadsSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getLeadStats(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data, "Leads summary retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCustomersSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getCustomerStats(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data, "Customers summary retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSalesSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getSalesStats(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data, "Sales summary retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getComplianceJobsSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getComplianceJobStats(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data, "Compliance & Jobs summary retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getGraphsData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getGraphStats(startDate, endDate);
    res.status(200).json(new ApiResponse(200, data, "Graphs data retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getComparisonData = async (req, res, next) => {
  try {
    const { start1, end1, start2, end2 } = req.query;
    const data = await dashboardService.getComparisonStats(start1, end1, start2, end2);
    res.status(200).json(new ApiResponse(200, data, "Comparison data retrieved successfully"));
  } catch (error) {
    next(error);
  }
};