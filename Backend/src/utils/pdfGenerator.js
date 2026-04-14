import axios from "axios";
import fs from "fs";
import path from "path";

/**
 * PDF Generation Utility
 * Handles PDF generation and conversion to base64 for Brevo attachments
 */

/**
 * Convert file to base64
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} - Base64 encoded content
 */
export const fileToBase64 = async (filePath) => {
  try {
    const resolvedPath = path.resolve(filePath);
    
    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    
    const fileBuffer = await fs.promises.readFile(resolvedPath);
    return fileBuffer.toString("base64");
  } catch (error) {
    console.error("[FILE_TO_BASE64_ERROR]", error);
    throw error;
  }
};

/**
 * Convert buffer to base64
 * @param {Buffer} buffer - File buffer
 * @returns {string} - Base64 encoded content
 */
export const bufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

/**
 * Generate invoice PDF from backend endpoint
 * @param {string} invoiceId - Invoice ID
 * @param {string} baseUrl - Backend base URL
 * @param {string} authToken - Authorization token
 * @returns {Promise<{name: string, content: string, type: string}>} - Attachment object
 */
export const generateInvoicePDF = async (invoiceId, baseUrl, authToken) => {
  try {
    const response = await axios.get(`${baseUrl}/api/v1/invoices/${invoiceId}/pdf`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      timeout: 30000
    });

    const buffer = Buffer.from(response.data, "binary");
    const base64Content = bufferToBase64(buffer);

    return {
      name: `invoice_${invoiceId}.pdf`,
      content: base64Content,
      type: "application/pdf",
      size: buffer.length
    };
  } catch (error) {
    console.error("[INVOICE_PDF_GENERATION_ERROR]", error);
    throw new Error(`Failed to generate invoice PDF: ${error.message}`);
  }
};

/**
 * Generate customer report PDF (Director Report, Board Resolution, etc.)
 * @param {string} customerId - Customer ID
 * @param {string} reportType - Type of report (director-report, board-resolution, consent-letter, auditors-report)
 * @param {Object} params - Query parameters for the report
 * @param {string} baseUrl - Backend base URL
 * @param {string} authToken - Authorization token
 * @returns {Promise<{name: string, content: string, type: string}>} - Attachment object
 */
export const generateCustomerReportPDF = async (customerId, reportType, params = {}, baseUrl, authToken) => {
  try {
    const endpointMap = {
      "director-report": "director-report",
      "board-resolution": "board-resolution",
      "consent-letter": "consent-letter",
      "auditors-report": "auditors-report"
    };

    const endpoint = endpointMap[reportType];
    if (!endpoint) {
      throw new Error(`Unknown report type: ${reportType}`);
    }

    const response = await axios.get(
      `${baseUrl}/api/v1/customers/${customerId}/${endpoint}`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        params,
        timeout: 30000
      }
    );

    const buffer = Buffer.from(response.data, "binary");
    const base64Content = bufferToBase64(buffer);

    const fileNameMap = {
      "director-report": `director_report_${customerId}.pdf`,
      "board-resolution": `board_resolution_${customerId}.pdf`,
      "consent-letter": `consent_letter_${customerId}.pdf`,
      "auditors-report": `auditors_report_${customerId}.pdf`
    };

    return {
      name: fileNameMap[reportType],
      content: base64Content,
      type: "application/pdf",
      size: buffer.length
    };
  } catch (error) {
    console.error("[REPORT_PDF_GENERATION_ERROR]", error);
    throw new Error(`Failed to generate ${reportType} PDF: ${error.message}`);
  }
};

/**
 * Get attachment from template attachments
 * @param {string} attachmentPath - Path to attachment (relative to public folder)
 * @returns {Promise<{name: string, content: string, type: string}>} - Attachment object
 */
