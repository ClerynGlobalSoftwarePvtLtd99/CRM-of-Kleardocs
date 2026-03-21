import Job from "../models/Job.model.js";

export const createJob = async (jobData) => {
  const newJob = await Job.create(jobData);
  return newJob;
};

export const getAllJobs = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.customer) query.customer = filters.customer;
  if (filters.accountant) query.accountant = filters.accountant;

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