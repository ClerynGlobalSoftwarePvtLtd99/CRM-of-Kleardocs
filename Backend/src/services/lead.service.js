import Lead, { LeadHistory } from "../models/Lead.model.js";
import { ApiError } from "../utils/response.js";
import mongoose from "mongoose";
import crypto from "crypto";

// ─── GET ALL LEADS (with filters + pagination) ───────────────────────────────
export const getLeads = async (query) => {
  const {
    search, dateType, startDate, endDate,
    service, agent, source, type, priority, response, state,
    page = 1, limit = 20
  } = query;

  const filter = {};

  // Text search across name, phone, companyName
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } }
    ];
  }

  // Date range filter
  if (startDate || endDate) {
    const dateField =
      dateType === "lastFollowup" ? "lastFollowup" :
      dateType === "nextFollowup" ? "nextFollowup" :
      "createdAt";

    filter[dateField] = {};
    if (startDate) filter[dateField].$gte = new Date(startDate);
    if (endDate) filter[dateField].$lte = new Date(endDate);
  }

  // Enum filters
  if (service) filter.service = new mongoose.Types.ObjectId(service);
  if (agent) filter.agent = new mongoose.Types.ObjectId(agent);
  if (source) filter.source = source;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (response) filter.response = response;
  if (state) filter.state = { $regex: state, $options: "i" };


  const skip = (Number(page) - 1) * Number(limit);

  const [leads, count] = await Promise.all([
    Lead.find(filter)
      .populate("service", "name")
      .populate("agent", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Lead.countDocuments(filter)
  ]);

  return { leads, count };
};

// ─── CREATE LEAD ─────────────────────────────────────────────────────────────
export const createLead = async (data, userId) => {
  const lead = await Lead.create({
    ...data,
    service: data.serviceId,
    agent: data.agentId,
    createdBy: userId
  });

  // Log creation
  await LeadHistory.create({
    lead: lead._id,
    type: "created",
    details: "Lead created",
    createdBy: userId
  });

  return lead;
};

// ─── GET SINGLE LEAD ─────────────────────────────────────────────────────────
export const getLeadById = async (leadId) => {
  const lead = await Lead.findById(leadId)
    .populate("service", "name")
    .populate("agent", "name email")
    .populate("createdBy", "name");

  if (!lead) throw new ApiError(404, "Lead not found");

  const history = await LeadHistory.find({ lead: leadId })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });

  return { ...lead.toObject(), history };
};

// ─── UPDATE LEAD ─────────────────────────────────────────────────────────────
export const updateLead = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const updated = await Lead.findByIdAndUpdate(
    leadId,
    { ...data, service: data.serviceId || lead.service, agent: data.agentId || lead.agent },
    { new: true }
  );

  await LeadHistory.create({
    lead: leadId,
    type: "updated",
    details: `Lead updated by user`,
    createdBy: userId
  });

  return updated;
};

// ─── LOG FOLLOW-UP ───────────────────────────────────────────────────────────
export const addFollowup = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const followupDate = new Date(data.followupDate);
  lead.nextFollowup = followupDate;
  lead.lastFollowup = new Date();
  await lead.save();

  // Format the date for display
  const formattedDate = followupDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  await LeadHistory.create({
    lead: leadId,
    type: "followup",
    details: data.details || `Follow-up scheduled`,
    phoneCalled: data.phoneCalled || false,
    notes: `Next followup scheduled for ${formattedDate}`,
    createdBy: userId
  });
};

// ─── LOG INTERACTION ─────────────────────────────────────────────────────────
export const addInteraction = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const entry = await LeadHistory.create({
    lead: leadId,
    type: "interaction",
    details: data.details,
    phoneCalled: data.phoneCalled || false,
    createdBy: userId
  });

  return entry;
};

// ─── GET LEAD EMAILS ────────────────────────────────────────────────────────────
export const getLeadEmails = async (leadId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");
  
  return lead.emails || [];
};

// ─── UPDATE EMAILS ────────────────────────────────────────────────────────────
export const updateEmails = async (leadId, emails, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  if (typeof emails === 'string') {
    lead.emails = [emails];
  } else {
    lead.emails = emails;
  }
  await lead.save();

  // Add history entry for email update
  await LeadHistory.create({
    lead: leadId,
    type: "email_update",
    details: `Email addresses updated`,
    notes: `Updated to: ${Array.isArray(emails) ? emails.join(', ') : emails}`,
    createdBy: userId
  });
};

// ─── ASSIGN AGENT ────────────────────────────────────────────────────────────
export const assignAgent = async (leadId, agentId, userId) => {
  const lead = await Lead.findById(leadId).populate("agent", "name");
  if (!lead) throw new ApiError(404, "Lead not found");

  const previousAgent = lead.agent?.name || "Unassigned";
  lead.agent = agentId;
  await lead.save();

  await LeadHistory.create({
    lead: leadId,
    type: "assigned",
    details: `Agent changed from ${previousAgent} to new agent`,
    createdBy: userId
  });
};

// ─── CONVERT LEAD TO CUSTOMER ─────────────────────────────────────────────────
export const convertToCustomer = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");
  if (lead.isCustomer) throw new ApiError(400, "This lead is already a customer");

  // Lazy import to avoid circular dependencies
  const { default: Customer } = await import("../models/Customer.model.js");

  // Auto-generate a random 8-char password for the customer portal
  const generatedPassword = crypto.randomBytes(4).toString("hex");

  const customer = await Customer.create({
    name: lead.name,
    phone: lead.phone,
    emails: lead.emails,
    companyName: data.companyName,
    address: data.address,
    state: data.state,
    gst: data.gst,
    type: data.type,
    incorporationDate: data.incorporationDate,
    newlyIncorporated: data.newlyIncorporated || false,
    username: data.username,
    password: generatedPassword,
    leadId: lead._id,
    saleBy: lead.agent
  });

  // Mark lead as converted
  lead.isCustomer = true;
  lead.customer = customer._id;
  lead.response = "Converted";
  await lead.save();

  await LeadHistory.create({
    lead: leadId,
    type: "converted",
    details: `Converted to Customer. Customer ID: ${customer._id}`,
    createdBy: userId
  });

  return customer;
};