import mongoose from "mongoose";
import Job from "../models/Job.model.js";

export const createJob = async (jobData) => {
  const newJob = await Job.create(jobData);
  return await Job.findById(newJob._id).populate("customer", "name companyName phone emails");
};

export const getAllJobs = async (filters = {}) => {
  const query = {};

  // Status and Accountant filters
  if (filters.status) query.status = filters.status;
  if (filters.accountant) query.accountant = filters.accountant;

  // Search filter (Customer name, companyName, phone)
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, "i");
    // Since customer is a reference, we need to handle this via population or aggregation.
    // However, Mongoose find() with populate doesn't easily filter by populated fields.
    // We'll use aggregation or first find the customers that match the search.
    const matchingCustomers = await mongoose.model("Customer").find({
      $or: [
        { name: searchRegex },
        { companyName: searchRegex },
        { phone: searchRegex }
      ]
    }).select("_id");
    
    query.customer = { $in: matchingCustomers.map(c => c._id) };
  }

  // Date range filters
  if (filters.startDate || filters.endDate) {
    const dateQuery = {};
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      dateQuery.$gte = start;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      dateQuery.$lte = end;
    }

    const dateField = filters.dateType === "Expiry Date" ? "expiryDate" 
                    : filters.dateType === "Completed On" ? "completedOn" 
                    : "createdAt";
    
    query[dateField] = dateQuery;
  }

  const jobs = await Job.find(query)
    .populate("customer", "name companyName phone emails")
    .sort({ createdAt: -1 });
  return jobs;
};

export const getJobById = async (jobId) => {
  const job = await Job.findById(jobId)
    .populate("customer", "name companyName phone emails");
  return job;
};

export const updateJob = async (jobId, updateData) => {
  if (updateData.status === "Done" && !updateData.completedOn) {
      updateData.completedOn = new Date();
  }
  
  const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true, runValidators: true })
    .populate("customer", "name companyName phone emails");
  return updatedJob;
};

export const deleteJob = async (jobId) => {
  await Job.findByIdAndDelete(jobId);
  return true;
};