export const getTemplateAttachment = async (attachmentPath) => {
  try {
    // Resolve path from project root
    const fullPath = path.join(process.cwd(), "public", attachmentPath);
    const base64Content = await fileToBase64(fullPath);
    
    // Determine mime type from extension
    const ext = path.extname(attachmentPath).toLowerCase();
    const mimeTypeMap = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".txt": "text/plain"
    };

    return {
      name: path.basename(attachmentPath),
      content: base64Content,
      type: mimeTypeMap[ext] || "application/octet-stream",
      size: base64Content.length * 0.75 // Approximate original size
    };
  } catch (error) {
    console.error("[TEMPLATE_ATTACHMENT_ERROR]", error);
    throw new Error(`Failed to load attachment ${attachmentPath}: ${error.message}`);
  }
};

/**
 * Build attachments array for Brevo email
 * @param {Object} options - Attachment options
 * @param {Array} options.templateAttachments - Template attachment paths
 * @param {string} options.attachmentType - Type of dynamic attachment (invoice, report, etc.)
 * @param {string} options.attachmentRefId - Reference ID for dynamic attachment
 * @param {Object} options.context - Context data for attachment generation
 * @returns {Promise<Array>} - Array of attachment objects for Brevo
 */
export const buildAttachments = async ({
  templateAttachments = [],
  attachmentType = null,
  attachmentRefId = null,
  context = {}
}) => {
  const attachments = [];

  // Add template attachments
  if (templateAttachments && templateAttachments.length > 0) {
    for (const attPath of templateAttachments) {
      try {
        const attachment = await getTemplateAttachment(attPath);
        attachments.push(attachment);
      } catch (error) {
        console.warn(`[ATTACHMENT_WARNING] Failed to load ${attPath}:`, error.message);
        // Continue with other attachments
      }
    }
  }

  // Add dynamic attachment if requested
  if (attachmentType && attachmentRefId) {
    const { baseUrl, authToken, customerId, invoiceId, reportType, params } = context;

    try {
      let dynamicAttachment = null;

      switch (attachmentType) {
        case "invoice":
          if (invoiceId) {
            dynamicAttachment = await generateInvoicePDF(invoiceId, baseUrl, authToken);
          }
          break;

        case "report":
        case "director-report":
        case "board-resolution":
        case "consent-letter":
        case "auditors-report":
          if (customerId && reportType) {
            dynamicAttachment = await generateCustomerReportPDF(
              customerId,
              reportType,
              params || {},
              baseUrl,
              authToken
            );
          }
          break;

        default:
          console.warn(`[ATTACHMENT_WARNING] Unknown attachment type: ${attachmentType}`);
      }

      if (dynamicAttachment) {
        attachments.push(dynamicAttachment);
      }
    } catch (error) {
      console.error(`[DYNAMIC_ATTACHMENT_ERROR] ${attachmentType}:`, error);
      // Don't throw - allow email to send without attachment if generation fails
    }
  }

  return attachments;
};

/**
 * Validate attachment size (Brevo limit is typically 20MB total)
 * @param {Array} attachments - Array of attachment objects
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Object} - Validation result
 */
export const validateAttachmentSize = (attachments, maxSizeMB = 20) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  let totalSize = 0;
  const issues = [];

  attachments.forEach((att, index) => {
    // Calculate size from base64 content (base64 is ~33% larger than binary)
    const binarySize = att.content ? (att.content.length * 0.75) : 0;
    totalSize += binarySize;

    // Individual file size check (5MB per file recommended)
    if (binarySize > 5 * 1024 * 1024) {
      issues.push(`Attachment ${index + 1} (${att.name}) exceeds 5MB`);
    }
  });

  if (totalSize > maxSizeBytes) {
    issues.push(`Total attachment size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds ${maxSizeMB}MB limit`);
  }

  return {
    isValid: issues.length === 0,
    totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    issues
  };
};

export default {
  fileToBase64,
  bufferToBase64,
  generateInvoicePDF,
  generateCustomerReportPDF,
  getTemplateAttachment,
  buildAttachments,
  validateAttachmentSize
};
