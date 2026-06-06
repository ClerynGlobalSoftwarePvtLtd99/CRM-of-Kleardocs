import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import EmailTemplate from "../models/EmailTemplate.model.js";
import EmailLog from "../models/EmailLog.model.js";
import Customer from "../models/Customer.model.js";
import Lead from "../models/Lead.model.js";
import Invoice from "../models/Invoice.model.js";
import { CustomerCompliance } from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";
import { 
  parseTemplate, 
  buildPlaceholderData, 
  validateTemplate,
  wrapWithBrandedTemplate 
} from "../utils/templateParser.js";
import { sendEmailViaBrevo } from "./brevoEmail.service.js";
import { buildAttachments, validateAttachmentSize } from "../utils/pdfGenerator.js";

/**
 * Comprehensive Email Service
 * Orchestrates template loading, parsing, sending via Brevo, and logging
 */

/**
 * Load entity data based on type and ID
 * @param {string} entityType - "customer" or "lead"
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} - Entity data with related records
 */
export const loadEntityData = async (entityType, entityId) => {
  let entity = null;
  let relatedData = {};

  if (entityType === "customer") {
    entity = await Customer.findById(entityId)
      .populate("saleBy", "name email")
      .lean();

    if (!entity) {
      throw new ApiError(404, "Customer not found");
    }

    // Load related data
    const [directors, services, compliances, invoices] = await Promise.all([
      // Directors
      mongoose.model("Director").find({ customer: entityId }).lean(),
      // Services
      mongoose.model("CustomerService")
        .find({ customer: entityId })
        .populate("service", "name hsn")
        .lean(),
      // Compliances
      CustomerCompliance.find({ customer: entityId }).lean(),
      // Recent invoices
      Invoice.find({ customer: entityId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    relatedData = { directors, services, compliances, invoices };

  } else if (entityType === "lead") {
    entity = await Lead.findById(entityId)
      .populate("agent", "name email")
      .lean();

    if (!entity) {
      throw new ApiError(404, "Lead not found");
    }

  } else {
    throw new ApiError(400, "Invalid entity type. Must be 'customer' or 'lead'");
  }

  return { entity, relatedData };
};

/**
 * Load email template by ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} - Template document
 */
export const loadTemplate = async (templateId) => {
  const template = await EmailTemplate.findById(templateId);
  
  if (!template) {
    throw new ApiError(404, "Email template not found");
  }

  if (template.status === "Inactive") {
    throw new ApiError(400, "Template is inactive and cannot be used");
  }

  return template;
};

/**
 * Send email using template with Brevo
 * @param {Object} options - Send options
 * @param {string} options.entityType - "customer" or "lead"
 * @param {string} options.entityId - Entity ID
 * @param {string} options.templateId - Template ID
 * @param {string[]} options.recipientEmails - Override recipient emails (optional)
 * @param {string} options.attachmentType - Dynamic attachment type (optional)
 * @param {string} options.attachmentRefId - Reference ID for dynamic attachment
 * @param {string} options.customSubject - Override subject (optional)
 * @param {string} options.customHtml - Override HTML content (optional)
 * @param {string} options.replyTo - Reply-to email (optional)
 * @param {string[]} options.cc - CC recipients (optional)
 * @param {string[]} options.bcc - BCC recipients (optional)
 * @param {string[]} options.tags - Email tags (optional)
 * @param {Object} options.contextData - Additional context data for placeholders
 * @param {string} options.userId - ID of user sending the email
 * @returns {Promise<Object>} - Send result with messageId and logId
 */
export const sendTemplateEmail = async ({
  entityType,
  entityId,
  templateId,
  recipientEmails = null,
  attachmentType = null,
  attachmentRefId = null,
  customSubject = null,
  customHtml = null,
  replyTo = null,
  cc = [],
  bcc = [],
  tags = [],
  contextData = {},
  userId
}) => {
  let parsedSubject = null; // Declare outside try for catch access
  let parsedBody = null;
  let template = null;

  try {
    // Step 1: Load entity data
    const { entity, relatedData } = await loadEntityData(entityType, entityId);

    // Step 2: Load template
    template = await loadTemplate(templateId);

    // Step 3: Determine recipients
    const toEmails = recipientEmails || entity.emails || [];
    if (!toEmails || toEmails.length === 0) {
      throw new ApiError(400, "No recipient email addresses found");
    }

    // Step 4: Build placeholder data
    let placeholderData = buildPlaceholderData({
      customer: entityType === "customer" ? entity : null,
      lead: entityType === "lead" ? entity : null,
      settings: null // Can be loaded from SystemSettings if needed
    });

    // Add invoice data if invoice context provided, or fall back to the most recent invoice
    if (contextData.invoiceId) {
      const invoice = await Invoice.findById(contextData.invoiceId).lean();
      if (invoice) {
        Object.assign(placeholderData, buildPlaceholderData({ invoice }));
      }
    } else if (relatedData.invoices && relatedData.invoices.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ invoice: relatedData.invoices[0] }));
    }

    // Add compliance data if compliance context provided, or fall back to the most recent compliance
    if (contextData.complianceId) {
      const compliance = await CustomerCompliance.findById(contextData.complianceId).lean();
      if (compliance) {
        Object.assign(placeholderData, buildPlaceholderData({ compliance }));
      }
    } else if (relatedData.compliances && relatedData.compliances.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ compliance: relatedData.compliances[0] }));
    }

    // Add service data if service context provided, or fall back to the first service
    if (contextData.serviceId && relatedData.services) {
      const service = relatedData.services.find(s => 
        s._id.toString() === contextData.serviceId || 
        s.service?._id?.toString() === contextData.serviceId
      );
      if (service) {
        Object.assign(placeholderData, buildPlaceholderData({ service }));
      }
    } else if (relatedData.services && relatedData.services.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ service: relatedData.services[0] }));
    }

    // Add director data if director context provided, or fall back to the first director
    if (contextData.directorId && relatedData.directors) {
      const director = relatedData.directors.find(d => d._id.toString() === contextData.directorId);
      if (director) {
        Object.assign(placeholderData, buildPlaceholderData({ director }));
      }
    } else if (relatedData.directors && relatedData.directors.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ director: relatedData.directors[0] }));
    }

    // Merge with additional context data
    Object.assign(placeholderData, contextData.additionalData || {});

    // Step 5: Parse template with data
    const rawSubject = customSubject || template.subject;
    const rawBody = customHtml || template.body || template.content || template.html || "";

    parsedSubject = parseTemplate(rawSubject, placeholderData);
    parsedBody = parseTemplate(rawBody, placeholderData);

    // Step 6: Validate template parsing
    const validation = validateTemplate({
      subject: rawSubject,
      body: rawBody,
      data: placeholderData
    });

    // Template validation warnings are silent in production

    // Step 7: Wrap with branded template - use absolute backend URL for public logo
    const logoUrl = "https://crm-of-kleardocs-backend.onrender.com/logo.png";
    
    const hasInlineLogo = parsedBody.toLowerCase().includes("logo.png") || 
                          parsedBody.toLowerCase().includes("logo.svg") || 
                          parsedBody.toLowerCase().includes("logo.jpeg") ||
                          parsedBody.toLowerCase().includes("logo.jpg");

    const brandedHtml = wrapWithBrandedTemplate(parsedBody, {
      companyName: "Kleardocs Solutions Private Limited",
      logoUrl: logoUrl,
      primaryColor: "#03479f",
      noHeader: hasInlineLogo
    });

    // Step 8: Build attachments
    let attachments = [];
    if (template.attachments?.length > 0 || attachmentType) {
      attachments = await buildAttachments({
        templateAttachments: template.attachments || [],
        attachmentType,
        attachmentRefId,
        context: {
          baseUrl: process.env.BACKEND_URL || "http://localhost:5000",
          authToken: contextData.authToken,
          customerId: entityType === "customer" ? entityId : null,
          invoiceId: contextData.invoiceId,
          reportType: attachmentType === "report" ? contextData.reportType : attachmentType
        }
      });

      // Validate attachment size
      const sizeValidation = validateAttachmentSize(attachments);
      if (!sizeValidation.isValid) {
        // Remove oversized attachments but continue with email
        attachments = attachments.filter(att => {
          const binarySize = att.content ? (att.content.length * 0.75) : 0;
          return binarySize <= 5 * 1024 * 1024; // 5MB per file
        });
      }
    }

    // Step 9: Send via Brevo
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "Kleardocs Solutions";

    const brevoResult = await sendEmailViaBrevo({
      toArray: Array.isArray(toEmails) ? toEmails : [toEmails],
      subject: parsedSubject,
      htmlContent: brandedHtml,
      textContent: parsedBody.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      senderEmail,
      senderName,
      replyTo: replyTo || senderEmail,
      cc,
      bcc,
      attachments: attachments.map(att => ({
        name: att.name,
        content: att.content
      })),
      tags: [...tags, entityType, template.name?.replace(/\s+/g, "-") || "template"]
    });

    // Step 10: Log email to database
    const emailLog = await EmailLog.create({
      entityType,
      [entityType]: entityId, // dynamic key: customer or lead
      template: templateId,
      templateName: template.name,
      subject: parsedSubject,
      htmlContent: brandedHtml,
      textContent: parsedBody.replace(/<[^>]*>/g, ""),
      to: Array.isArray(toEmails) ? toEmails : [toEmails],
      cc,
      bcc,
      replyTo: replyTo || senderEmail,
      senderName,
      senderEmail,
      brevoMessageId: brevoResult.messageId,
      status: "sent",
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        size: att.size
      })),
      attachmentNames: attachments.map(att => att.name),
      sentAt: new Date(),
      sentBy: userId,
      tags: [...tags, entityType],
      metadata: {
        templateStatus: validation.isValid ? "complete" : "partial",
        undefinedPlaceholders: validation.missing?.map(m => m.key).join(",") || ""
      }
    });

    // Step 11: Return success response
    return {
      success: true,
      message: "Email sent successfully",
      data: {
        messageId: brevoResult.messageId,
        logId: emailLog._id.toString(),
        recipientCount: Array.isArray(toEmails) ? toEmails.length : 1,
        templateName: template.name,
        subject: parsedSubject,
        hasAttachments: attachments.length > 0,
        attachmentNames: attachments.map(att => att.name),
        brevoResponse: brevoResult.brevoResponse
      }
    };

  } catch (error) {
    console.error("[EMAIL_SERVICE_ERROR]", error);
    
    // Log failed email attempt if we have enough data
    if (entityId && templateId) {
      try {
        await EmailLog.create({
          entityType,
          [entityType]: entityId,
          template: templateId,
          templateName: template?.name,
          subject: parsedSubject || customSubject || "[Failed before parsing]",
          status: "failed",
          errorMessage: error.message,
          errorCode: error.statusCode?.toString() || "UNKNOWN",
          sentAt: new Date(),
          sentBy: userId
        });
      } catch (logError) {
        console.error("[EMAIL_LOG_ERROR] Failed to log email failure:", logError);
      }
    }

    // Re-throw original error
    throw error;
  }
};

