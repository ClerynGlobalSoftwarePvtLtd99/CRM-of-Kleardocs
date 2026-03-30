import PDFDocument from 'pdfkit';

/**
 * Helper to draw a table-like structure in PDFKit
 */
const drawTable = (doc, headers, rows, startY) => {
  let currentY = startY;
  const colWidths = [200, 150, 150];
  const padding = 5;

  // Header
  doc.font('Helvetica-Bold').fontSize(10);
  headers.forEach((h, i) => {
    doc.text(h, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY);
  });
  
  doc.moveTo(50, currentY + 15).lineTo(500, currentY + 15).stroke();
  currentY += 20;

  // Rows
  doc.font('Helvetica').fontSize(9);
  rows.forEach(row => {
    row.forEach((cell, i) => {
      doc.text(cell.toString(), 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY);
    });
    currentY += 15;
  });
  
  return currentY;
};

export const generateDirectorReport = (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // Header
  doc.fontSize(20).font('Helvetica-Bold').text("DIRECTOR'S REPORT", { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).font('Helvetica-Bold').text(`Company: ${customer.companyName || customer.name}`);
  doc.fontSize(10).font('Helvetica').text(`CIN: ${data.cin || 'N/A'}`);
  doc.text(`Place: ${data.place || 'Kolkata'}`);
  doc.text(`Date: ${data.reportDate || new Date().toLocaleDateString()}`);
  doc.moveDown();

  doc.text(`The Directors take pleasure in presenting the reports of the company for the financial year...`);
  doc.moveDown();

  // Financial Table (Simplified for now)
  const headers = ["Particulars", "Previous Year", "Current Year"];
  const rows = [
    ["Profit before Tax", data.profitTax1 || "0", data.profitTax2 || "0"],
    ["Profit after Tax", data.profitAfterTax1 || "0", data.profitAfterTax2 || "0"],
    ["Gross Revenue", data.grossProfit1 || "0", data.grossProfit2 || "0"]
  ];
  drawTable(doc, headers, rows, doc.y);

  doc.moveDown(2);
  doc.text("For and on behalf of the Board,");
  doc.moveDown(2);
  doc.text("__________________________", { align: 'left' });
  doc.text("Director", { align: 'left' });

  doc.end();
};

export const generateBoardResolution = (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(18).font('Helvetica-Bold').text("BOARD RESOLUTION", { align: 'center' });
  doc.moveDown();

  doc.fontSize(11).font('Helvetica-Bold').text("CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS");
  doc.moveDown();

  doc.fontSize(10).font('Helvetica').text(`Company Name: ${customer.companyName || customer.name}`);
  doc.text(`Date of Resolution: ${data.date || new Date().toLocaleDateString()}`);
  doc.text(`CIN: ${customer.cin || 'N/A'}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text("RESOLUTION:");
  doc.font('Helvetica').text(`"RESOLVED THAT the Company shall be authorized to operate and carry on its business activities as per the objects and provisions mentioned in the Memorandum of Association and Articles of Association of the Company."`);
  
  doc.moveDown(3);
  doc.text("For and on behalf of the Board,", { align: 'right' });
  doc.moveDown(2);
  doc.text("__________________________", { align: 'right' });
  doc.text("Director", { align: 'right' });

  doc.end();
};

export const generateConsentLetter = (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(16).font('Helvetica-Bold').text("CONSENT LETTER", { align: 'center' });
  doc.moveDown();

  doc.fontSize(10).font('Helvetica').text(`To,`);
  doc.text(`The Board of Directors,`);
  doc.text(`${customer.companyName || customer.name}`);
  doc.moveDown();

  doc.text(`Subject: Consent to act as Auditor`);
  doc.moveDown();

  doc.text(`Dear Sir/Madam,`);
  doc.text(`I/We hereby convey my/our consent to act as the Statutory Auditor of the company for the financial year ${data.financialYear || '2025-26'}...`);
  
  doc.moveDown(3);
  doc.text("Sincerely,", { align: 'right' });
  doc.text("Statutory Auditor", { align: 'right' });

  doc.end();
};

export const generateAuditorsReport = (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(16).font('Helvetica-Bold').text("INDEPENDENT AUDITOR'S REPORT", { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).font('Helvetica-Bold').text(`To the Members of ${customer.companyName || customer.name}`);
  doc.moveDown();

  doc.fontSize(10).font('Helvetica').text(`Report on the Audit of the Financial Statements...`);
  doc.text(`We have audited the accompanying financial statements of ${customer.companyName || customer.name} which comprise the Balance Sheet as at March 31, ${data.financialYear?.split('-')[1] || '2026'}...`);

  doc.moveDown(3);
  doc.text(`Auditor Name: ${data.auditorName || 'N/A'}`);
  doc.text(`UDIN: ${data.udin || 'N/A'}`);
  doc.text(`Date: ${data.date || new Date().toLocaleDateString()}`);

  doc.end();
};

const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToWords(num) {
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim().toUpperCase() + ' RUPEES ONLY';
}

export const generateInvoicePdf = (invoice, customer, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);

  // Logo box (Black)
  doc.rect(20, 20, 160, 90).fill('black');
  doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text('KLEARDOCS', 35, 55);
  
  // Reset for other text
  doc.fillColor('black');
  
  // Company Info (Top Right)
  doc.fontSize(14).font('Helvetica-Bold').text('Kleardocs Solutions', 300, 30, { align: 'right' });
  doc.fontSize(8).font('Helvetica').text('Phone: +91 98755 15290 | Email: info@kleardocs.com', 300, 50, { align: 'right' });
  doc.text('366, Amritalal Mukherjee Road, Kolkata, 700063', 300, 62, { align: 'right' });
  doc.text('CIN: U69200WB2025PTC278630 | PAN: AALCK7855M', 300, 74, { align: 'right' });

  doc.moveDown(4);
  doc.moveTo(20, 120).lineTo(570, 120).stroke();

  // Invoice Details & Bill To
  let y = 140;
  doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50, y);
  doc.fontSize(10).font('Helvetica-Bold').text('Invoice Details:', 350, y);
  
  y += 18;
  doc.font('Helvetica').fontSize(9);
  doc.text(customer.companyName || customer.name || 'N/A', 50, y, { fontStyle: 'bold' });
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 350, y);
  
  y += 12;
  doc.text(customer.address || 'N/A', 50, y, { width: 250 });
  doc.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}`, 350, y);
  
  y += 12;
  doc.text(`Phone: ${customer.phone || 'N/A'}`, 50, y);
  doc.text(`Place of Supply: ${invoice.placeOfSupply || 'N/A'}`, 350, y);

  // Table Container
  const tableTop = 230;
  doc.rect(20, tableTop, 550, 450).stroke(); // Main table border
  
  // Table Header
  doc.rect(20, tableTop, 550, 25).fill('#FCBF49'); // Yellow header color (approx)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(9);
  doc.text('#', 30, tableTop + 8);
  doc.text('Description', 60, tableTop + 8);
  doc.text('HSN/SAC', 320, tableTop + 8);
  doc.text('Price', 420, tableTop + 8, { align: 'right', width: 60 });
  doc.text('Amount', 500, tableTop + 8, { align: 'right', width: 60 });
  
  doc.moveTo(20, tableTop + 25).lineTo(570, tableTop + 25).stroke();
  
  // Rows
  let itemY = tableTop + 35;
  doc.font('Helvetica').fontSize(8);
  invoice.items.forEach((item, i) => {
    doc.text((i + 1).toString(), 30, itemY);
    doc.text(item.service?.name || item.description, 60, itemY, { width: 250 });
    doc.text(item.hsn || '998399', 320, itemY);
    doc.text(item.price.toFixed(2), 420, itemY, { align: 'right', width: 60 });
    doc.text(item.amount.toFixed(2), 500, itemY, { align: 'right', width: 60 });
    
    // Draw row line (optional, but keep it clean)
    // doc.moveTo(20, itemY + 15).lineTo(570, itemY + 15).stroke();
    itemY += 20;
  });

  // Footer / Totals region
  const footerY = 550;
  doc.moveTo(20, footerY).lineTo(570, footerY).stroke();
  
  // Amounts in words
  doc.fontSize(8).font('Helvetica-Bold').text('Amount in words:', 30, footerY + 10);
  doc.font('Helvetica').text(numberToWords(Math.round(invoice.total || 0)), 30, footerY + 22, { width: 300 });

  // Totals side
  let totalY = footerY + 10;
  doc.fontSize(9).font('Helvetica-Bold');
  doc.text('Sub Total:', 400, totalY, { align: 'right', width: 90 });
  doc.text(invoice.subTotal.toFixed(2), 500, totalY, { align: 'right', width: 60 });
  
  totalY += 15;
  doc.text('GST Amount:', 400, totalY, { align: 'right', width: 90 });
  doc.text(invoice.totalGst.toFixed(2), 500, totalY, { align: 'right', width: 60 });
  
  totalY += 25;
  doc.fontSize(11).text('TOTAL:', 400, totalY, { align: 'right', width: 90 });
  doc.fillColor('#e63946').text(invoice.total.toFixed(2), 500, totalY, { align: 'right', width: 60 });
  doc.fillColor('black');

  // Terms & Signature
  const lastY = 700;
  doc.fontSize(8).font('Helvetica-Bold').text('Notes / Terms:', 30, lastY);
  doc.font('Helvetica').text('1. All disputes subject to Kolkata jurisdiction.\n2. Payment due within 7 days of invoice date.', 30, lastY + 12);

  doc.fontSize(10).font('Helvetica-Bold').text('For Kleardocs Solutions', 400, lastY, { align: 'center', width: 150 });
  doc.moveDown(3);
  doc.text('Authorized Signatory', 400, doc.y + 40, { align: 'center', width: 150 });

  doc.end();
};
