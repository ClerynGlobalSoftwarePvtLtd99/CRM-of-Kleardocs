/**
 * Template Parser Utility
 * Replaces placeholders like {{variable}} with actual data
 */

// Define all supported placeholders and their descriptions
export const PLACEHOLDER_DEFINITIONS = {
  // Customer/Lead placeholders
  "{{name}}": { description: "Customer/Lead name", category: "Customer" },
  "{{companyName}}": { description: "Company name", category: "Customer" },
  "{{address}}": { description: "Customer address", category: "Customer" },
  "{{phone}}": { description: "Phone number", category: "Customer" },
  "{{state}}": { description: "State", category: "Customer" },
  "{{gst}}": { description: "GST number", category: "Customer" },
  "{{type}}": { description: "Company type", category: "Customer" },
  "{{username}}": { description: "Portal username", category: "Customer" },
  "{{password}}": { description: "Portal password", category: "Customer" },
  "{{emails}}": { description: "All emails (comma separated)", category: "Customer" },
  "{{onboardingDate}}": { description: "Onboarding date", category: "Customer" },
  "{{incorporationDate}}": { description: "Incorporation date", category: "Customer" },

  // Invoice placeholders
  "{{invoiceNo}}": { description: "Invoice number", category: "Invoice" },
  "{{invoiceDate}}": { description: "Invoice date", category: "Invoice" },
  "{{invoiceAmount}}": { description: "Total invoice amount", category: "Invoice" },
  "{{subTotal}}": { description: "Invoice subtotal", category: "Invoice" },
  "{{totalGst}}": { description: "Total GST amount", category: "Invoice" },
  "{{paid}}": { description: "Amount paid", category: "Invoice" },
  "{{due}}": { description: "Amount due", category: "Invoice" },
  "{{placeOfSupply}}": { description: "Place of supply", category: "Invoice" },
  "{{invoiceDescription}}": { description: "Invoice description", category: "Invoice" },

  // Compliance placeholders
  "{{complianceName}}": { description: "Compliance name", category: "Compliance" },
  "{{complianceStatus}}": { description: "Compliance status", category: "Compliance" },
  "{{complianceDoneDate}}": { description: "Compliance completion date", category: "Compliance" },
  "{{complianceExpiryDate}}": { description: "Compliance expiry date", category: "Compliance" },
  "{{complianceFinancialYear}}": { description: "Financial year", category: "Compliance" },
  "{{complianceAccountant}}": { description: "Assigned accountant", category: "Compliance" },

  // Service placeholders
  "{{serviceName}}": { description: "Service name", category: "Service" },
  "{{serviceStatus}}": { description: "Service status", category: "Service" },
  "{{professionalFees}}": { description: "Professional fees", category: "Service" },
  "{{govtFees}}": { description: "Government fees", category: "Service" },
  "{{gstPercent}}": { description: "GST percentage", category: "Service" },

  // Director placeholders
  "{{directorName}}": { description: "Director name", category: "Director" },
  "{{directorPhone}}": { description: "Director phone", category: "Director" },
  "{{directorDin}}": { description: "Director DIN", category: "Director" },
  "{{directorDesignation}}": { description: "Director designation", category: "Director" },

  // System placeholders
  "{{currentDate}}": { description: "Current date", category: "System" },
  "{{currentYear}}": { description: "Current year", category: "System" },
  "{{companyLegalName}}": { description: "Your company legal name", category: "System" },
  "{{supportEmail}}": { description: "Support email", category: "System" },
  "{{supportPhone}}": { description: "Support phone", category: "System" }
};

/**
 * Extract all placeholders from a template string
 * @param {string} template - Template string with {{placeholders}}
 * @returns {string[]} - Array of unique placeholder strings
 */
export const extractPlaceholders = (template) => {
  if (!template || typeof template !== "string") return [];
  
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    matches.push(`{{${match[1]}}}`);
  }
  
  return [...new Set(matches)]; // Remove duplicates
};

/**
 * Build data object from CRM entities
 * @param {Object} options - Data sources
 * @param {Object} options.customer - Customer object
 * @param {Object} options.lead - Lead object
 * @param {Object} options.invoice - Invoice object
 * @param {Object} options.compliance - Compliance object
 * @param {Object} options.service - Service object
 * @param {Object} options.director - Director object
 * @returns {Object} - Data object with all placeholder values
 */
