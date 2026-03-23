import * as templateService from "../services/template.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";

export const createTemplate = async (req, res, next) => {
  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json(new ApiResponse(201, template, "Template created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllTemplates = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;

    const templates = await templateService.getAllTemplates(filters);
    res.status(200).json(new ApiResponse(200, templates, "Templates retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    if (!template) throw new ApiError(404, "Template not found");
    res.status(200).json(new ApiResponse(200, template, "Template retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const template = await templateService.updateTemplate(req.params.id, req.body);
    if (!template) throw new ApiError(404, "Template not found");
    res.status(200).json(new ApiResponse(200, template, "Template updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const success = await templateService.deleteTemplate(req.params.id);
    if (!success) throw new ApiError(404, "Template not found");
    res.status(200).json(new ApiResponse(200, null, "Template deleted successfully"));
  } catch (error) {
    next(error);
  }
};