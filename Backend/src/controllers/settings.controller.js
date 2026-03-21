import * as settingsService from "../services/settings.service.js";
import { ApiResponse } from "../utils/response.js";

export const getEmailCount = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { total, data } = await settingsService.getEmailCountStats(startDate, endDate);
    
    // As per documentation format in Dashboard_API_Testing.md:
    // { status: true, total: 542, data: [{ date, count }] }
    res.status(200).json({ status: true, total, data });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await settingsService.getSystemSettings();
    res.status(200).json(new ApiResponse(200, data, "Settings retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const data = await settingsService.updateSystemSettings(req.body);
    res.status(200).json(new ApiResponse(200, data, "Settings updated successfully"));
  } catch (error) {
    next(error);
  }
};