export const buildPlaceholderData = ({
  customer = null,
  lead = null,
  invoice = null,
  compliance = null,
  service = null,
  director = null,
  settings = null
}) => {
  const data = {};

  // Customer data
  if (customer) {
    data.name = customer.name || "";
    data.companyName = customer.companyName || customer.name || "";
    data.address = customer.address || "";
    data.phone = customer.phone || "";
    data.state = customer.state || "";
    data.gst = customer.gst || "";
    data.type = customer.type || "";
    data.username = customer.username || "";
    data.password = customer.password || "";
    data.emails = Array.isArray(customer.emails) ? customer.emails.join(", ") : "";
    data.onboardingDate = customer.onboardingDate 
      ? new Date(customer.onboardingDate).toLocaleDateString("en-GB")
      : "";
    data.incorporationDate = customer.incorporationDate
      ? new Date(customer.incorporationDate).toLocaleDateString("en-GB")
      : "";
  }

  // Lead data (if no customer provided)
  if (lead && !customer) {
    data.name = lead.name || "";
    data.companyName = lead.companyName || lead.name || "";
    data.address = lead.address || "";
    data.phone = lead.phone || "";
    data.state = lead.state || "";
    data.emails = Array.isArray(lead.emails) ? lead.emails.join(", ") : "";
  }

  // Invoice data
  if (invoice) {
    data.invoiceNo = invoice.invoiceNo || "";
    data.invoiceDate = invoice.invoiceDate
      ? new Date(invoice.invoiceDate).toLocaleDateString("en-GB")
      : "";
    data.invoiceAmount = invoice.total ? invoice.total.toFixed(2) : "0.00";
    data.subTotal = invoice.subTotal ? invoice.subTotal.toFixed(2) : "0.00";
    data.totalGst = invoice.totalGst ? invoice.totalGst.toFixed(2) : "0.00";
    data.paid = invoice.paid ? invoice.paid.toFixed(2) : "0.00";
    data.due = invoice.due ? invoice.due.toFixed(2) : "0.00";
    data.placeOfSupply = invoice.placeOfSupply || "";
    data.invoiceDescription = invoice.description || "";
    
    // Invoice items (first item details)
    if (invoice.items && invoice.items.length > 0) {
      const firstItem = invoice.items[0];
      data.serviceName = firstItem.description || "";
      data.professionalFees = firstItem.professionalFees ? firstItem.professionalFees.toFixed(2) : "0.00";
      data.govtFees = firstItem.govtFees ? firstItem.govtFees.toFixed(2) : "0.00";
      data.gstPercent = firstItem.gstPercent ? firstItem.gstPercent.toString() : "0";
    }
  }

  // Compliance data
  if (compliance) {
    data.complianceName = compliance.name || "";
    data.complianceStatus = compliance.status || "";
    data.complianceDoneDate = compliance.completedOn
      ? new Date(compliance.completedOn).toLocaleDateString("en-GB")
      : "";
    data.complianceExpiryDate = compliance.expiryDate
      ? new Date(compliance.expiryDate).toLocaleDateString("en-GB")
      : "";
    data.complianceFinancialYear = compliance.financialYear || "";
    data.complianceAccountant = compliance.accountant || "";
  }

  // Service data
  if (service) {
    data.serviceName = service.name || "";
    data.serviceStatus = service.status || "";
    
    // Handle populated service or customerService
    if (service.service) {
      const svc = service.service;
      data.professionalFees = svc.professionalFees ? svc.professionalFees.toFixed(2) : "0.00";
      data.govtFees = svc.govtFees ? svc.govtFees.toFixed(2) : "0.00";
      data.gstPercent = svc.gst ? svc.gst.toString() : "18";
    }
  }

  // Director data
  if (director) {
    data.directorName = director.name || "";
    data.directorPhone = director.phone || "";
    data.directorDin = director.din || "";
    data.directorDesignation = director.designation || "Director";
  }

  // System data
  const now = new Date();
  data.currentDate = now.toLocaleDateString("en-GB");
  data.currentYear = now.getFullYear().toString();
  
  // Settings data
  if (settings) {
    data.companyLegalName = settings.companyName || "Kleardocs Solutions Private Limited";
    data.supportEmail = settings.supportEmail || "support@kleardocs.com";
    data.supportPhone = settings.supportPhone || "";
  } else {
    data.companyLegalName = "Kleardocs Solutions Private Limited";
    data.supportEmail = "support@kleardocs.com";
    data.supportPhone = "";
  }

  return data;
};

