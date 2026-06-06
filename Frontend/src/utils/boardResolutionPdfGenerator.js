import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export const generateBoardResolutionPdf = async (customer, date, action = 'view') => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  
  // Theme colors
  const primaryColor = [244, 187, 68]; // The yellow/orange from invoice
  const textColor = [0, 0, 0];

  // 1. Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BOARD RESOLUTION", pageWidth / 2, 30, { align: "center" });

  // 2. Draw border around the whole document
  doc.setLineWidth(0.5);
  doc.rect(20, 40, pageWidth - 40, 780);

  // 3. Top Section
  // Top Left: Black Box with Logo
  doc.setFillColor(0, 0, 0);
  doc.rect(22, 42, 140, 110, 'F');
  
  try {
    const logoData = await getBase64ImageFromUrl('/logo.svg');
    if (logoData) {
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
  doc.text("465, VIP Nagar, Hastings Colony,", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("Near VIP Bazar Metro Station, Kolkata - 700100", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("+91 98755 15290", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("info@kleardocs.com | kleardocssolutions@gmail.com", rightAlignX, startY, { align: "right" });
  startY += lineSpacing;
  doc.text("CIN: U69200WB2025PTC278630", rightAlignX, startY, { align: "right" });

  doc.line(20, 160, pageWidth - 20, 160); // separator line

  // 4. Resolution Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS", pageWidth / 2, 180, { align: "center" });

  autoTable(doc, {
    startY: 200,
    margin: { left: (pageWidth - 300) / 2, right: (pageWidth - 300) / 2 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
    head: [['Field', 'Details']],
    body: [
      ['Company Name', customer.companyName || customer.customerName || 'N/A'],
      ['Date of Resolution', date || new Date().toLocaleDateString()],
      ['CIN', customer.cin || 'N/A'],
      ['PAN', customer.pan || 'N/A']
    ],
    columnStyles: {
      0: { cellWidth: 100, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 100, halign: 'center' }
    }
  });

  // 5. Directors Information
  const directorsY = doc.lastAutoTable.finalY + 20;  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DIRECTORS PRESENT", pageWidth / 2, directorsY, { align: "center" });

  if (customer.directors && customer.directors.length > 0) {
    const directorsData = customer.directors.map((director, index) => [
      `${index + 1}.`,
      director.name || 'N/A',
      director.din || 'N/A',
      director.pan || 'N/A'
    ]);

    autoTable(doc, {
      startY: directorsY + 20,
      margin: { left: (pageWidth - 360) / 2, right: (pageWidth - 360) / 2 },
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
      bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
      head: [['S.No', 'Director Name', 'DIN', 'PAN']],
      body: directorsData,
      columnStyles: {
        0: { cellWidth: 40, halign: 'center' },
        1: { cellWidth: 100, halign: 'center' },
        2: { cellWidth: 100, halign: 'center' },
        3: { cellWidth: 80, halign: 'center' }
      }
    });
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("No directors found", pageWidth / 2, directorsY + 20, { align: "center" });
  }

  // 6. Resolution Text
  const resolutionY = Math.max(doc.lastAutoTable.finalY + 30, directorsY + 100);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RESOLUTION", pageWidth / 2, resolutionY, { align: "center" });

  const resolutionText = `"RESOLVED THAT ${customer.companyName || customer.customerName || 'the Company'} shall be authorized to operate and carry on its business activities as per the objects and provisions mentioned in the Memorandum of Association and Articles of Association of the Company. The Board of Directors hereby approves and ratifies all actions taken by the directors and officers of the Company in the ordinary course of business."`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Split text into multiple lines if needed
  const lines = doc.splitTextToSize(resolutionText, pageWidth - 60);
  let textY = resolutionY + 20;
  
  lines.forEach(line => {
    doc.text(line, 30, textY);
    textY += 15;
  });

  // 7. Signatures Section
  const signaturesY = textY + 30;  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SIGNATORIES", pageWidth / 2, signaturesY, { align: "center" });

  autoTable(doc, {
    startY: signaturesY + 20,
    margin: { left: (pageWidth - 360) / 2, right: (pageWidth - 360) / 2 },
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 0, fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
    bodyStyles: { textColor: 0, lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
    head: [['Signatory', 'Signature', 'Date']],
    body: [
      ['Chairman', '', ''],
      ['Director', '', ''],
      ['Director', '', '']
    ],
    columnStyles: {
      0: { cellWidth: 100, halign: 'center' },
      1: { cellWidth: 100, halign: 'center' },
      2: { cellWidth: 80, halign: 'center' }
    }
  });

  // 8. Footer
  const footerY = doc.lastAutoTable.finalY + 40;
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("This is a computer-generated document. No signature is required.", pageWidth / 2, footerY, { align: "center" });
  doc.text("For any queries, please contact: info@kleardocs.com | +91 98755 15290", pageWidth / 2, footerY + 10, { align: "center" });

  // Save or open the PDF
  if (action === 'download') {
    doc.save(`Board_Resolution_${customer.companyName || customer.customerName}_${date}.pdf`);
  } else {
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
  }
};
