import axiosInstance from './axiosInstance';

// Get all leads
export const getAllLeads = async (params = {}) => {
  const response = await axiosInstance.get('/leads', { params });
  return response.data;
};

// Get single lead by ID
export const getLeadById = async (id) => {
  const response = await axiosInstance.get(`/leads/${id}`);
  return response.data;
};

// Create new lead
export const createLead = async (leadData) => {
  const response = await axiosInstance.post('/leads', leadData);
  return response.data;
};

// Update lead
export const updateLead = async (id, leadData) => {
  const response = await axiosInstance.put(`/leads/${id}`, leadData);
  return response.data;
};

// Delete lead
export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};

// Add followup to lead
export const addFollowup = async (id, followupData) => {
  const response = await axiosInstance.post(`/leads/${id}/followup`, followupData);
  return response.data;
};

// Add interaction to lead
export const addInteraction = async (id, interactionData) => {
  const response = await axiosInstance.post(`/leads/${id}/interaction`, interactionData);
  return response.data;
};

// Assign lead to agent
export const assignLead = async (id, assignData) => {
  const response = await axiosInstance.post(`/leads/${id}/assign`, assignData);
  return response.data;
};

// Convert lead to customer
export const convertLead = async (id, convertData) => {
  const response = await axiosInstance.post(`/leads/${id}/convert`, convertData);
  return response.data;
};

// Get lead emails
export const getLeadEmails = async (id) => {
  const response = await axiosInstance.get(`/leads/${id}/emails`);
  return response.data;
};

// Add email to lead
export const addLeadEmail = async (id, emailData) => {
  const response = await axiosInstance.post(`/leads/${id}/emails`, emailData);
  return response.data;
};

// Update lead emails
export const updateLeadEmails = async (id, emails) => {
  const response = await axiosInstance.put(`/leads/${id}/emails`, { emails });
  return response.data;
};

// Send email template to lead
export const sendEmailTemplate = async (id, templateData) => {
  const response = await axiosInstance.post(`/leads/${id}/send-email-template`, templateData);
  return response.data;
};

// Send WhatsApp template to lead
export const sendWhatsappTemplate = async (id, templateData) => {
  const response = await axiosInstance.post(`/leads/${id}/send-whatsapp-template`, templateData);
  return response.data;
};
