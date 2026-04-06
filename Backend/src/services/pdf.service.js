import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import path from 'path';
import puppeteer from 'puppeteer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageToBase64 = (filePath) => {
  try {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${Buffer.from(bitmap).toString('base64')}`;
  } catch (e) {
    console.error(`Error converting ${filePath} to base64:`, e);
    return '';
  }
};

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

export const generateBoardResolution = async (customer, data, res) => {
  const companyName = customer.companyName?.toUpperCase() || customer.name?.toUpperCase() || 'COMPANY NAME';
  
  // Format Address (Address + State)
  const cleanAddress = (customer.address || 'ADDRESS NOT PROVIDED').trim().replace(/,\\s*$/, '');
  const stateStr = customer.state ? `, ${customer.state.trim().toUpperCase()}` : '';
  const companyAddress = `${cleanAddress.toUpperCase()}${stateStr}`.replace(/\\s+/g, ' ');
  
  const director = (customer.directors && customer.directors.length > 0) ? customer.directors[0] : {};
  const directorName = (director.name || 'DIRECTOR NAME').toUpperCase();
  const directorDin = (director.din || 'DIN NOT PROVIDED');

  const dateObj = data.date ? new Date(data.date) : new Date();
  const day = dateObj.getDate();
  const monthIdx = dateObj.getMonth();
  const year = dateObj.getFullYear();
  
  const paddedDay = day.toString().padStart(2, '0');
  const paddedMonth = (monthIdx + 1).toString().padStart(2, '0');
  const formattedDate = `${paddedDay}/${paddedMonth}/${year}`;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  const ord = (s[(v - 20) % 10] || s[v] || s[0]);
  const formattedDateWithSuffix = `${paddedDay}${ord} ${months[monthIdx]}, ${year}`;

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  const blackColor = '#000000';
  const lightBlueColor = '#2F5597';

  // --- Header ---
  doc.font('Times-Bold').fontSize(16).fillColor(lightBlueColor)
     .text(companyName, { align: 'center' });
  
  doc.font('Times-Roman').fontSize(12).fillColor(lightBlueColor)
     .text(companyAddress, { align: 'center' });
  
  doc.moveDown(0.2);
  doc.font('Times-Roman').fillColor(blackColor).text('|', { align: 'center' });
  doc.moveDown(0.2);

  const certText = `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${companyName} HELD AT ${companyAddress}.`;
  doc.font('Times-Bold').fontSize(12).text(certText, { align: 'justify' });

  doc.moveDown(2);

  // --- Title ---
  doc.font('Times-Roman').fontSize(12).text(`Board Resolution for appointment of first auditor of ${companyName}`, { align: 'justify' });

  doc.moveDown(1.5);

  // --- Date ---
  doc.text(`Date: ${formattedDate}`, { align: 'justify' });

  doc.moveDown(1.5);

  // --- Intro ---
  doc.text(`At a meeting of the Board of Directors of ${companyName} held on ${formattedDateWithSuffix}, it was:`, { align: 'justify' });

  doc.moveDown(1.5);

  // --- Body Paragraph 1 ---
  const para1 = `RESOLVED THAT Pursuant to the provisions of section 139 and 142 of the companies Act, 2013 read with Rule 3 of the companies (Audit and Auditors) Rules, 2014 and other applicable provisions of the companies Act, 2013 read with rules made thereunder (including any statutory modification(s) or re-enactment there of for the time being in force) , consent of the Board be and is hereby accorded to appoint Mr. Susanta Kumar Swain, Membership Number - 065257 Firm M/s. DDCA AND ASSOCIATES (Firm Registration No- 0330380E) as First Auditors of the company to hold office till the conclusion of the First Annual General Meeting of the company, to examine and audit the accounts of the company, on such remuneration as may be mutually agreed upon between ${directorName}, Director of the company and the Auditors.`;
  doc.text(para1, { align: 'justify' });

  doc.moveDown(1.5);

  // --- Body Paragraph 2 ---
  const para2 = `RESOLVED FURTHER THAT ${directorName} - Director of the company be and is hereby authorized to do all such acts, deeds and things and execute such other documents as may be necessary for the purpose of giving effect to this resolution.`;
  doc.text(para2, { align: 'justify' });

  doc.moveDown(2);

  // --- Footer / Signatory ---
  doc.font('Times-Bold').text(directorName, { align: 'left' });
  
  // Big gap for handwritten signature
  doc.moveDown(4);
  
  doc.font('Times-Roman').text('DIRECTOR', { align: 'left' });
  doc.text(`DIN: ${directorDin}`, { align: 'left' });

  doc.end();
};

export const generateConsentLetter = async (customer, data, res) => {
  // Custom date formatting
  const getOrdinalDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      const day = d.getDate();
      const month = d.toLocaleString('en-IN', { month: 'Long' });
      const year = d.getFullYear();
      const s = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = (s[(v - 20) % 10] || s[v] || s[0]);
      return `${day}${ord} ${month}, ${year}`;
    } catch (e) {
      return "N/A";
    }
  };

  const formattedIncDate = customer.incorporationDate ? getOrdinalDate(customer.incorporationDate) : "Date of Incorporation";
  const formattedToday = getOrdinalDate(data.date || new Date());

  // Dynamic Year Logic
  const currentDate = data.date ? new Date(data.date) : new Date();
  const financialYearEndYear = currentDate.getMonth() >= 3 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
  const financialYearEndLabel = `31st March ${financialYearEndYear}`;

  // Paths for Assets
  const assetsPath = path.join(__dirname, '../../../Frontend/src/assets/Consent Letter/');
  const headerImg64 = imageToBase64(path.join(assetsPath, 'CA-title image.png'));
  const signatureImg64 = imageToBase64(path.join(assetsPath, 'Signature.png'));
  const ddcaImg64 = imageToBase64(path.join(assetsPath, 'DDCA.png'));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: "Times New Roman", Times, serif;
          margin: 0;
          padding: 40px;
          color: #000;
          line-height: 1.6;
          font-size: 13px;
          -webkit-print-color-adjust: exact;
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .header-logo {
          width: 80px;
          height: auto;
          margin-right: 20px;
        }

        .header-details {
          flex: 1;
        }

        .header-details h1 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .header-details p {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
          color: #555;
        }

        .recipient-block {
          margin-bottom: 20px;
        }

        .recipient-block b {
          display: block;
        }

        .subject-line {
          margin-bottom: 20px;
        }

        .subject-line b {
          text-decoration: underline;
        }

        .body-text {
          text-align: justify;
          margin-bottom: 15px;
        }

        .declarations {
          margin-left: 20px;
          margin-bottom: 20px;
        }

        .declaration-item {
          display: flex;
          gap: 15px;
          margin-bottom: 8px;
          text-align: justify;
        }

        .closing {
          margin-bottom: 25px;
        }

        .signatory-section {
          margin-bottom: 15px;
        }

        .signatory-header {
          font-weight: bold;
          margin-bottom: 40px;
        }

        .signatures-flex {
          display: flex;
          align-items: center;
          gap: 60px;
          margin-bottom: 15px;
        }

        .signature-img {
          width: 140px;
          height: auto;
        }

        .stamp-img {
          width: 100px;
          height: auto;
        }

        .partner-details {
          font-size: 12px;
          line-height: 1.4;
        }

        .partner-details b {
          display: block;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .footer {
          position: fixed;
          bottom: 40px;
          left: 40px;
          right: 40px;
          text-align: center;
        }

        .footer-text {
          color: #2F5597;
          font-weight: bold;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${headerImg64}" class="header-logo" alt="Logo">
        <div class="header-details">
          <h1>DDCA & ASSOCIATES</h1>
          <p>Chartered Accountants</p>
        </div>
      </div>

      <div class="recipient-block">
        <b>TO,</b>
        <b>THE BOARD OF DIRECTORS</b>
        <b>${(customer.companyName || customer.name).toUpperCase()}</b>
        <div style="text-transform: uppercase;">${customer.address || "Address N/A"}</div>
      </div>

      <div class="date-line">
        Date: ${formattedToday}
      </div>

      <div class="subject-line">
        <b>Subject:</b> <u>Consent to act as First Auditor and Certificate under Section 139(6) of the Companies Act, 2013</u>
      </div>

      <div class="salutation">
        Dear Sir/Madam,
      </div>

      <div class="body-text">
        We, <b>M/s. DDCA & ASSOCIATES</b>, Chartered Accountants, hereby give our consent to be appointed as the <b>First Auditor</b> of <b>${(customer.companyName || customer.name).toUpperCase()}</b> under Section 139(6) of the Companies Act, 2013, for the financial year commencing from <b>${formattedIncDate} (Date of Incorporation)</b> to <b>${financialYearEndLabel}.</b>
      </div>

      <div class="body-text">
        Further, pursuant to the provisions of <b>Section 139(6) and Rule 4 of the Companies (Audit and Auditors) Rules, 2014</b>, we hereby certify that:
      </div>

      <div class="declarations">
        <div class="declaration-item">
          <span>1.</span>
          <span>We satisfy the eligibility criteria as specified under Section 141 of the Companies Act, 2013;</span>
        </div>
        <div class="declaration-item">
          <span>2.</span>
          <span>We are not disqualified from being appointed as Auditor under the provisions of the Companies Act, 2013, the Chartered Accountants Act, 1949, and the rules or regulations made thereunder;</span>
        </div>
        <div class="declaration-item">
          <span>3.</span>
          <span>The proposed appointment is in accordance with the provisions of the Companies Act, 2013;</span>
        </div>
        <div class="declaration-item">
          <span>4.</span>
          <span>The proposed appointment is within the limits laid down under the Act;</span>
        </div>
        <div class="declaration-item">
          <span>5.</span>
          <span>There are no pending proceedings relating to professional misconduct against the firm or any of its partners under the Chartered Accountants Act, 1949.</span>
        </div>
      </div>

      <div class="body-text">
        We request you to kindly take the above on record and do the needful.
      </div>

      <div class="closing">
        Thanking You,<br>
        Yours faithfully,
      </div>

      <div class="signatory-section">
        <div class="signatory-header">For DDCA & ASSOCIATES<br>Chartered Accountants</div>
        
        <div class="signatures-flex">
          <img src="${signatureImg64}" class="signature-img" alt="Signature">
          <img src="${ddcaImg64}" class="stamp-img" alt="Stamp">
        </div>

        <div class="partner-details">
          <b>FRN: 0330380E</b>
          <b>CA SUSANTA KUMAR SWAIN</b>
          Partner<br>
          Membership No: 065257<br>
          Place: Bhubaneswar<br>
          Date: ${formattedToday}
        </div>
      </div>

      <div class="footer">
        <span class="footer-text">PLOT NO. 119, MADHUSUDAN NAGAR, UNIT-IV, BHUBANESWAR – 751001, ODISHA</span>
      </div>
    </body>
    </html>
  `;

  try {
    const commonPaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    let executablePath = undefined;
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        executablePath = p;
        break;
      }
    }

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
      format: 'A4', 
      margin: { top: '0', bottom: '0', left: '0', right: '0' }, // Margins are handled in HTML/CSS padding
      printBackground: true 
    });
    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
  } catch (err) {
    console.error("Puppeteer PDF Error:", err);
    res.status(500).send("Error generating PDF with Puppeteer. Ensure Chrome bin is available.");
  }
};

