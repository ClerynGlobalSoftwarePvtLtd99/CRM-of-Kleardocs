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

  // Enum filters — service must be a valid ObjectId
  if (service && mongoose.Types.ObjectId.isValid(service)) {
    filter.service = new mongoose.Types.ObjectId(service);
  }
  if (agent && mongoose.Types.ObjectId.isValid(agent)) {
    filter.agent = new mongoose.Types.ObjectId(agent);
  }
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

  // Determine what changed for the history log
  const changes = [];
  
  if (data.name && data.name !== lead.name) changes.push(`name from '${lead.name}' to '${data.name}'`);
  if (data.phone && data.phone !== lead.phone) changes.push(`phone from '${lead.phone}' to '${data.phone}'`);
  if (data.companyName && data.companyName !== lead.companyName) changes.push(`company name from '${lead.companyName}' to '${data.companyName}'`);
  if (data.address && data.address !== lead.address) changes.push(`address from '${lead.address}' to '${data.address}'`);
  if (data.state && data.state !== lead.state) changes.push(`state from '${lead.state}' to '${data.state}'`);
  if (data.source && data.source !== lead.source) changes.push(`source from '${lead.source}' to '${data.source}'`);
  if (data.type && data.type !== lead.type) changes.push(`type from '${lead.type}' to '${data.type}'`);
  if (data.priority && data.priority !== lead.priority) changes.push(`priority from '${lead.priority}' to '${data.priority}'`);
  if (data.response && data.response !== lead.response) changes.push(`response from '${lead.response}' to '${data.response}'`);

  if (data.emails) {
      const oldArray = lead.emails || [];
      const newArray = Array.isArray(data.emails) ? data.emails : [data.emails];
      const added = newArray.filter(e => !oldArray.includes(e));
      const removed = oldArray.filter(e => !newArray.includes(e));

      if (added.length > 0 && removed.length > 0) {
        changes.push(`email from '${removed.join(", ")}' to '${added.join(", ")}'`);
      } else if (added.length > 0) {
        changes.push(`email from '${oldArray.join(", ") || "None"}' to '${added.join(", ")}'`);
      } else if (removed.length > 0) {
        changes.push(`email '${removed.join(", ")}' removed`);
      }
  }

  const updated = await Lead.findByIdAndUpdate(
    leadId,
    { ...data, service: data.serviceId || lead.service, agent: data.agentId || lead.agent },
    { new: true }
  ).populate("service", "name").populate("agent", "name email");

  const detailsMsg = changes.length > 0 
    ? `Lead details updated: ${changes.join(", ")}` 
    : `Lead details updated by user`;

  await LeadHistory.create({
    lead: leadId,
    type: "updated",
    details: detailsMsg,
    createdBy: userId
  });

  return updated;
};

// ─── DELETE LEAD ─────────────────────────────────────────────────────────────
export const deleteLead = async (leadId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");
  if (lead.isCustomer) throw new ApiError(400, "Cannot delete a lead that has been converted to a customer");

  await LeadHistory.deleteMany({ lead: leadId });
  await Lead.findByIdAndDelete(leadId);
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
  const formattedDate = followupDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  await LeadHistory.create({
    lead: leadId,
    type: "followup",
    details: data.details || `Follow-up scheduled`,
    phoneCalled: data.phoneCalled || false,
    notes: `Next followup scheduled for ${formattedDate}`,
    createdBy: userId
  });

  // Re-fetch the fully populated lead to return consistent shape to frontend
  const updatedLead = await Lead.findById(leadId)
    .populate("service", "name")
    .populate("agent", "name email");

  return updatedLead;
};

