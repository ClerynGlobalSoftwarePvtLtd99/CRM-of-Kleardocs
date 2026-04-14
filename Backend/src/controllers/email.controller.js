import { 
  sendTemplateEmail, 
  previewTemplateEmail, 
  getEmailHistory, 
  resendEmail 
} from "../services/email.service.js";
import { validateBrevoConfig, checkBrevoAccountStatus } from "../services/brevoEmail.service.js";
import { ApiResponse, ApiError } from "../utils/response.js";

/**
 * Send email using template
 * POST /api/v1/emails/send-template
 */
export const sendEmail = async (req, res) => {
  const {
    entityType,
    entityId,
    templateId,
    recipientEmails,
    attachmentType,
    attachmentRefId,
    customSubject,
    customHtml,
    replyTo,
    cc,
    bcc,
    tags,
    contextData
  } = req.body;

  // Validate required fields
  if (!entityType || !entityId || !templateId) {
    throw new ApiError(400, "Missing required fields: entityType, entityId, templateId");
  }

  // Validate entityType
  if (!["customer", "lead"].includes(entityType)) {
    throw new ApiError(400, "Invalid entityType. Must be 'customer' or 'lead'");
  }

  // Validate recipient emails if provided
  if (recipientEmails) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];
    const invalidEmails = emails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      throw new ApiError(400, `Invalid email format: ${invalidEmails.join(", ")}`);
    }
  }

  const result = await sendTemplateEmail({
    entityType,
    entityId,
    templateId,
    recipientEmails,
    attachmentType,
    attachmentRefId,
    customSubject,
    customHtml,
    replyTo,
    cc: cc || [],
    bcc: bcc || [],
    tags: tags || [],
    contextData: contextData || {},
    userId: req.user.id
  });

  res.status(200).json(new ApiResponse(200, result.data, result.message));
};

/**
 * Preview email before sending
 * POST /api/v1/emails/preview
 */
export const previewEmail = async (req, res) => {
  const { entityType, entityId, templateId, contextData } = req.body;

  // Validate required fields
  if (!entityType || !entityId || !templateId) {
    throw new ApiError(400, "Missing required fields: entityType, entityId, templateId");
  }

  const result = await previewTemplateEmail({
    entityType,
    entityId,
    templateId,
    contextData: contextData || {}
  });

  res.status(200).json(new ApiResponse(200, result.data, "Email preview generated successfully"));
};

/**
 * Get email history for an entity
 * GET /api/v1/emails/history/:entityType/:entityId
 */
export const getHistory = async (req, res) => {
  const { entityType, entityId } = req.params;
  const { limit, skip, status } = req.query;

  if (!["customer", "lead"].includes(entityType)) {
    throw new ApiError(400, "Invalid entityType. Must be 'customer' or 'lead'");
  }

  const result = await getEmailHistory(entityType, entityId, {
    limit: parseInt(limit) || 50,
    skip: parseInt(skip) || 0,
    status
  });

  res.status(200).json(new ApiResponse(200, result, "Email history retrieved successfully"));
};

/**
 * Resend a previous email
 * POST /api/v1/emails/resend/:logId
 */
export const resendEmailController = async (req, res) => {
  const { logId } = req.params;

  const result = await resendEmail(logId, req.user.id);

  res.status(200).json(new ApiResponse(200, result.data, result.message));
};

/**
 * Check Brevo configuration status
 * GET /api/v1/emails/status
 */
export const getEmailStatus = async (req, res) => {
  const configValidation = validateBrevoConfig();
  const accountStatus = await checkBrevoAccountStatus();

  res.status(200).json(new ApiResponse(200, {
    config: configValidation,
    account: accountStatus,
    timestamp: new Date().toISOString()
  }, "Email service status retrieved"));
};

/**
 * Send email to customer (existing endpoint compatibility)
 * POST /api/v1/customers/:customerId/send-email
 */
export const sendCustomerEmailLegacy = async (req, res) => {
  const { customerId } = req.params;
  const { templateId, templateName, data, attachmentType, attachmentRefId } = req.body;

  if (!templateId && !templateName) {
    throw new ApiError(400, "Either templateId or templateName is required");
  }

  // Build context data from legacy format
  const contextData = {
    additionalData: {
      // Extract any extra data from the request
    }
  };

  if (attachmentType) {
    contextData.attachmentType = attachmentType;
  }
  if (attachmentRefId) {
    contextData.attachmentRefId = attachmentRefId;
  }

  const result = await sendTemplateEmail({
    entityType: "customer",
    entityId: customerId,
    templateId,
    customSubject: data?.subject,
    customHtml: data?.content,
    contextData,
    userId: req.user.id
  });

  res.status(200).json(new ApiResponse(200, result.data, result.message));
};

/**
 * Send email to lead (existing endpoint compatibility)
 * POST /api/v1/leads/:leadId/send-email-template
 */
export const sendLeadEmailLegacy = async (req, res) => {
  const { leadId } = req.params;
  const { templateId, templateName, data } = req.body;

  const result = await sendTemplateEmail({
    entityType: "lead",
    entityId: leadId,
    templateId,
    customSubject: data?.subject,
    customHtml: data?.content,
    userId: req.user.id
  });

  res.status(200).json(new ApiResponse(200, result.data, result.message));
};

export default {
  sendEmail,
  previewEmail,
  getHistory,
  resendEmail: resendEmailController,
  getEmailStatus,
  sendCustomerEmailLegacy,
  sendLeadEmailLegacy
};
