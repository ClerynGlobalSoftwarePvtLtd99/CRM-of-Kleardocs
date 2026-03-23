import { CustomerCompliance } from "../models/Customer.model.js";

export const getAllCompliances = async (filters = {}) => {
  // Use filters like status, financialYear, etc.
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.financialYear) query.financialYear = filters.financialYear;
  
  const compliances = await CustomerCompliance.find(query)
    .populate("customer", "name companyName phone emails")
    .sort({ expiryDate: 1, createdAt: -1 });

  return compliances;
};

export const updateComplianceStatus = async (complianceId, updateData) => {
  const payload = {};
  if (updateData.status) payload.status = updateData.status;
  if (updateData.accountant) payload.accountant = updateData.accountant;
  if (updateData.completedOn) payload.completedOn = updateData.completedOn;

  if (payload.status === "Done" && !payload.completedOn) {
      payload.completedOn = new Date();
  }

  const updatedCompliance = await CustomerCompliance.findByIdAndUpdate(
    complianceId, 
    payload, 
    { new: true, runValidators: true }
  ).populate("customer", "name companyName");

  return updatedCompliance;
};