export const generateAuditorsReport = async (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
  doc.pipe(res);

  // Fetch Firm Details from SystemSetting
  let firmDetails = {
    firmName: "M/s. JAGJYOT SINGH AND ASSOCIATES.",
    firmRegistrationNumber: "333567E",
    firmAddress: "PLOT 51, BLOCK BB – 102, SHANTIPALLY, SARAT PARK, KOLKATA – 700107",
    proprietorName: "CA Jagjyot Singh",
    membershipNumber: "319799"
  };

  try {
    const { default: SystemSetting } = await import("../models/SystemSetting.model.js");
    const settings = await SystemSetting.findOne();
    if (settings) {
      firmDetails = {
        firmName: settings.firmName || firmDetails.firmName,
        firmRegistrationNumber: settings.firmRegistrationNumber || firmDetails.firmRegistrationNumber,
        firmAddress: settings.firmAddress || firmDetails.firmAddress,
        proprietorName: settings.proprietorName || firmDetails.proprietorName,
        membershipNumber: settings.membershipNumber || firmDetails.membershipNumber
      };
    }
  } catch (e) {
    console.error("Error fetching firm settings:", e);
  }

  const reportDate = data.date ? new Date(data.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const financialYearEnd = "31st March 2025"; // Can be dynamic based on data.financialYear if needed

  const addFooter = () => {
    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#4b5563').font('Helvetica').text(firmDetails.firmName, 50, 780, { align: 'center', width: 500 });
      doc.text(`Firm Registration No. - ${firmDetails.firmRegistrationNumber}`, 50, 790, { align: 'center', width: 500 });
      doc.text(firmDetails.firmAddress, 50, 800, { align: 'center', width: 500 });
    }
  };

  // --- PAGE 1 ---
  doc.fillColor('black').fontSize(14).font('Helvetica-Bold').text("INDEPENDENT AUDITOR'S REPORT", { align: 'center' });
  doc.moveDown();
  doc.fontSize(11).text("To the Members of");
  doc.text(customer.companyName?.toUpperCase() || customer.name?.toUpperCase());
  doc.fontSize(10).font('Helvetica').text(`CIN: ${data.cin || customer.cin || 'N/A'}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Report on the Audit of the Financial Statements");
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text("Opinion");
  doc.font('Helvetica').text(`We have audited the accompanying financial statements of ${customer.companyName || customer.name} (“the Company”), which comprise the Balance Sheet as at ${financialYearEnd}, the Statement of Profit and Loss, the Statement of Changes in Equity, and the Cash Flow Statement for the year then ended, and a summary of the significant accounting policies and other explanatory information (collectively referred to as "the financial statements").`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give the information required by the Companies Act, 2013 (“the Act”) in the manner so required and give a true and fair view in conformity with the accounting principles generally accepted in India, of the state of affairs of the Company as at ${financialYearEnd}, its profit, changes in equity, and its cash flows for the year then ended.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Basis for Opinion");
  doc.font('Helvetica').text(`We conducted our audit in accordance with the Standards on Auditing (SAs) specified under Section 143(10) of the Act. We are independent of the Company in accordance with the Code of Ethics issued by the Institute of Chartered Accountants of India (ICAI), and we have fulfilled our other ethical responsibilities in accordance with these requirements and the ICAI’s Code of Ethics.`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our audit opinion.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Information Other than the Financial Statements and Auditor’s Report Thereon");
  doc.font('Helvetica').text(`The Company’s management and Board of Directors are responsible for the preparation of other information. The other information comprises the Board’s Report and its annexures, but does not include the financial statements and our auditor’s report thereon.`, { align: 'justify' });

  // --- PAGE 2 ---
  doc.addPage();
  doc.font('Helvetica').text(`Our opinion does not cover the other information and we do not express any form of assurance conclusion thereon. In connection with our audit of the financial statements, our responsibility is to read the other information and, in doing so, consider whether such information is materially inconsistent with the financial statements or our knowledge obtained in the audit. Based on the work performed, nothing has come to our attention that causes us to believe that there is a material misstatement of this other information.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Management’s Responsibility for the Financial Statements");
  doc.font('Helvetica').text(`The Company’s Board of Directors is responsible for the matters stated in Section 134(5) of the Act with respect to the preparation of these financial statements that give a true and fair view of the financial position, financial performance, changes in equity, and cash flows of the Company in accordance with the accounting principles generally accepted in India, including the Accounting Standards specified under Section 133 of the Act.`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`This responsibility includes the maintenance of adequate accounting records in accordance with the provisions of the Act for safeguarding the assets of the Company and for preventing and detecting frauds and other irregularities; the selection and application of appropriate accounting policies; making judgments and estimates that are reasonable and prudent; and the design, implementation, and maintenance of adequate internal financial controls that were operating effectively for ensuring the accuracy and completeness of the accounting records relevant to the preparation and presentation of the financial statements.`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`In preparing the financial statements, management is responsible for assessing the Company’s ability to continue as a going concern, disclosing, as applicable, matters related to going concern and using the going concern basis of accounting unless management either intends to liquidate the Company or to cease operations, or has no realistic alternative but to do so.`, { align: 'justify' });
  doc.moveDown();
  doc.text(`The Board of Directors is also responsible for overseeing the Company’s financial reporting process.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Auditor’s Responsibilities for the Audit of the Financial Statements");
  doc.font('Helvetica').text(`Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor’s report that includes our opinion. Reasonable assurance is a high level of assurance but is not a guarantee that an audit conducted in accordance with SAs will always detect a material misstatement when it exists.`, { align: 'justify' });

  // --- PAGE 3 ---
  doc.addPage();
  doc.text("As part of an audit in accordance with SAs, we:");
  doc.list([
    "Identify and assess the risks of material misstatement, whether due to fraud or error;",
    "Obtain an understanding of internal controls and assess their effectiveness;",
    "Evaluate the appropriateness of accounting policies used and the reasonableness of accounting estimates;",
    "Conclude on the appropriateness of the going concern assumption;",
    "Evaluate the overall presentation of the financial statements."
  ], { bulletRadius: 2, textIndent: 20 });
  doc.moveDown();

  doc.text(`We communicate with those charged with governance regarding, among other matters, the planned scope and timing of the audit and significant audit findings, including any significant deficiencies in internal control that we identify during our audit.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Emphasis of Matter");
  doc.font('Helvetica').text(`We draw attention to the fact that no matters have been observed during the course of the audit that require emphasis. Hence, no Emphasis of Matter is reported.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Key Audit Matters");
  doc.font('Helvetica').text(`In our professional judgment, no Key Audit Matters need to be communicated in this report as per SA 701, “Communicating Key Audit Matters in the Independent Auditor’s Report”.`, { align: 'justify' });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Reporting on Internal Financial Controls");
  doc.font('Helvetica').text(`We have audited the internal financial controls over financial reporting of the Company as of ${financialYearEnd} in conjunction with our audit of the financial statements.`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`In our opinion, the Company has, in all material respects, an adequate internal financial control system over financial reporting and such internal financial controls were operating effectively as at ${financialYearEnd}, based on the internal control criteria established by the Company considering the essential components of internal control stated in the Guidance Note on Audit of Internal Financial Controls Over Financial Reporting issued by the ICAI.`, { align: 'justify' });

  // --- PAGE 4 ---
  doc.addPage();
  doc.font('Helvetica-Bold').text("Other Legal and Regulatory Requirements");
  doc.font('Helvetica').text(`1. As required by the Companies (Auditor’s Report) Order, 2020 (“the Order”), issued by the Central Government of India in terms of Section 143(11) of the Act, we give in “Annexure A” a statement on the matters specified in paragraphs 3 and 4 of the Order, to the extent applicable.`, { align: 'justify' });
  doc.moveDown(0.5);
  doc.text(`2. As required by Section 143(3) of the Act, we report that:`, { align: 'justify' });
  doc.moveDown(0.2);
  const requirements = [
    "We have obtained all the information and explanations which to the best of our knowledge and belief were necessary for the purposes of our audit;",
    "In our opinion, proper books of account as required by law have been kept by the Company so far as it appears from our examination of those books;",
    "The Balance Sheet, the Statement of Profit and Loss, the Statement of Changes in Equity, and the Cash Flow Statement dealt with by this report are in agreement with the books of account;",
    "In our opinion, the aforesaid financial statements comply with the Accounting Standards specified under Section 133 of the Act, read with Rule 7 of the Companies (Accounts) Rules, 2014;",
    "On the basis of written representations received from the directors as on 31st March 2025, none of the directors is disqualified as on that date from being appointed as a director in terms of Section 164(2) of the Act."
  ];
  requirements.forEach((req, i) => {
    const y = doc.y;
    doc.text(`${String.fromCharCode(65 + i)}.`, 70, y, { width: 20 });
    doc.text(req, 90, y, { width: 450, align: 'justify' });
    doc.moveDown(0.3);
  });
  doc.moveDown();

  doc.font('Helvetica-Bold').text("Other Matters as per Rule 11 of Companies (Audit and Auditors) Rules, 2014");
  doc.font('Helvetica').text(`Pursuant to Rule 11 of the Companies (Audit and Auditors) Rules, 2014, we report that:`, { align: 'justify' });
  doc.moveDown(0.2);
  doc.text(`1. The Company does not have any pending litigations which would impact its financial position.`, { align: 'justify' });
  doc.text(`2. The Company did not have any long-term contracts including derivative contracts for which there were any material foreseeable losses.`, { align: 'justify' });
  doc.text(`3. There were no amounts that were required to be transferred to the Investor Education and Protection Fund during the year.`, { align: 'justify' });
  doc.text(`4. A. The Management has represented that, to the best of its knowledge and belief, no funds have been advanced or loaned or invested (either from borrowed funds, share premium or any other sources or kind of funds) by the Company to or in any other person(s) or entity(ies), including foreign entities (“Intermediaries”), with the understanding that the Intermediary shall:`, { align: 'justify', indent: 15 });

  // --- PAGE 5 ---
  doc.addPage();
  doc.text(`a. directly or indirectly lend or invest in other persons or entities identified by or on behalf of the Company (Ultimate Beneficiaries); or`, { align: 'justify', indent: 30 });
  doc.text(`b. provide any guarantee, security, or the like on behalf of the Ultimate Beneficiaries.`, { align: 'justify', indent: 30 });
  doc.moveDown(0.3);
  doc.text(`B. The Management has represented that, to the best of its knowledge and belief, no funds have been received by the Company from any person(s) or entity(ies), including foreign entities (“Funding Parties”), with the understanding that the Company shall:`, { align: 'justify', indent: 15 });
  doc.text(`a. directly or indirectly lend or invest in other persons or entities identified by or on behalf of the Funding Party (Ultimate Beneficiaries); or`, { align: 'justify', indent: 30 });
  doc.text(`b. provide any guarantee, security, or the like on behalf of the Ultimate Beneficiaries.`, { align: 'justify', indent: 30 });
  doc.moveDown(0.3);
  doc.text(`C. Based on the audit procedures performed, nothing has come to our notice that has caused us to believe that the representations under subclauses (a) and (b) contain any material misstatement.`, { align: 'justify', indent: 15 });
  doc.moveDown(2);

  // --- SIGNATURE SECTION ---
  doc.font('Helvetica-Bold').text(`For ${firmDetails.firmName.toUpperCase()}`);
  doc.text("Chartered Accountants");
  doc.text(`Firm Registration No.: ${firmDetails.firmRegistrationNumber}`);
  doc.moveDown(1.5);
  doc.text(firmDetails.proprietorName.toUpperCase());
  doc.font('Helvetica').text("Proprietor");
  doc.text(`Membership No.: ${firmDetails.membershipNumber}`);
  doc.text(`UDIN: ${data.udin || 'N/A'}`);
  doc.text(`Place: Kolkata`);
  doc.text(`Date: ${reportDate}`);

  addFooter();
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
  doc.rect(20, tableTop, 550, 25).fill('#956127'); // Brown/gold header color
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

  // Authorized Signatory with Stamp
  const signatoryX = 400;
  const signatoryY = lastY;
  const signatoryWidth = 150;

  doc.fontSize(10).font('Helvetica-Bold').text('For Kleardocs Solutions', signatoryX, signatoryY, { align: 'center', width: signatoryWidth });

  // Add stamp image
  try {
    const stampPath = new URL('../../../Frontend/src/assets/AuthStamp2.png', import.meta.url).pathname;
    doc.image(stampPath, signatoryX + signatoryWidth / 2 - 50, signatoryY + 20, { width: 100, height: 80 });
  } catch (e) {
    // Fallback: draw placeholder circles if image fails
    const centerX = signatoryX + signatoryWidth / 2;
    const centerY = signatoryY + 60;
    doc.lineWidth(1);
    doc.strokeColor('#b4b4b4');
    doc.circle(centerX, centerY, 45);
    doc.circle(centerX, centerY, 40);
    doc.stroke();
    doc.fillColor(primaryColor).fontSize(7).font('Helvetica-Bold').text('KLEARDOCS SOLUTIONS', centerX, centerY - 5, { align: 'center' });
    doc.fillColor('black');
  }

  doc.fontSize(10).font('Helvetica-Bold').text('Authorized Signatory', signatoryX, signatoryY + 120, { align: 'center', width: signatoryWidth });

  doc.end();
};