// ─── LOG INTERACTION ─────────────────────────────────────────────────────────
export const addInteraction = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const entry = await LeadHistory.create({
    lead: leadId,
    type: data.type || "interaction",
    details: data.details,
    phoneCalled: data.phoneCalled || false,
    createdBy: userId
  });

  // Return with populated createdBy
  return await LeadHistory.findById(entry._id).populate("createdBy", "name");
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
  if (!lead) throw new ApiError(404, "Lead not found");  const oldArray = lead.emails || [];
  const newArray = Array.isArray(emails) ? emails : [emails];
  const added = newArray.filter(e => !oldArray.includes(e));
  const removed = oldArray.filter(e => !newArray.includes(e));

  if (typeof emails === "string") {
    lead.emails = [emails];
  } else {
    lead.emails = emails;
  }
  await lead.save();

  let detailMsg = "Email addresses updated";
  if (added.length > 0 && removed.length > 0) {
    detailMsg = `Email addresses updated from '${removed.join(", ")}' to '${added.join(", ")}'`;
  } else if (added.length > 0) {
    detailMsg = `Email addresses updated from '${oldArray.join(", ") || "None"}' to '${added.join(", ")}'`;
  } else if (removed.length > 0) {
    detailMsg = `Email '${removed.join(", ")}' removed`;
  }

  // Add history entry for email update
  await LeadHistory.create({
    lead: leadId,
    type: "email_update",
    details: detailMsg,
    notes: `Current emails: ${newArray.join(", ")}`,
    createdBy: userId
  });

  return lead.emails;
};

// ─── ASSIGN AGENT ────────────────────────────────────────────────────────────
export const assignAgent = async (leadId, agentId, userId) => {
  const lead = await Lead.findById(leadId).populate("agent", "name");
  if (!lead) throw new ApiError(404, "Lead not found");

  const previousAgent = lead.agent?.name || "Unassigned";
  lead.agent = agentId;
  await lead.save();

  // Fetch the updated lead with populated agent
  const updatedLead = await Lead.findById(leadId)
    .populate("service", "name")
    .populate("agent", "name email");

  // Create history entry with the agent name
  await LeadHistory.create({
    lead: leadId,
    type: "assigned",
    details: `Agent changed from ${previousAgent} to ${updatedLead.agent?.name || "New Agent"}`,
    createdBy: userId
  });

  return updatedLead;
};

// ─── LOG EMAIL TEMPLATE ──────────────────────────────────────────────────────
export const logEmailTemplate = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const entry = await LeadHistory.create({
    lead: leadId,
    type: "interaction",
    details: `Email template sent: ${data.templateName}`,
    notes: data.details || "",
    createdBy: userId
  });

  return await LeadHistory.findById(entry._id).populate("createdBy", "name");
};

// ─── LOG WHATSAPP TEMPLATE ───────────────────────────────────────────────────
export const logWhatsappTemplate = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");

  const entry = await LeadHistory.create({
    lead: leadId,
    type: "interaction",
    details: `WhatsApp template sent: ${data.templateName}`,
    notes: data.details || "",
    createdBy: userId
  });

  return await LeadHistory.findById(entry._id).populate("createdBy", "name");
};

// ─── CONVERT LEAD TO CUSTOMER ─────────────────────────────────────────────────
export const convertToCustomer = async (leadId, data, userId) => {
  const lead = await Lead.findById(leadId);
  if (!lead) throw new ApiError(404, "Lead not found");
  if (lead.isCustomer) throw new ApiError(400, "This lead is already a customer");
  if (!lead.agent) throw new ApiError(400, "Lead must be assigned to an agent before converting to customer");

  // Lazy import to avoid circular dependencies
  const { default: Customer } = await import("../models/Customer.model.js");

  // Auto-generate a random 8-char password for the customer portal
  const generatedPassword = crypto.randomBytes(4).toString("hex");

  // Handle incorporation date for newly incorporated companies
  let incorporationDate = data.incorporationDate;
  if (data.newlyIncorporated && !incorporationDate) {
    incorporationDate = new Date();
  }

  const customer = await Customer.create({
    name: lead.name,
    phone: lead.phone,
    emails: lead.emails,
    companyName: data.companyName,
    address: data.address,
    state: data.state,
    gst: data.gst,
    type: data.type,
    incorporationDate: incorporationDate,
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

  // ─── Post-Conversion Setup ──────────────────────────────────────────────────
  // NOTE: No compliances are auto-seeded on conversion.
  // Admin must manually: Add Financial Year → then click "Assign Default Compliances"
  // The assignment logic (11 for newlyIncorporated, 8 for others) is handled in
  // cloneComplianceSettingsToCustomerYear() inside customer.service.js.

  return customer;
};