/**
 * Preview email template (without sending)
 * @param {Object} options - Preview options
 * @param {string} options.entityType - "customer" or "lead"
 * @param {string} options.entityId - Entity ID
 * @param {string} options.templateId - Template ID
 * @param {Object} options.contextData - Additional context data
 * @returns {Promise<Object>} - Preview data with rendered content
 */
export const previewTemplateEmail = async ({
  entityType,
  entityId,
  templateId,
  contextData = {}
}) => {
  try {
    // Load entity
    const { entity, relatedData } = await loadEntityData(entityType, entityId);

    // Load template
    const template = await loadTemplate(templateId);

    // Build placeholder data (same as send function)
    let placeholderData = buildPlaceholderData({
      customer: entityType === "customer" ? entity : null,
      lead: entityType === "lead" ? entity : null
    });

    // Add invoice data if invoice context provided, or fall back to the most recent invoice
    if (contextData.invoiceId) {
      const invoice = await Invoice.findById(contextData.invoiceId).lean();
      if (invoice) {
        Object.assign(placeholderData, buildPlaceholderData({ invoice }));
      }
    } else if (relatedData.invoices && relatedData.invoices.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ invoice: relatedData.invoices[0] }));
    }

    // Add compliance data if compliance context provided, or fall back to the most recent compliance
    if (contextData.complianceId) {
      const compliance = await CustomerCompliance.findById(contextData.complianceId).lean();
      if (compliance) {
        Object.assign(placeholderData, buildPlaceholderData({ compliance }));
      }
    } else if (relatedData.compliances && relatedData.compliances.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ compliance: relatedData.compliances[0] }));
    }

    // Add service data if service context provided, or fall back to the first service
    if (contextData.serviceId && relatedData.services) {
      const service = relatedData.services.find(s => 
        s._id.toString() === contextData.serviceId || 
        s.service?._id?.toString() === contextData.serviceId
      );
      if (service) {
        Object.assign(placeholderData, buildPlaceholderData({ service }));
      }
    } else if (relatedData.services && relatedData.services.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ service: relatedData.services[0] }));
    }

    // Add director data if director context provided, or fall back to the first director
    if (contextData.directorId && relatedData.directors) {
      const director = relatedData.directors.find(d => d._id.toString() === contextData.directorId);
      if (director) {
        Object.assign(placeholderData, buildPlaceholderData({ director }));
      }
    } else if (relatedData.directors && relatedData.directors.length > 0) {
      Object.assign(placeholderData, buildPlaceholderData({ director: relatedData.directors[0] }));
    }

    // Parse template
    const parsedSubject = parseTemplate(template.subject, placeholderData);
    const parsedBody = parseTemplate(template.body, placeholderData);

    // Validate
    const validation = validateTemplate({
      subject: template.subject,
      body: template.body,
      data: placeholderData
    });

    // Build preview
    const logoUrl = "https://crm-of-kleardocs-backend.onrender.com/logo.png";
    
    const hasInlineLogo = parsedBody.toLowerCase().includes("logo.png") || 
                          parsedBody.toLowerCase().includes("logo.svg") || 
                          parsedBody.toLowerCase().includes("logo.jpeg") ||
                          parsedBody.toLowerCase().includes("logo.jpg");

    const brandedHtml = wrapWithBrandedTemplate(parsedBody, {
      companyName: "Kleardocs Solutions Private Limited",
      logoUrl: logoUrl,
      primaryColor: "#03479f",
      noHeader: hasInlineLogo
    });

    return {
      success: true,
      data: {
        templateName: template.name,
        subject: parsedSubject,
        htmlBody: brandedHtml,
        rawBody: parsedBody,
        recipients: entity.emails || [],
        validation: {
          isValid: validation.isValid,
          missingPlaceholders: validation.missing?.map(m => ({
            placeholder: m.placeholder,
            description: m.definition?.description || "No description"
          })) || [],
          definedPlaceholders: validation.defined?.map(d => ({
            placeholder: d.placeholder,
            value: d.value
          })) || []
        },
        attachments: template.attachments || [],
        hasAttachments: (template.attachments?.length || 0) > 0
      }
    };

  } catch (error) {
    console.error("[EMAIL_PREVIEW_ERROR]", error);
    throw error;
  }
};

