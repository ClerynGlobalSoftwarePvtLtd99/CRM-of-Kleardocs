import * as leadService from "../services/lead.service.js";
import { ApiResponse } from "../utils/response.js";

// GET /api/v1/leads
export const getLeads = async (req, res) => {
  const { leads, count } = await leadService.getLeads(req.query);
  res.status(200).json(new ApiResponse(200, { count, leads }, "Leads fetched successfully"));
};

// POST /api/v1/leads
export const createLead = async (req, res) => {
  const lead = await leadService.createLead(req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));
};

// GET /api/v1/leads/:leadId
export const getLeadById = async (req, res) => {
  const lead = await leadService.getLeadById(req.params.leadId);
  res.status(200).json(new ApiResponse(200, lead, "Lead fetched successfully"));
};

// PUT /api/v1/leads/:leadId
export const updateLead = async (req, res) => {
  const lead = await leadService.updateLead(req.params.leadId, req.body, req.user.id);
  res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
};

// POST /api/v1/leads/:leadId/followup
export const addFollowup = async (req, res) => {
  const leadId = req.params.leadId;
  await leadService.addFollowup(leadId, req.body, req.user.id);
  
  // Return the followup data for Redux state management
  const followupData = {
    id: leadId,
    followup: {
      _id: Date.now().toString(),
      nextFollowup: req.body.followupDate,
      details: req.body.details,
      phoneCalled: req.body.phoneCalled || false,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    }
  };
  
  res.status(200).json(new ApiResponse(200, followupData, "Follow-up set successfully"));
};

// POST /api/v1/leads/:leadId/interaction
export const addInteraction = async (req, res) => {
  const entry = await leadService.addInteraction(req.params.leadId, req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, entry, "Interaction added successfully"));
};

// GET /api/v1/leads/:leadId/emails
export const getEmails = async (req, res) => {
  const emails = await leadService.getLeadEmails(req.params.leadId);
  res.status(200).json(new ApiResponse(200, emails, "Lead emails fetched successfully"));
};

// PUT /api/v1/leads/:leadId/emails
export const updateEmails = async (req, res) => {
  const leadId = req.params.leadId;
  await leadService.updateEmails(leadId, req.body.emails, req.user.id);
  
  // Return the email update data for Redux state management
  const emailData = {
    id: leadId,
    emails: req.body.emails
  };
  
  res.status(200).json(new ApiResponse(200, emailData, "Emails updated successfully"));
};

// PUT /api/v1/leads/:leadId/assign
export const assignAgent = async (req, res) => {
  await leadService.assignAgent(req.params.leadId, req.body.agentId, req.user.id);
  res.status(200).json(new ApiResponse(200, null, "Agent assigned successfully"));
};

// POST /api/v1/leads/:leadId/convert
export const convertToCustomer = async (req, res) => {
  const customer = await leadService.convertToCustomer(req.params.leadId, req.body, req.user.id);
  res.status(200).json(new ApiResponse(200, { customerId: customer._id }, "Lead converted to customer successfully"));
};