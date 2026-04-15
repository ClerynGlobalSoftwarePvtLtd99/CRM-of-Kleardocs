import axios from "axios";
import { ApiError } from "../utils/response.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send email using Brevo Transactional Email API
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email (single or comma-separated)
 * @param {string[]} params.toArray - Array of recipient emails
 * @param {string} params.subject - Email subject
 * @param {string} params.htmlContent - HTML content
 * @param {string} params.textContent - Plain text content (optional)
 * @param {string} params.senderName - Sender name
 * @param {string} params.senderEmail - Sender email
 * @param {string[]} params.cc - CC recipients
 * @param {string[]} params.bcc - BCC recipients
 * @param {string} params.replyTo - Reply-to email
 * @param {Array} params.attachments - Attachments array with name and base64 content
 * @param {string[]} params.tags - Tags for the email
 * @returns {Promise<Object>} - Brevo API response with messageId
 */
export const sendEmailViaBrevo = async ({
  to,
  toArray,
  subject,
  htmlContent,
  textContent,
  senderName,
  senderEmail,
  cc = [],
  bcc = [],
  replyTo,
  attachments = [],
  tags = []
}) => {
  try {
    // Validate required environment variables
    const apiKey = (process.env.BREVO_API_KEY || "").trim();
    if (!apiKey) {
      throw new ApiError(500, "BREVO_API_KEY is not configured");
    }

    // Validate key format
    if (!apiKey.startsWith('xkeysib-')) {
      console.error("[BREVO_DEBUG] WARNING: API key doesn't start with 'xkeysib-'. This may be an old v2 key or invalid key.");
    }

    // Validate sender
    const fromEmail = senderEmail || process.env.BREVO_SENDER_EMAIL;
    const fromName = senderName || process.env.BREVO_SENDER_NAME || "Kleardocs Solutions";
    
    if (!fromEmail) {
      throw new ApiError(500, "Sender email is not configured");
    }

    // Build recipients array
    let recipients = [];
    
    if (toArray && Array.isArray(toArray)) {
      recipients = toArray.map(email => ({ email: email.trim() }));
    } else if (to) {
      // Handle comma-separated emails
      recipients = to.split(",").map(email => ({ email: email.trim() }));
    }

    if (recipients.length === 0) {
      throw new ApiError(400, "At least one recipient email is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(r => !emailRegex.test(r.email));
    if (invalidEmails.length > 0) {
      throw new ApiError(400, `Invalid email format: ${invalidEmails.map(e => e.email).join(", ")}`);
    }

    // Build request body
    const requestBody = {
      sender: {
        name: fromName,
        email: fromEmail
      },
      to: recipients,
      subject: subject,
      htmlContent: htmlContent
    };

    // Add optional text content
    if (textContent) {
      requestBody.textContent = textContent;
    }

    // Add CC recipients
    if (cc && cc.length > 0) {
      requestBody.cc = cc.map(email => ({ email: email.trim() }));
    }

    // Add BCC recipients
    if (bcc && bcc.length > 0) {
      requestBody.bcc = bcc.map(email => ({ email: email.trim() }));
    }

    // Add reply-to
    if (replyTo) {
      requestBody.replyTo = {
        email: replyTo
      };
    }

    // Add attachments (base64 encoded)
    if (attachments && attachments.length > 0) {
      requestBody.attachment = attachments.map(att => ({
        name: att.name,
        content: att.content // Should be base64 encoded
      }));
    }

    // Add tags
    if (tags && tags.length > 0) {
      requestBody.tags = tags;
    }

    // Make API request to Brevo
    const response = await axios.post(BREVO_API_URL, requestBody, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: 30000 // 30 second timeout
    });

    // Return success response
    return {
      success: true,
      messageId: response.data.messageId,
      brevoResponse: response.data
    };

  } catch (error) {
    // Handle Brevo API errors
    if (error.response) {
      const brevoError = error.response.data;
      console.error("[BREVO API ERROR]", {
        status: error.response.status,
        message: brevoError.message || brevoError.code,
        details: brevoError
      });

      // Map common Brevo error codes
      const errorMessages = {
        400: "Invalid request format or missing required fields",
        401: "Invalid Brevo API key",
        403: "Sender domain not verified or sending limit exceeded",
        404: "Resource not found",
        429: "Rate limit exceeded. Please try again later",
        500: "Brevo server error. Please try again later"
      };

      throw new ApiError(
        error.response.status,
        brevoError.message || errorMessages[error.response.status] || "Failed to send email via Brevo"
      );
    }

    // Handle network/timeout errors
    if (error.code === "ECONNABORTED") {
      throw new ApiError(504, "Request timeout. Brevo API did not respond in time");
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new ApiError(503, "Cannot connect to Brevo API. Please check network connection");
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle unexpected errors
    console.error("[BREVO EMAIL ERROR]", error);
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
};

/**
 * Validate Brevo configuration
 * @returns {Object} - Validation result
 */
export const validateBrevoConfig = () => {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!process.env.BREVO_API_KEY) {
    result.isValid = false;
    result.errors.push("BREVO_API_KEY is not set in environment variables");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    result.warnings.push("BREVO_SENDER_EMAIL is not set. Will need to be provided per email.");
  }

  if (!process.env.BREVO_SENDER_NAME) {
    result.warnings.push("BREVO_SENDER_NAME is not set. Will use default 'Kleardocs Solutions'.");
  }

  return result;
};

/**
 * Check Brevo account status
 * @returns {Promise<Object>} - Account status
 */
export const checkBrevoAccountStatus = async () => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return {
        connected: false,
        error: "BREVO_API_KEY not configured"
      };
    }

    const response = await axios.get("https://api.brevo.com/v3/account", {
      headers: {
        "api-key": apiKey,
        "Accept": "application/json"
      }
    });

    return {
      connected: true,
      account: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.response?.data?.message || error.message
    };
  }
};