/**
 * Parse template and replace placeholders with data
 * @param {string} template - Template string with {{placeholders}}
 * @param {Object} data - Data object with replacement values
 * @returns {string} - Parsed string with placeholders replaced
 */
export const parseTemplate = (template, data) => {
  if (!template || typeof template !== "string") return "";
  if (!data || typeof data !== "object") return template;

  let result = template;

  // Replace all known placeholders
  Object.keys(PLACEHOLDER_DEFINITIONS).forEach(placeholder => {
    const key = placeholder.replace(/\{\{|\}\}/g, ""); // Extract key from {{key}}
    const value = data[key];
    
    if (value !== undefined && value !== null) {
      // Create global regex for this placeholder
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      result = result.replace(regex, String(value));
    }
  });

  return result;
};

/**
 * Parse both subject and body templates
 * @param {Object} options - Parsing options
 * @param {string} options.subject - Subject template
 * @param {string} options.body - Body template
 * @param {Object} options.data - Data object for replacement
 * @returns {Object} - Parsed subject and body
 */
export const parseEmailTemplate = ({ subject, body, data }) => {
  return {
    subject: parseTemplate(subject, data),
    body: parseTemplate(body, data)
  };
};

/**
 * Get list of undefined placeholders in a template
 * @param {string} template - Template string
 * @param {Object} data - Data object
 * @returns {string[]} - Array of undefined placeholder keys
 */
export const getUndefinedPlaceholders = (template, data) => {
  const placeholders = extractPlaceholders(template);
  const undefined = [];

  placeholders.forEach(placeholder => {
    const key = placeholder.replace(/\{\{|\}\}/g, "");
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      undefined.push(key);
    }
  });

  return undefined;
};

/**
 * Validate template and check for missing data
 * @param {Object} options - Validation options
 * @param {string} options.subject - Subject template
 * @param {string} options.body - Body template
 * @param {Object} options.data - Data object
 * @returns {Object} - Validation result
 */
export const validateTemplate = ({ subject, body, data }) => {
  const subjectPlaceholders = extractPlaceholders(subject);
  const bodyPlaceholders = extractPlaceholders(body);
  const allPlaceholders = [...new Set([...subjectPlaceholders, ...bodyPlaceholders])];
  
  const missing = [];
  const defined = [];

  allPlaceholders.forEach(placeholder => {
    const key = placeholder.replace(/\{\{|\}\}/g, "");
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      missing.push({
        placeholder,
        key,
        definition: PLACEHOLDER_DEFINITIONS[placeholder]
      });
    } else {
      defined.push({
        placeholder,
        key,
        value: data[key]
      });
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    defined,
    totalPlaceholders: allPlaceholders.length
  };
};

/**
 * Wrap HTML body with branded email template
 * @param {string} htmlContent - Raw HTML content
 * @param {Object} options - Wrapper options
 * @returns {string} - Branded HTML email
 */
export const wrapWithBrandedTemplate = (htmlContent, options = {}) => {
  const {
    companyName = "Kleardocs Solutions Private Limited",
    logoUrl = null,
    logoBase64 = null,
    primaryColor = "#03479f",
    accentColor = "#ed6c02"
  } = options;
  
  // Use base64 logo if provided, otherwise fallback to URL
  const finalLogoUrl = logoBase64 || logoUrl;

  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email from ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0d0d0d; padding: 24px 20px 16px; text-align: center; border-radius: 8px 8px 0 0;">
              ${finalLogoUrl ? `<img src="${finalLogoUrl}" alt="${companyName}" style="height: 80px; width: auto; display: inline-block;" onerror="this.style.display='none'" />` : `<h2 style="color: #c8a951; margin: 0; font-size: 22px; letter-spacing: 2px;">${companyName}</h2>`}
            </td>
          </tr>
          <!-- Header accent bar -->
          <tr>
            <td style="background-color: ${primaryColor}; height: 4px;"></td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px; color: #333333; line-height: 1.6;">
              ${htmlContent}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="color: #666666; font-size: 13px; margin: 0;">
                &copy; ${currentYear} <strong>${companyName}</strong>. All rights reserved.
              </p>
              <p style="color: #999999; font-size: 12px; margin: 5px 0 0 0;">
                Compliance | Excellence | Integrity
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default {
  parseTemplate,
  parseEmailTemplate,
  extractPlaceholders,
  buildPlaceholderData,
  validateTemplate,
  getUndefinedPlaceholders,
  wrapWithBrandedTemplate,
  PLACEHOLDER_DEFINITIONS
};