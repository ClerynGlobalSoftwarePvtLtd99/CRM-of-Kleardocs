import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to convert number to words
function numberToWords(num) {
  const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
  const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'CRORE ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'LAKH ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'THOUSAND ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'HUNDRED ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  
  str = str.trim();
  return str === '' ? 'ZERO RUPEES ONLY' : str + ' RUPEES ONLY';
}

const getBase64ImageFromUrl = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => reject(error);
    img.src = imageUrl;
  });
};

export const generateInvoicePdf = async (invoice, customer, action = 'view') => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  
  const primaryColor = [252, 191, 73]; // Golden yellow accent
  const borderColor = [0, 0, 0];

  // Title
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Invoice", pageWidth / 2, 20, { align: "center" });

  // Main Border
  doc.setLineWidth(0.5);
  doc.rect(20, 30, pageWidth - 40, 785);

  // Logo Area (Black Box)
  doc.setFillColor(0, 0, 0);
  doc.rect(20, 30, 150, 110, 'F');
  
  try {
    const logoData = await getBase64ImageFromUrl('https://crm-of-kleardocs.vercel.app/logo.svg');
    if (logoData) {
      doc.addImage(logoData, 'SVG', 35, 45, 120, 80);
    }
  } catch (e) {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("KLEARDOCS", 95, 80, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  // Company Details (Top Right)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Kleardocs Solutions", pageWidth - 25, 50, { align: "right" });
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const detailsX = pageWidth - 25;
  let curY = 65;
  const lineH = 11;
  
  doc.text("Phone no.: +91 98755 15290, Email: info@kleardocs.com", detailsX, curY, { align: "right" });
  curY += lineH;
  doc.text("366, Amritalal Mukherjee Road, p.o- Thakurpukur,", detailsX, curY, { align: "right" });
  curY += lineH;
  doc.text("Paschim Barisha, Kolkata, West Bengal, India, 700063", detailsX, curY, { align: "right" });
  curY += lineH;
  doc.text("CIN: U69200WB2025PTC278630 | PAN: AALCK7855M", detailsX, curY, { align: "right" });
  curY += lineH;
  doc.text("Bank A/C No: 50200108344630, IFSC: HDFC0000014, Bank: HDFC Bank", detailsX, curY, { align: "right" });

  // Section Header 1 (Bill To, Transport, Details)
  autoTable(doc, {
    startY: 140,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 10 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, minCellHeight: 80 },
    head: [['Bill To', 'Transportation Details', 'Invoice Details']],
    body: [[
      `${customer.companyName || customer.customerName}\n${customer.address || '-'}\nContact No: ${customer.phone || '-'}`,
      `\n\n\n\n`,
      `Invoice No: ${invoice.number}\nDate: ${invoice.date}\nPlace of Supply: 19-WEST BENGAL\nE-way Bill number:`
    ]],
    columnStyles: {
      0: { cellWidth: 230 },
      1: { cellWidth: 170 },
      2: { cellWidth: 'auto', halign: 'right' }
    }
  });

  // Items Table
  const tableRows = (invoice.items || []).map((item, idx) => [
    (idx + 1).toString(),
    item.hsn || '998399',
    item.product?.name || item.name || item.description,
    `${parseFloat(item.price || 0).toFixed(2)}`,
    `${parseFloat(item.amount || 0).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    head: [['#', 'HSN/SAC', 'Item Name', 'Price', 'Amount']],
    body: [
      ...tableRows,
      [{ content: 'Total', colSpan: 3, styles: { fontStyle: 'bold' } }, `${parseFloat(invoice.totals.subTotal || 0).toFixed(2)}`, `${parseFloat(invoice.totals.total || 0).toFixed(2)}`]
    ],
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 70, halign: 'right' },
      4: { cellWidth: 70, halign: 'right' }
    }
  });

  // Tax Breakdown & Summary
  const nextY = doc.lastAutoTable.finalY;
  
  // Tax Table (Left)
  autoTable(doc, {
    startY: nextY,
    margin: { left: 20, right: pageWidth / 2 + 30 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, minCellHeight: 15 },
    head: [['Tax Type', 'Taxable amount', 'Rate', 'Tax amount']],
    body: [
      ['CGST', `${parseFloat(invoice.totals.subTotal || 0).toFixed(2)}`, '9%', `${(parseFloat(invoice.totals.gst || 0) / 2).toFixed(2)}`],
      ['SGST', `${parseFloat(invoice.totals.subTotal || 0).toFixed(2)}`, '9%', `${(parseFloat(invoice.totals.gst || 0) / 2).toFixed(2)}`],
      ['Total', '', '', `${parseFloat(invoice.totals.gst || 0).toFixed(2)}`]
    ]
  });

  // Summary Table (Right)
  autoTable(doc, {
    startY: nextY,
    margin: { left: pageWidth / 2 - 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    head: [['Amounts', '']],
    body: [
      ['Sub Total', `Rs ${parseFloat(invoice.totals.subTotal || 0).toFixed(2)}`],
      ['Total', `Rs ${parseFloat(invoice.totals.total || 0).toFixed(2)}`],
      ['Received Balance', `Rs ${parseFloat(invoice.totals.paid || 0).toFixed(2)}`],
      ['Due Balance', `Rs ${parseFloat(invoice.totals.due || 0).toFixed(2)}`]
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right', cellWidth: 'auto' }
    }
  });

  // Amount In Words
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 9, halign: 'center' },
    head: [['Invoice Amount In Words', 'Description']],
    body: [[
      numberToWords(Math.round(invoice.totals.total || 0)),
      ''
    ]]
  });

  // Terms & Conditions and Signature
  const footerY = doc.lastAutoTable.finalY;
  
  // Terms (Left)
  autoTable(doc, {
    startY: footerY,
    margin: { left: 20, right: pageWidth / 2 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, minCellHeight: 120 },
    head: [['Terms and Conditions']],
    body: [['Thanks for buying']]
  });

  // Signature Block (Right)
  const sigX = pageWidth / 2;
  const sigWidth = pageWidth / 2 - 20;
  doc.rect(sigX, footerY, sigWidth, 137); // Border for signature box
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("For Kleardocs Solutions", sigX + sigWidth / 2, footerY + 15, { align: "center" });

  // Stamp Placeholder (Simplified Circle style)
  const centerX = sigX + sigWidth / 2;
  const centerY = footerY + 75;
  doc.setLineWidth(1);
  doc.setDrawColor(180, 180, 180);
  doc.circle(centerX, centerY, 45, 'S');
  doc.circle(centerX, centerY, 40, 'S');

  doc.setFontSize(7);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("KLEARDOCS SOLUTIONS", centerX, centerY - 5, { align: "center" });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("cursive", "italic");
  doc.text("Authorized Signatory", centerX, centerY + 15, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Authorized Signatory", centerX, centerY + 50, { align: "center" });

  if (action === 'download') {
    doc.save(`Invoice_${invoice.number}.pdf`);
  } else {
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
  }
};
