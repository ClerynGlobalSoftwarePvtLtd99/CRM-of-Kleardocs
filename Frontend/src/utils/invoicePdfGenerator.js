import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to convert number to words (for invoice amount in words)
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
  
  // Theme colors
  const primaryColor = [244, 187, 68]; // The yellow/orange from the image
  const textColor = [0, 0, 0];

  // 1. Title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Invoice", pageWidth / 2, 30, { align: "center" });

  // 2. Draw border around the whole document like the image
  doc.setLineWidth(0.5);
  doc.rect(20, 40, pageWidth - 40, 780);

  // 3. Top Section
  // Top Left: Black Box with Logo
  doc.setFillColor(0, 0, 0);
  doc.rect(22, 42, 140, 110, 'F');
  
  try {
    const logoData = await getBase64ImageFromUrl('/logo.svg');
    // Draw the image centered in the rect (approx)
    if (logoData) {
      // Adjust dimensions based on image aspect ratio, roughly 100x100
      doc.addImage(logoData, 'PNG', 42, 62, 100, 70);
    }
  } catch (e) {
    console.warn("Could not load logo for PDF", e);
  }

  // Top Right: Company Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Kleardocs", pageWidth - 25, 55, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let startY = 70;
  const lineSpacing = 12;
  const rightAlignX = pageWidth - 25;
  
  doc.text("Contact Us", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("366, Amritalal Mukherjee Road, p.o- Thakurpukur,", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("Paschim Barisha, Kolkata, West Bengal, India, 700063", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("+91 98755 15290", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("info@kleardocs.com | kleardocssolutions@gmail.com", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("CIN: U69200WB2025PTC278630", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("Company PAN: AALCK7855M", rightAlignX, startY, { align: "right" });

  doc.line(20, 160, pageWidth - 20, 160); // separator line

  // 4. Client and Invoice Details Tables
  autoTable(doc, {
    startY: 160,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['Bill To', 'Transportation Details', 'Invoice Details']],
    body: [
      [
        `${customer.companyName || customer.customerName}\n\n${customer.address || '-'}\n\nState: ${customer.state || '-'}\nContact No: ${customer.phone || '-'}`,
        `\n\n\n\n\n`,
        `Invoice No: ${invoice.number}\nDate: ${invoice.date}\nPlace of Supply: ${customer.state || '-'}\nE-way Bill number:`
      ]
    ],
    columnStyles: {
      0: { cellWidth: 190 },
      1: { cellWidth: 180 },
      2: { cellWidth: 'auto', halign: 'right' }
    }
  });

  // 5. Items Table
  const isMultipleItems = Array.isArray(invoice.items) && invoice.items.length > 0;
  
  const finalPrice = isMultipleItems ? invoice.totals.amount : (invoice.price || invoice.total || 0);
  const gstAmount = isMultipleItems ? invoice.totals.gst : ((finalPrice * (invoice.gst || 0)) / 100);
  const rowAmount = parseFloat(finalPrice).toFixed(2);
  
  const tableBody = isMultipleItems 
    ? invoice.items.map((item, index) => [
        (index + 1).toString(),
        '998399',
        item.product?.name || 'Service',
        `Rs ${parseFloat(item.price || 0).toFixed(2)}`,
        `Rs ${parseFloat(item.amount || 0).toFixed(2)}`
      ])
    : [['1', '998399', invoice.service || 'Service', `Rs ${rowAmount}`, `Rs ${rowAmount}`]];

  // Add the Total row
  tableBody.push(['Total', '', '', `Rs ${rowAmount}`, `Rs ${rowAmount}`]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['#', 'HSN/SAC', 'Item Name', 'Price', 'Amount']],
    body: tableBody,
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 70 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 80, halign: 'right' },
      4: { cellWidth: 80, halign: 'right' }
    },
    didParseCell: function(data) {
      if (data.row.index === tableBody.length - 1) { // Total row
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // 6. Lower tables section (Amounts and Taxes)
  const amountsY = doc.lastAutoTable.finalY;
  
  // Tax details on the left, Totals on the right
  autoTable(doc, {
    startY: amountsY,
    margin: { left: 20, right: pageWidth / 2 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['Tax Type', 'Taxable amount', 'Rate', 'Tax amount']],
    body: [
      ['\n\n\n\n', '', '', ''] // Empty to push height
    ],
    styles: { minCellHeight: 60 }
  });
  const leftTableFinalY = doc.lastAutoTable.finalY;

  autoTable(doc, {
    startY: amountsY,
    margin: { left: pageWidth / 2, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['Amounts', '']],
    body: [
      ['Sub Total', `Rs ${rowAmount}`],
      ['Total', `Rs ${rowAmount}`],
      ['Received', `Rs 0.00`],
      ['Balance', `Rs ${rowAmount}`]
    ],
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' }
    }
  });
  const rightTableFinalY = doc.lastAutoTable.finalY;

  // Math the highest Y
  const nextY = Math.max(leftTableFinalY, rightTableFinalY);

  // 7. Amount in words and Description
  // We need to calculate how many rows to make
  const totalRounded = Math.round(parseFloat(rowAmount));
  const amountInWords = numberToWords(totalRounded);

  autoTable(doc, {
    startY: nextY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['Invoice Amount In Words', 'Description']],
    body: [
      [`${amountInWords}`, '']
    ],
    columnStyles: {
      0: { cellWidth: (pageWidth - 40) / 2 },
      1: { cellWidth: (pageWidth - 40) / 2 }
    }
  });

  // 8. Terms & Signatory
  const termsY = doc.lastAutoTable.finalY;
  
  autoTable(doc, {
    startY: termsY,
    margin: { left: 20, right: 20 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5 },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5 },
    head: [['Terms and Conditions', '']],
    body: [
      [
        'Thanks for buying',
        `For Kleardocs\n\n\n\n\n\n\n\nAuthorized Signatory`
      ]
    ],
    columnStyles: {
      0: { cellWidth: (pageWidth - 40) / 2, minCellHeight: 120 },
      1: { cellWidth: (pageWidth - 40) / 2, halign: 'center', fontStyle: 'bold' }
    }
  });

  // Final border cleanup if any gaps 
  // It's mostly covered by the tables

  if (action === 'download') {
    doc.save(`Invoice_${invoice.number}.pdf`);
  } else {
    // Open PDF in a new tab for preview
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
  }
};
