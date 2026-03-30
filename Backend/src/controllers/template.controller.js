import * as templateService from "../services/template.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";
import fs from "fs";
import path from "path";

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

export const uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, "Please upload a file");
    
    // Path to store in DB: /uploads/templates/filename
    const attachmentPath = `/uploads/templates/${req.file.filename}`;
    
    const template = await templateService.updateTemplate(req.params.id, {
      $push: { attachments: attachmentPath }
    });
    
    if (!template) throw new ApiError(404, "Template not found");
    
    res.status(200).json(new ApiResponse(200, template, "Attachment uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

export const removeAttachment = async (req, res, next) => {
  try {
    const { id, filename } = req.params;
    const attachmentPath = `/uploads/templates/${filename}`;
    
    // Remove from DB
    const template = await templateService.updateTemplate(id, {
      $pull: { attachments: attachmentPath }
    });
    
    if (!template) throw new ApiError(404, "Template not found");
    
    // Delete from local storage
    const fullPath = path.join(process.cwd(), "public", attachmentPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    
    res.status(200).json(new ApiResponse(200, template, "Attachment removed successfully"));
  } catch (error) {
    next(error);
  }
};