import * as jobService from "../services/job.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json(new ApiResponse(201, job, "Job created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.customer) filters.customer = req.query.customer;
    if (req.query.accountant) filters.accountant = req.query.accountant;
    
    // If agent/accountant, maybe filter by who is logged in? 
    // Usually admin sees all. Let's keep it global for now based on query params.

    const jobs = await jobService.getAllJobs(filters);
    res.status(200).json(new ApiResponse(200, jobs, "Jobs retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) throw new ApiError(404, "Job not found");
    res.status(200).json(new ApiResponse(200, job, "Job retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) throw new ApiError(404, "Job not found");
    res.status(200).json(new ApiResponse(200, job, "Job updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const success = await jobService.deleteJob(req.params.id);
    if (!success) throw new ApiError(404, "Job not found");
    res.status(200).json(new ApiResponse(200, null, "Job deleted successfully"));
  } catch (error) {
    next(error);
  }
};