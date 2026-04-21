import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import stampUrl from '../assets/AuthStamp2.png';

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

  // ── Normalize totals ──────────────────────────────────────────────────────────
  // Backend returns flat fields (subTotal, totalGst, total, paid, due).
  // Frontend AddInvoice may pass a nested `.totals` object. Handle both.
  const t = {
    subTotal: invoice.subTotal ?? invoice.totals?.price ?? invoice.totals?.subTotal ?? 0,
    gst: invoice.totalGst ?? invoice.totals?.gstAmount ?? invoice.totals?.gst ?? 0,
    total: invoice.total ?? invoice.totals?.amount ?? invoice.totals?.total ?? 0,
    paid: invoice.paid ?? invoice.totals?.paid ?? 0,
    due: invoice.due ?? invoice.totals?.due ?? 0,
  };

  // Normalize invoice number / date
  const invoiceNumber = invoice.invoiceNo || invoice.number || '—';
  const invoiceDate = invoice.invoiceDate
    ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN')
    : invoice.date || '—';

  const docDescription = invoice.description || invoice.notes || invoice.remark || invoice.remarks || '—';

  const primaryColor = [212, 175, 107]; // Lighter brown/gold #D4A96B
  const borderColor = [0, 0, 0];

  // Title
  if (t.gst > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice", pageWidth / 2, 20, { align: "center" });
  }

  // Main Border
  doc.setLineWidth(0.5);
  doc.rect(20, 30, pageWidth - 40, 785);

  // Logo Area (Black Box) - Square shape
  doc.setFillColor(0, 0, 0);
  doc.rect(20, 30, 110, 110, 'F');

  try {
    const logoData = await getBase64ImageFromUrl('https://crm.kleardocs.com/logo.svg');
    if (logoData) {
      doc.addImage(logoData, 'SVG', 30, 40, 90, 90);
    }
  } catch (e) {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("KLEARDOCS", 75, 85, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  // Company Details (Top Right)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Kleardocs Solutions Private Limited", pageWidth - 25, 50, { align: "right" });

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
  doc.text("Bank A/C No: 925020025764619, IFSC: UTIB0004234, Bank Name: AXIS BANK", detailsX, curY, { align: "right" });

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
      `Invoice No: ${invoiceNumber}\nDate: ${invoiceDate}\nPlace of Supply: ${invoice.placeOfSupply || '19-WEST BENGAL'}\nE-way Bill number:`
    ]],
    columnStyles: {
      0: { cellWidth: 230 },
      1: { cellWidth: 170 },
      2: { cellWidth: 'auto', halign: 'right' }
    }
  });

  // Formatting Helpers
  const formatMoney = (value) => `Rs. ${parseFloat(value || 0).toFixed(2)}`;
  const formatPercent = (value) => `${parseFloat(value || 0)}%`;

  // Items Table
  const hasGst = (invoice.items || []).some(item => (parseFloat(item.gstAmount || 0) > 0 || parseFloat(item.gstPercent || item.gstPercentage || 0) > 0));

  const tableHeaders = hasGst
    ? [['#', 'HSN/SAC', 'Item Name', 'Price', 'IGST', 'Amount']]
    : [['#', 'HSN/SAC', 'Item Name', 'Price', 'Amount']];

  const tableRows = (invoice.items || []).map((item, idx) => {
    const rate = item.gstPercent ?? item.gstPercentage ?? 0;
    const price = parseFloat(item.price || 0);
    const gstAmount = parseFloat(item.gstAmount || 0);
    const totalAmount = parseFloat(item.amount || 0);

    const row = [
      (idx + 1).toString(),
      item.hsn || '998399',
      item.product?.name || item.name || item.description,
      formatMoney(price)
    ];

    if (hasGst) {
      row.push(`${formatMoney(gstAmount)}\n(${formatPercent(rate)})`);
    }

    row.push(formatMoney(totalAmount));
    return row;
  });

  const totalRow = hasGst
    ? [
      { content: 'Total', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
      formatMoney(t.subTotal),
      formatMoney(t.gst),
      formatMoney(t.total)
    ]
    : [
      { content: 'Total', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
      formatMoney(t.subTotal),
      formatMoney(t.total)
    ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9, halign: 'center' },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, charSpace: 0, cellPadding: 4, font: 'helvetica' },
    head: tableHeaders,
    body: [
      ...tableRows,
      totalRow
    ],
    columnStyles: hasGst ? {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 55, halign: 'center' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 80, halign: 'right' },
      4: { cellWidth: 85, halign: 'right' },
      5: { cellWidth: 80, halign: 'right' }
    } : {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 55, halign: 'center' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 80, halign: 'right' },
      4: { cellWidth: 80, halign: 'right' }
    }
  });

  // Tax Breakdown & Summary
  const nextY = doc.lastAutoTable.finalY + 10;

  // Tax Table (Left)
  const taxRows = (invoice.items || [])
    .filter(item => (parseFloat(item.gstAmount || 0) > 0 || parseFloat(item.gstPercent || item.gstPercentage || 0) > 0))
    .map(item => [
      'IGST',
      formatMoney(item.price || (item.professionalFees + item.govtFees)),
      formatPercent(item.gstPercent ?? item.gstPercentage ?? 0),
      formatMoney(item.gstAmount)
    ]);

  autoTable(doc, {
    startY: nextY,
    margin: { left: 20, right: pageWidth / 2 + 5 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9, halign: 'center' },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, minCellHeight: 15, charSpace: 0, cellPadding: 3, font: 'helvetica' },
    head: [['Tax Type', 'Taxable amount', 'Rate', 'Tax amount']],
    body: taxRows.length > 0
      ? [...taxRows, [{ content: 'Total', styles: { fontStyle: 'bold' } }, '', '', { content: formatMoney(t.gst), styles: { fontStyle: 'bold' } }]]
      : [['IGST', formatMoney(0), '0%', formatMoney(0)]],
    columnStyles: {
      0: { cellWidth: 40 },
      1: { halign: 'right' },
      2: { halign: 'center' },
      3: { halign: 'right' }
    }
  });

  // Summary Table (Right)
  const summaryBody = [
    ['Sub Total', formatMoney(t.subTotal)]
  ];

  if (hasGst) {
    summaryBody.push(['GST', formatMoney(t.gst)]);
  }

  summaryBody.push(
    ['Total', formatMoney(t.total)],
    ['Received Balance', formatMoney(t.paid)],
    ['Due Balance', formatMoney(t.due)]
  );

  autoTable(doc, {
    startY: nextY,
    margin: { left: pageWidth / 2 + 5, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, charSpace: 0, cellPadding: 3, font: 'helvetica' },
    head: [['Amounts', '']],
    body: summaryBody,
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { halign: 'right', cellWidth: 'auto' }
    }
  });

  // Amount In Words
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'normal', lineWidth: 0.5, lineColor: borderColor, fontSize: 9 },
    bodyStyles: { textColor: 0, lineWidth: 0.5, lineColor: borderColor, fontSize: 8, halign: 'left' },
    head: [['Invoice Amount In Words', 'Description']],
    body: [[
      numberToWords(Math.round(t.total || 0)),
      docDescription
    ]],
    columnStyles: {
      0: { cellWidth: 320 },
      1: { cellWidth: 'auto' }
    }
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
    body: [['Thanks for buying.']]
  });

  // Signature Block (Right)
  const sigX = pageWidth / 2;
  const sigWidth = pageWidth / 2 - 20;
  doc.rect(sigX, footerY, sigWidth, 137); // Border for signature box

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("For Kleardocs Solutions Private Limited", sigX + sigWidth / 2, footerY + 15, { align: "center" });

  // Add Authorized Signatory Stamp Image
  // stampUrl is resolved by Vite at build time and works in all environments
  try {
    const stampData = await getBase64ImageFromUrl(stampUrl);
    if (stampData) {
      const stampWidth = 100;
      const stampHeight = 100;
      const centerX = sigX + sigWidth / 2;
      const centerY = footerY + 75;
      doc.addImage(stampData, 'PNG', centerX - stampWidth / 2, centerY - stampHeight / 2, stampWidth, stampHeight);
    }
  } catch (e) {
    console.error('Failed to load stamp image:', e);
    // Fallback placeholder circles if image fails
    const centerX = sigX + sigWidth / 2;
    const centerY = footerY + 75;
    doc.setLineWidth(1);
    doc.setDrawColor(180, 180, 180);
    doc.circle(centerX, centerY, 45, 'S');
    doc.circle(centerX, centerY, 40, 'S');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("KLEARDOCS SOLUTIONS PRIVATE LIMITED", centerX, centerY - 5, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", sigX + sigWidth / 2, footerY + 135, { align: "center" });

  if (action === 'download') {
    doc.save(`Invoice_${invoiceNumber}.pdf`);
  } else {
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
  }
};
