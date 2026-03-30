import EmailLog from "../models/EmailLog.model.js";
import { LeadHistory } from "../models/Lead.model.js";

/**
 * Universal Template Parser
 * Replaces placeholders like {{name}} with actual data
 */
export const parseTemplate = (content, data) => {
  if (!content) return "";
  let parsed = content;
  
  // Standard placeholders
  const placeholders = {
    "{{name}}": data.name || data.customerName || "",
    "{{companyName}}": data.companyName || "",
    "{{phone}}": data.phone || "",
    "{{address}}": data.address || "",
    "{{invoiceNo}}": data.invoiceNo || "",
    "{{total}}": data.total || "",
    "{{due}}": data.due || "",
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    parsed = parsed.replace(new RegExp(key, "g"), value);
  });

  return parsed;
};

/**
 * Log communication to History / EmailLog
 */
export const logCommunication = async ({ type, recipientId, recipientType, templateId, templateName, content, userId }) => {
  if (recipientType === "Lead") {
    await LeadHistory.create({
      lead: recipientId,
      type: "interaction",
      details: `${type} sent: ${templateName}`,
      notes: content.substring(0, 500), // Avoid massive logs
      createdBy: userId
    });
  } else {
    await EmailLog.create({
      customer: recipientId,
      template: templateId,
      templateName: templateName,
      date: new Date()
    });
  }
};

/**
 * Mock Send Email (Standardized for future provider integration)
 */
export const sendEmail = async ({ to, subject, html, customerId, leadId, templateId, templateName, userId }) => {
  console.log(`[MAILER] Sending email to ${to} with subject: ${subject}`);
  // In a real app, integrate Nodemailer here
  
  await logCommunication({
    type: "Email",
    recipientId: customerId || leadId,
    recipientType: customerId ? "Customer" : "Lead",
    templateId,
    templateName,
    content: html,
    userId
  });

  return true;
};

/**
 * Mock Send WhatsApp
 */
export const sendWhatsapp = async ({ phone, content, customerId, leadId, templateId, templateName, userId }) => {
  console.log(`[WHATSAPP] Sending message to ${phone}: ${content}`);
  
  await logCommunication({
    type: "WhatsApp",
    recipientId: customerId || leadId,
    recipientType: customerId ? "Customer" : "Lead",
    templateId,
    templateName,
    content,
    userId
  });

  return true;
};
