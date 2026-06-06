export const wrapWithBrandedTemplate = (htmlContent, options = {}) => {
  const {
    companyName = "Kleardocs Solutions Private Limited",
    logoUrl = null,
    primaryColor = "#03479f",
    noHeader = false,
  } = options;

  const currentYear = new Date().getFullYear();

  return `
<div style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; width: 100%;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          ${noHeader ? "" : `
          <!-- Header -->
          <tr>
            <td style="background-color: #0d0d0d; padding: 24px 20px 16px; text-align: center; border-radius: 8px 8px 0 0;">
              ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="height: 80px; width: auto; display: inline-block;" onerror="this.style.display='none'" />` : `<h2 style="color: #c8a951; margin: 0; font-size: 22px; letter-spacing: 2px;">${companyName}</h2>`}
            </td>
          </tr>
          <!-- Header accent bar -->
          <tr>
            <td style="background-color: ${primaryColor}; height: 4px;"></td>
          </tr>
          `}
          
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
</div>`;
};

/**
 * injectTemplateData
 * Replaces {{placeholder}} tags with actual data from the context.
 * 
 * @param {string} body - The HTML/text body of the email template.
 * @param {object} context - The data object containing fields for replacement.
 * @returns {string} - The processed body with injected data.
 */
export const injectTemplateData = (body, context = {}) => {
  if (!body) return '';
  
  // Define default mappings for placeholders
  // These should match the TEMPLATE_VARIABLES defined in AddTemplateModal.jsx
  const data = {
    name: context.name || context.customerName || 'N/A',
    companyName: context.companyName || 'N/A',
    address: context.address || 'N/A',
    username: context.username || 'N/A',
    password: context.password || 'N/A',
    invoiceNo: context.invoiceNo || 'N/A',
    invoiceDate: context.invoiceDate || 'N/A',
    invoiceAmount: context.invoiceAmount || 'N/A',
    complianceName: context.complianceName || 'N/A',
    complianceDoneDate: context.complianceDoneDate || 'N/A',
    complianceExpiryDate: context.complianceExpiryDate || 'N/A',
    ...context, // Allow overriding/additional fields
  };

  return body.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    return data[trimmedKey] !== undefined ? data[trimmedKey] : match;
  });
};

