import * as serviceService from "../services/service.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";
import { populateServiceTemplates } from "../scripts/populateServiceTemplates.js";

export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(new ApiResponse(201, service, "Service created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json(new ApiResponse(200, services, "Services retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");
    res.status(200).json(new ApiResponse(200, service, "Service retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    if (!service) throw new ApiError(404, "Service not found");
    res.status(200).json(new ApiResponse(200, service, "Service updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const success = await serviceService.deleteService(req.params.id);
    if (!success) throw new ApiError(404, "Service not found");
    res.status(200).json(new ApiResponse(200, null, "Service deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const populateTemplates = async (req, res, next) => {
  try {
    const success = await populateServiceTemplates();
    if (success) {
      res.status(200).json(new ApiResponse(200, null, "Service templates populated successfully"));
    } else {
      throw new ApiError(500, "Failed to populate service templates");
    }
  } catch (error) {
    next(error);
  }
};
