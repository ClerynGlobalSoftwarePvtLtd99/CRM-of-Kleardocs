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