/**
 * Get email history for an entity
 * @param {string} entityType - "customer" or "lead"
 * @param {string} entityId - Entity ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Array of email logs
 */
export const getEmailHistory = async (entityType, entityId, options = {}) => {
  const { limit = 50, skip = 0, status } = options;

  const query = {
    entityType,
    [entityType]: entityId
  };

  if (status) {
    query.status = status;
  }

  const emails = await EmailLog.find(query)
    .populate("template", "name")
    .populate("sentBy", "name email")
    .sort({ sentAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await EmailLog.countDocuments(query);

  return {
    emails,
    pagination: {
      total,
      skip,
      limit,
      hasMore: skip + emails.length < total
    }
  };
};

/**
 * Resend a previously sent email
 * @param {string} logId - EmailLog ID to resend
 * @param {string} userId - User ID performing the resend
 * @returns {Promise<Object>} - Resend result
 */
export const resendEmail = async (logId, userId) => {
  const originalLog = await EmailLog.findById(logId);
  
  if (!originalLog) {
    throw new ApiError(404, "Email log not found");
  }

  if (originalLog.status === "pending") {
    throw new ApiError(400, "Cannot resend pending email");
  }

  // Send using stored data
  const brevoResult = await sendEmailViaBrevo({
    toArray: originalLog.to,
    subject: originalLog.subject,
    htmlContent: originalLog.htmlContent,
    textContent: originalLog.textContent,
    senderEmail: originalLog.senderEmail,
    senderName: originalLog.senderName,
    replyTo: originalLog.replyTo,
    cc: originalLog.cc,
    bcc: originalLog.bcc,
    tags: [...(originalLog.tags || []), "resend"]
  });

  // Create new log entry
  const newLog = await EmailLog.create({
    entityType: originalLog.entityType,
    [originalLog.entityType]: originalLog[originalLog.entityType],
    template: originalLog.template,
    templateName: originalLog.templateName,
    subject: originalLog.subject,
    htmlContent: originalLog.htmlContent,
    textContent: originalLog.textContent,
    to: originalLog.to,
    cc: originalLog.cc,
    bcc: originalLog.bcc,
    replyTo: originalLog.replyTo,
    senderName: originalLog.senderName,
    senderEmail: originalLog.senderEmail,
    brevoMessageId: brevoResult.messageId,
    status: "sent",
    attachments: originalLog.attachments,
    attachmentNames: originalLog.attachmentNames,
    sentAt: new Date(),
    sentBy: userId,
    tags: [...(originalLog.tags || []), "resend"],
    metadata: {
      originalLogId: logId.toString(),
      isResend: "true"
    }
  });

  return {
    success: true,
    message: "Email resent successfully",
    data: {
      messageId: brevoResult.messageId,
      logId: newLog._id.toString(),
      originalLogId: logId.toString()
    }
  };
};

export default {
  sendTemplateEmail,
  previewTemplateEmail,
  getEmailHistory,
  resendEmail,
  loadEntityData,
  loadTemplate
};
