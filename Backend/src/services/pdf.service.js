import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import path from "path";
import puppeteer from "puppeteer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageToBase64 = (filePath) => {
  try {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${Buffer.from(bitmap).toString("base64")}`;
  } catch (e) {
    console.error(`Error converting ${filePath} to base64:`, e);
    return "";
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
  doc.font("Helvetica-Bold").fontSize(10);
  headers.forEach((h, i) => {
    doc.text(
      h,
      50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
      currentY,
    );
  });

  doc
    .moveTo(50, currentY + 15)
    .lineTo(500, currentY + 15)
    .stroke();
  currentY += 20;

  // Rows
  doc.font("Helvetica").fontSize(9);
  rows.forEach((row) => {
    row.forEach((cell, i) => {
      doc.text(
        cell.toString(),
        50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        currentY,
      );
    });
    currentY += 15;
  });

  return currentY;
};

export const generateDirectorReport = (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // Header
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("DIRECTOR'S REPORT", { align: "center" });
  doc.moveDown();

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Company: ${customer.companyName || customer.name}`);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`CIN: ${data.cin || "N/A"}`);
  doc.text(`Place: ${data.place || "Kolkata"}`);
  doc.text(`Date: ${data.reportDate || new Date().toLocaleDateString()}`);
  doc.moveDown();

  doc.text(
    `The Directors take pleasure in presenting the reports of the company for the financial year...`,
  );
  doc.moveDown();

  // Financial Table (Simplified for now)
  const headers = ["Particulars", "Previous Year", "Current Year"];
  const rows = [
    ["Profit before Tax", data.profitTax1 || "0", data.profitTax2 || "0"],
    [
      "Profit after Tax",
      data.profitAfterTax1 || "0",
      data.profitAfterTax2 || "0",
    ],
    ["Gross Revenue", data.grossProfit1 || "0", data.grossProfit2 || "0"],
  ];
  drawTable(doc, headers, rows, doc.y);

  doc.moveDown(2);
  doc.text("For and on behalf of the Board,");
  doc.moveDown(2);
  doc.text("__________________________", { align: "left" });
  doc.text("Director", { align: "left" });

  doc.end();
};

export const generateBoardResolution = async (customer, data, res) => {
  const companyName =
    customer.companyName?.toUpperCase() ||
    customer.name?.toUpperCase() ||
    "COMPANY NAME";

  // Format Address (Address + State)
  const cleanAddress = (customer.address || "ADDRESS NOT PROVIDED")
    .trim()
    .replace(/,\s*$/, "");
  const stateStr = customer.state
    ? `, ${customer.state.trim().toUpperCase()}`
    : "";
  const companyAddress = `${cleanAddress.toUpperCase()}${stateStr}`.replace(
    /\s+/g,
    " ",
  );

  const director =
    customer.directors && customer.directors.length > 0
      ? customer.directors[0]
      : {};
  const directorName = (director.name || "DIRECTOR NAME").toUpperCase();
  const directorDin = director.din || "DIN NOT PROVIDED";

  const dateObj = data.date ? new Date(data.date) : new Date();
  const day = dateObj.getDate();
  const monthIdx = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const paddedDay = day.toString().padStart(2, "0");
  const paddedMonth = (monthIdx + 1).toString().padStart(2, "0");
  const formattedDate = `${paddedDay}/${paddedMonth}/${year}`;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  const ord = s[(v - 20) % 10] || s[v] || s[0];
  const formattedDateWithSuffix = `${paddedDay}${ord} ${months[monthIdx]}, ${year}`;

  const doc = new PDFDocument({ margin: { top: 40, bottom: 40, left: 50, right: 50 } });
  doc.pipe(res);

  // Register Poppins Font
  const fontsPath = path.join(__dirname, "../assets/fonts");
  doc.registerFont("Poppins-Regular", path.join(fontsPath, "Poppins-Regular.ttf"));
  doc.registerFont("Poppins-Bold", path.join(fontsPath, "Poppins-Bold.ttf"));
  doc.registerFont("Poppins-Medium", path.join(fontsPath, "Poppins-Medium.ttf"));

  const blackColor = "#000000";
  const lightBlueColor = "#2F5597";

  // --- Header ---
  doc
    .font("Poppins-Bold")
    .fontSize(16)
    .fillColor(lightBlueColor)
    .text(companyName, { align: "center" });

  doc
    .font("Poppins-Regular")
    .fontSize(11)
    .fillColor(lightBlueColor)
    .text(companyAddress, { align: "center" });

  doc.moveDown(0.2);
  doc.font("Poppins-Regular").fillColor(blackColor).text(" ", { align: "center" });
  doc.moveDown(0.2);

  const certText = `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${companyName} HELD AT ${companyAddress}.`;
  doc.font("Poppins-Bold").fontSize(11).text(certText, { align: "justify", width: 495 });

  doc.moveDown(0.8);

  // --- Title ---
  doc.font("Poppins-Regular").fontSize(11).text("Board Resolution for appointment of first auditor of ", { continued: true });
  doc.font("Poppins-Bold").fontSize(11).text(companyName);

  doc.moveDown(0.8);

  // --- Date ---
  doc.font("Poppins-Regular").fontSize(11).text(`Date: ${formattedDate}`, { align: "left" });

  doc.moveDown(0.8);

  // --- Intro ---
  doc.font("Poppins-Regular").fontSize(11).text("At a meeting of the Board of Directors of ", { continued: true });
  doc.font("Poppins-Bold").fontSize(11).text(companyName + " ", { continued: true });
  doc.font("Poppins-Regular").fontSize(11).text(`held on ${formattedDateWithSuffix}, it was:`);

  doc.moveDown(0.8);

  // --- Body Paragraph 1 ---
  const para1 = `RESOLVED THAT Pursuant to the provisions of section 139 and 142 of the companies Act, 2013 read with Rule 3 of the companies (Audit and Auditors) Rules, 2014 and other applicable provisions of the companies Act, 2013 read with rules made thereunder (including any statutory modification(s) or re-enactment there of for the time being in force) , consent of the Board be and is hereby accorded to appoint Mr. Susanta Kumar Swain, Membership Number - 065257 Firm M/s. BRAHMANANDA & CO. (Firm Registration No- 315153E) as First Auditors of the company to hold office till the conclusion of the First Annual General Meeting of the company, to examine and audit the accounts of the company, on such remuneration as may be mutually agreed upon between ${directorName}, Director of the company and the Auditors.`;
  doc.font("Poppins-Regular").fontSize(11).text(para1, { align: "justify" });

  doc.moveDown(0.8);

  // --- Body Paragraph 2 ---
  const para2 = `RESOLVED FURTHER THAT ${directorName} - Director of the company be and is hereby authorized to do all such acts, deeds and things and execute such other documents as may be necessary for the purpose of giving effect to this resolution.`;
  doc.font("Poppins-Regular").fontSize(11).text(para2, { align: "justify" });

  doc.moveDown(1.0);

  // --- Footer / Signatory ---
  doc.font("Poppins-Bold").fontSize(11).text(directorName, { align: "left" });

  // Big gap for handwritten signature
  doc.moveDown(2.5);

  doc.font("Poppins-Bold").fontSize(11).text("DIRECTOR", { align: "left" });
  doc.font("Poppins-Bold").fontSize(11).text(`DIN: ${directorDin}`, { align: "left" });

  doc.end();
};

export const generateConsentLetter = async (customer, data, res) => {
  // IMMEDIATE DEBUG LOGGING
  console.log("\n\n========== generateConsentLetter CALLED ==========");
  console.log("customer parameter:", customer);
  console.log("customer type:", typeof customer);
  console.log("customer is null:", customer === null);
  console.log("customer is undefined:", customer === undefined);
  console.log(
    "customer keys:",
    customer ? Object.keys(customer) : "NO KEYS - CUSTOMER IS NULL/UNDEFINED",
  );
  console.log("data parameter:", data);
  console.log("====================================================\n\n");

  if (!customer) {
    console.error("ERROR: Customer object is null or undefined!");
    throw new Error("Customer data is missing");
  }

  // ===== SAFE HELPERS FOR DYNAMIC DATA =====

  // Helper 1: Safe text with fallback
  const safeText = (value, fallback = "N/A") => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null" ||
      value === "undefined"
    ) {
      return fallback;
    }
    return String(value).trim();
  };

  // Helper 2: Format date as "15th January, 2026" (with comma)
  const formatDisplayDate = (dateStr) => {
    try {
      if (
        !dateStr ||
        dateStr === "" ||
        dateStr === "N/A" ||
        dateStr === "null" ||
        dateStr === "undefined"
      )
        return null;

      let d;
      // Handle Date objects (including MongoDB Date)
      if (
        dateStr instanceof Date ||
        (typeof dateStr === "object" && typeof dateStr.getTime === "function")
      ) {
        d = dateStr;
      } else {
        d = new Date(dateStr);
      }

      if (isNaN(d.getTime())) return null;
      const day = d.getDate();
      const month = d.toLocaleString("en-IN", { month: "long" });
      const year = d.getFullYear();
      const s = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = s[(v - 20) % 10] || s[v] || s[0];
      return `${day}${ord} ${month}, ${year}`;
    } catch (e) {
      console.error("Error in formatDisplayDate:", e);
      return null;
    }
  };

  // Helper 3: Format date as "15/01/2026" (slash format)
  const formatSlashDate = (dateStr) => {
    try {
      if (
        !dateStr ||
        dateStr === "" ||
        dateStr === "N/A" ||
        dateStr === "null" ||
        dateStr === "undefined"
      )
        return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return null;
    }
  };

  // Helper 3: Parse DD/MM/YYYY format safely
  const parseDDMMYYYY = (dateStr) => {
    try {
      if (!dateStr || typeof dateStr !== "string") return null;

      const trimmed = dateStr.trim();
      if (!trimmed.includes("/")) return null;

      const parts = trimmed.split("/");
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      const year = parseInt(parts[2], 10);

      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
      if (month < 0 || month > 11) return null;
      if (day < 1 || day > 31) return null;
      if (year < 1900 || year > 2100) return null;

      const date = new Date(year, month, day);

      // Validate the date was created correctly
      if (
        date.getDate() !== day ||
        date.getMonth() !== month ||
        date.getFullYear() !== year
      ) {
        return null;
      }

      return date;
    } catch (e) {
      return null;
    }
  };

  // Helper 4: Format date as ordinal "01st January 2026" (no comma)
  const formatOrdinalDate = (dateObj) => {
    try {
      // Check for valid Date object (including MongoDB Date)
      if (!dateObj) return null;

      // Check if it's a Date-like object (has getTime method)
      const isDateLike =
        dateObj instanceof Date ||
        (typeof dateObj === "object" && typeof dateObj.getTime === "function");
      if (!isDateLike) return null;

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) return null;

      const day = dateObj.getDate();
      const month = dateObj.toLocaleString("en-IN", { month: "long" });
      const year = dateObj.getFullYear();
      const s = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = s[(v - 20) % 10] || s[v] || s[0];

      // Format: "06th January 2026"
      const paddedDay = day.toString().padStart(2, "0");
      return `${paddedDay}${ord} ${month} ${year}`;
    } catch (e) {
      console.error("formatOrdinalDate - Error:", e);
      return null;
    }
  };

  // Helper 5: Format incorporation date for display
  const formatIncorporationDisplay = (dateStr) => {
    try {
      console.log(
        "formatIncorporationDisplay - Input:",
        dateStr,
        "Type:",
        typeof dateStr,
      );
      console.log(
        "formatIncorporationDisplay - Is Date?:",
        dateStr instanceof Date,
      );
      console.log(
        "formatIncorporationDisplay - Has getTime?:",
        typeof dateStr?.getTime === "function",
      );

      if (
        !dateStr ||
        dateStr === "" ||
        dateStr === "N/A" ||
        dateStr === "null" ||
        dateStr === "undefined"
      ) {
        console.log("formatIncorporationDisplay - Empty/null value");
        return null;
      }

      let dateObj;

      // If it's already a Date object OR MongoDB Date object (has getTime method)
      if (
        dateStr instanceof Date ||
        (typeof dateStr === "object" && typeof dateStr.getTime === "function")
      ) {
        dateObj = dateStr;
        console.log(
          "formatIncorporationDisplay - Already a Date object (or MongoDB Date)",
        );
      }
      // If it's a string in DD/MM/YYYY format
      else if (typeof dateStr === "string" && dateStr.includes("/")) {
        dateObj = parseDDMMYYYY(dateStr);
        console.log("formatIncorporationDisplay - Parsed DD/MM/YYYY");
      }
      // If it's an ISO string or timestamp
      else {
        dateObj = new Date(dateStr);
        console.log("formatIncorporationDisplay - Parsed as generic date");
      }

      console.log("formatIncorporationDisplay - Parsed dateObj:", dateObj);
      console.log(
        "formatIncorporationDisplay - dateObj.getTime():",
        dateObj?.getTime(),
      );
      console.log(
        "formatIncorporationDisplay - Is NaN?:",
        dateObj ? isNaN(dateObj.getTime()) : "N/A",
      );

      if (!dateObj || isNaN(dateObj.getTime())) {
        console.log("formatIncorporationDisplay - Invalid date after parsing");
        return null;
      }

      const result = formatOrdinalDate(dateObj);
      console.log("formatIncorporationDisplay - Result:", result);
      return result;
    } catch (e) {
      console.error("formatIncorporationDisplay - Error:", e);
      return null;
    }
  };

  // Helper 6: Get incorporation date from customer object
  const getCustomerIncorporationDate = (customer) => {
    try {
      console.log("\n--- getCustomerIncorporationDate DEBUG ---");
      console.log("All customer keys:", Object.keys(customer));
      console.log("Customer type:", typeof customer);
      console.log("Is array:", Array.isArray(customer));

      // Try all possible field names in priority order
      const possibleFields = [
        "incorporationDate",
        "dateOfIncorporation",
        "incorporation_date",
        "date_of_incorporation",
        "incorporatedOn",
        "incorporation",
        "companyIncorporationDate",
        "incorporation_date_time",
        "date_of_incorp",
      ];

      for (const field of possibleFields) {
        const value = customer[field];
        console.log(`Checking field '${field}':`, value, "Type:", typeof value);

        // Check if value is valid (not null, undefined, or empty string)
        if (value !== undefined && value !== null && value !== "") {
          console.log(`✓ FOUND incorporation date in field '${field}':`, value);
          console.log("--- END DEBUG ---\n");
          return value;
        }
      }

      // Check if it's nested in another object
      if (customer.company && customer.company.incorporationDate) {
        console.log(
          "✓ FOUND in customer.company.incorporationDate:",
          customer.company.incorporationDate,
        );
        console.log("--- END DEBUG ---\n");
        return customer.company.incorporationDate;
      }

      if (customer.details && customer.details.incorporationDate) {
        console.log(
          "✓ FOUND in customer.details.incorporationDate:",
          customer.details.incorporationDate,
        );
        console.log("--- END DEBUG ---\n");
        return customer.details.incorporationDate;
      }

      console.log("✗ NO incorporation date found in ANY field");
      console.log("Customer object summary:", {
        _id: customer._id,
        companyName: customer.companyName,
        name: customer.name,
        hasIncorporationDate: !!customer.incorporationDate,
        incorporationDateValue: customer.incorporationDate,
      });
      console.log("--- END DEBUG ---\n");
      return null;
    } catch (e) {
      console.error("getCustomerIncorporationDate - Error:", e);
      return null;
    }
  };

  // Helper 7: Calculate financial year end from incorporation date
  const getFinancialYearEndFromIncorporation = (dateStr) => {
    try {
      console.log("getFinancialYearEndFromIncorporation - Input:", dateStr);

      if (!dateStr) {
        // Fallback to current date
        const now = new Date();
        const fyEndYear =
          now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
        const result = `31st March ${fyEndYear}`;
        console.log(
          "getFinancialYearEndFromIncorporation - Fallback result:",
          result,
        );
        return result;
      }

      // Parse the date
      let incDate;
      if (
        dateStr instanceof Date ||
        (typeof dateStr === "object" && typeof dateStr.getTime === "function")
      ) {
        incDate = dateStr;
        console.log(
          "getFinancialYearEndFromIncorporation - Using Date object directly",
        );
      } else if (typeof dateStr === "string" && dateStr.includes("/")) {
        incDate = parseDDMMYYYY(dateStr);
        console.log("getFinancialYearEndFromIncorporation - Parsed DD/MM/YYYY");
      } else {
        incDate = new Date(dateStr);
        console.log(
          "getFinancialYearEndFromIncorporation - Parsed as generic date",
        );
      }

      if (!incDate || isNaN(incDate.getTime())) {
        const now = new Date();
        const fyEndYear =
          now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
        const result = `31st March ${fyEndYear}`;
        console.log(
          "getFinancialYearEndFromIncorporation - Invalid date, fallback:",
          result,
        );
        return result;
      }

      const incYear = incDate.getFullYear();
      const incMonth = incDate.getMonth(); // 0=Jan, 1=Feb, 2=Mar, 3=Apr

      let fyEndYear;

      if (incMonth >= 3) {
        // April (3) to December (11): FY ends March 31 of NEXT year
        fyEndYear = incYear + 1;
      } else {
        // January (0) to March (2): FY ends March 31 of SAME year
        fyEndYear = incYear;
      }

      const result = `31st March ${fyEndYear}`;
      console.log(
        "getFinancialYearEndFromIncorporation - Calculated result:",
        result,
        "(Incorporation month:",
        incMonth + 1 + "/" + incDate.getFullYear() + ")",
      );
      return result;
    } catch (e) {
      console.error("getFinancialYearEndFromIncorporation - Error:", e);
      const now = new Date();
      const fyEndYear =
        now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
      return `31st March ${fyEndYear}`;
    }
  };

  // ===== EXTRACT DYNAMIC COMPANY DATA =====

  // IMPORTANT: Use exact legal name without transformation
  const companyName = safeText(
    customer.companyName ||
      customer.legalName ||
      customer.name ||
      customer.businessName ||
      "COMPANY NAME",
  );

  // IMPORTANT: Use full registered address without transformation
  const companyAddress = safeText(
    customer.address ||
      customer.registeredAddress ||
      customer.registeredOfficeAddress ||
      customer.fullAddress ||
      "Address N/A",
  );

  // IMPORTANT: Get incorporation date using helper
  const incorporationDateRaw = getCustomerIncorporationDate(customer);

  // Format incorporation date
  const incorporationDateFormatted =
    formatIncorporationDisplay(incorporationDateRaw);
  const incorporationDateDisplay = incorporationDateFormatted || "N/A";

  console.log("===== INCORPORATION DATE DEBUG =====");
  console.log("Raw incorporation date:", incorporationDateRaw);
  console.log("Formatted incorporation date:", incorporationDateFormatted);
  console.log("Display incorporation date:", incorporationDateDisplay);

  // Calculate financial year end based on incorporation date
  const financialYearEndLabel =
    getFinancialYearEndFromIncorporation(incorporationDateRaw);

  console.log("Financial year end:", financialYearEndLabel);
  console.log("====================================");

  // Dynamic letter date and signature date based on data.date or current date
  const inputDate = data.date ? new Date(data.date) : new Date();
  const formattedLetterDate = formatDisplayDate(inputDate) || "14th May, 2026";
  const fixedSignDate = formatSlashDate(inputDate) || "14/05/2026";

  // Load images from assets folder
  const assetsPath = path.join(__dirname, "../assets/consent-letter/");
  const logoPath = path.join(assetsPath, "CA-title image.png");
  const signaturePath = path.join(assetsPath, "Signature.png");
  const stampPath = path.join(assetsPath, "DDCA.png");

  // Create PDF using PDFKit with images - Single Page Layout (Reference: Screenshot 1)
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  const blackColor = "#000000";
  const footerColor = "#2F5597";
  let currentY = 50;

  // --- Header with Logo ---
  try {
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, currentY, { width: 60, height: 50 });
      doc
        .font("Times-Bold")
        .fontSize(14)
        .fillColor(blackColor)
        .text("BRAHMANADA & CO.", 120, currentY + 8);
      doc
        .font("Times-Bold")
        .fontSize(11)
        .text("CHARTERED ACCOUNTANTS", 120, currentY + 28);
      currentY += 70;
    } else {
      doc
        .font("Times-Bold")
        .fontSize(16)
        .fillColor(blackColor)
        .text("BRAHMANADA & CO.", { align: "center" });
      doc
        .font("Times-Bold")
        .fontSize(12)
        .text("CHARTERED ACCOUNTANTS", { align: "center" });
      currentY = doc.y + 25;
    }
  } catch (err) {
    console.error("Error loading logo:", err);
    doc
      .font("Times-Bold")
      .fontSize(16)
      .fillColor(blackColor)
      .text("BRAHMANADA & CO.", { align: "center" });
    doc
      .font("Times-Bold")
      .fontSize(12)
      .text("CHARTERED ACCOUNTANTS", { align: "center" });
    currentY = doc.y + 25;
  }

  // --- Recipient Block ---
  doc
    .font("Times-Bold")
    .fontSize(10.5)
    .fillColor(blackColor)
    .text("TO,", 50, currentY);
  doc.text("THE BOARD OF DIRECTORS", 50, doc.y);
  doc.text(companyName, 50, doc.y);
  doc.font("Times-Roman").text(companyAddress, 50, doc.y);

  // Separator Pipe line as seen in Screenshot 2
  doc.moveDown(0.5);
  doc.text(" ", 50, doc.y);
  doc.moveDown(0.2);
  currentY = doc.y;

  // --- Date Line ---
  doc
    .font("Times-Roman")
    .fontSize(10.5)
    .text(`Date: ${formattedLetterDate}`, 50, currentY);
  currentY += 18;

  // --- Subject Line ---
  // Precise Bold for "Subject:"
  doc.font("Times-Bold").text("Subject: ", 50, currentY, { continued: true });
  doc
    .font("Times-Roman")
    .text(
      "Consent to act as First Auditor and Certificate under Section 139(6) of the Companies Act, 2013.",
      { align: "justify" },
    );
  currentY = doc.y + 14;

  // --- Salutation ---
  doc.font("Times-Roman").text("Dear Sir/Madam,", 50, currentY);
  currentY += 14;

  // --- Body Paragraph 1 ---
  doc.font("Times-Roman").lineGap(3);
  doc.text("We, ", 50, currentY, { continued: true, width: 510 });
  doc.font("Times-Bold").text("M/s. BRAHMANADA & CO.", { continued: true });
  doc
    .font("Times-Roman")
    .text(
      ", Chartered Accountants, hereby give our consent to be appointed as the ",
      { continued: true },
    );
  doc.font("Times-Bold").text("First Auditor", { continued: true });
  doc.font("Times-Roman").text(" of ", { continued: true });
  doc.font("Times-Bold").text(companyName, { continued: true });
  doc.font("Times-Roman").text(" under ", { continued: true });
  doc.font("Times-Bold").text("Section 139(6)", { continued: true });
  doc
    .font("Times-Roman")
    .text(
      " of the Companies Act, 2013, for the financial year commencing from ",
      { continued: true },
    );
  doc.font("Times-Bold").text(incorporationDateDisplay, { continued: true });

  if (incorporationDateFormatted) {
    doc
      .font("Times-Roman")
      .text(" (Date of Incorporation)", { continued: true });
  }

  doc.font("Times-Roman").text(" to ", { continued: true });
  doc.font("Times-Bold").text(financialYearEndLabel, { continued: true });
  doc.font("Times-Roman").text(".", { align: "justify", width: 510 });
  currentY = doc.y + 18;

  // --- Body Paragraph 2 ---
  doc
    .font("Times-Roman")
    .fontSize(10.5)
    .text("Further, pursuant to the provisions of ", 50, currentY, {
      continued: true,
      width: 510,
    });
  doc.font("Times-Bold").text("Section 139(6)", { continued: true });
  doc.font("Times-Roman").text(" and ", { continued: true });
  doc.font("Times-Bold").text("Rule 4", { continued: true });
  doc.font("Times-Roman").text(" of the ", { continued: true });
  doc
    .font("Times-Bold")
    .text("Companies (Audit and Auditors) Rules, 2014", { continued: true });
  doc
    .font("Times-Roman")
    .text(", we hereby certify that:", { align: "justify", width: 510 });
  currentY = doc.y + 12;

  // --- Declarations (Proper List Rendering with Indentation for Wraps) ---
  const declarations = [
    {
      normal: "We satisfy the eligibility criteria as specified under ",
      bold: "Section 141",
      normalEnd: " of the Companies Act, 2013;",
    },
    {
      normal:
        "We are not disqualified from being appointed as Auditor under the provisions of the ",
      bold: "Companies Act, 2013",
      normalMid: ", the ",
      bold2: "Chartered Accountants Act, 1949",
      normalEnd: ", and the rules or regulations made thereunder;",
    },
    {
      normal:
        "The proposed appointment is in accordance with the provisions of the ",
      bold: "Companies Act, 2013",
      normalEnd: ";",
    },
    {
      normal:
        "The proposed appointment is within the limits laid down under the Act;",
    },
    {
      normal:
        "There are no pending proceedings relating to professional misconduct against the firm or any of its partners under the ",
      bold: "Chartered Accountants Act, 1949",
      normalEnd: ".",
    },
  ];

  declarations.forEach((decl, index) => {
    const number = `${index + 1}. `;
    const numWidth = 25;
    const bodyWidth = 485;

    // Draw number at margin
    doc.font("Times-Roman").text(number, 50, currentY, { width: numWidth });

    // Draw body text indented
    const bodyX = 50 + numWidth;
    let textY = currentY;

    doc
      .font("Times-Roman")
      .text(decl.normal, bodyX, textY, {
        continued: !!decl.bold,
        width: bodyWidth,
        align: "justify",
      });
    if (decl.bold) {
      doc.font("Times-Bold").text(decl.bold, { continued: true });
      if (decl.normalMid) {
        doc.font("Times-Roman").text(decl.normalMid, { continued: true });
        doc.font("Times-Bold").text(decl.bold2, { continued: true });
      }
      doc.font("Times-Roman").text(decl.normalEnd, { align: "justify" });
    }

    // Update Y based on the rendered body height plus some spacing
    currentY = doc.y + 8;
  });

  currentY += 12;

  // --- Closing Request ---
  doc
    .font("Times-Roman")
    .text(
      "We request you to kindly take the above on record and do the needful.",
      50,
      currentY,
      { align: "justify", width: 510 },
    );
  currentY = doc.y + 18;

  // --- Closing ---
  doc.text("Thanking You,", 50, currentY);
  doc.text("Yours faithfully,", 50, doc.y);
  currentY = doc.y + 18;

  // --- Signatory Section ---
  doc
    .font("Times-Bold")
    .fontSize(11)
    .text("For BRAHMANADA & CO.", 50, currentY);
  doc.font("Times-Roman").text("Chartered Accountants", 50, doc.y);
  currentY = doc.y + 8;

  // --- Signature and Stamp Images - Larger sizes ---
  const signatureY = currentY;
  try {
    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, 50, signatureY, { width: 100 });
    }

    if (fs.existsSync(stampPath)) {
      doc.image(stampPath, 170, signatureY - 5, { width: 80 });
    }
  } catch (err) {
    console.error("Error loading signature/stamp:", err);
  }
  currentY += 60;

  // --- Partner Details ---
  // NORMAL: "FRN: 315153E"
  // BOLD: "CA SUSANTA KUMAR SWAIN"
  // NORMAL: Rest of details
  // FIXED DATE: Dynamic from board resolution date
  doc.font("Times-Roman").fontSize(10).text("FRN: 315153E", 50, currentY);
  doc.font("Times-Bold").text("CA SUSANTA KUMAR SWAIN", 50, doc.y);
  doc.font("Times-Roman").text("Partner", 50, doc.y);
  doc.text("Membership No: 065257", 50, doc.y);
  doc.text(`Place: Bhubaneswar`, 50, doc.y);
  doc.text(`Date: ${fixedSignDate}`, 50, doc.y);

  // --- Footer (at bottom of page) - Larger font, centered ---
  // NORMAL: All text (blue color)
  doc
    .fontSize(10)
    .fillColor(footerColor)
    .text(
      "PLOT NO. 119, MADHUSUDAN NAGAR, UNIT-IV, BHUBANESWAR – 751001, ODISHA",
      50,
      780,
      { align: "center", width: 510 },
    );

  doc.end();
};

export const generateAuditorsReport = async (customer, data, res) => {
  const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
  doc.pipe(res);

  // Fetch Firm Details from SystemSetting
  let firmDetails = {
    firmName: "M/s. JAGJYOT SINGH AND ASSOCIATES.",
    firmRegistrationNumber: "333567E",
    firmAddress:
      "PLOT 51, BLOCK BB – 102, SHANTIPALLY, SARAT PARK, KOLKATA – 700107",
    proprietorName: "CA Jagjyot Singh",
    membershipNumber: "319799",
  };

  try {
    const { default: SystemSetting } =
      await import("../models/SystemSetting.model.js");
    const settings = await SystemSetting.findOne();
    if (settings) {
      firmDetails = {
        firmName: settings.firmName || firmDetails.firmName,
        firmRegistrationNumber:
          settings.firmRegistrationNumber || firmDetails.firmRegistrationNumber,
        firmAddress: settings.firmAddress || firmDetails.firmAddress,
        proprietorName: settings.proprietorName || firmDetails.proprietorName,
        membershipNumber:
          settings.membershipNumber || firmDetails.membershipNumber,
      };
    }
  } catch (e) {
    console.error("Error fetching firm settings:", e);
  }

  const reportDate = data.date
    ? new Date(data.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  const financialYearEnd = "31st March 2025"; // Can be dynamic based on data.financialYear if needed

  const addFooter = () => {
    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("#4b5563")
        .font("Helvetica")
        .text(firmDetails.firmName, 50, 780, { align: "center", width: 500 });
      doc.text(
        `Firm Registration No. - ${firmDetails.firmRegistrationNumber}`,
        50,
        790,
        { align: "center", width: 500 },
      );
      doc.text(firmDetails.firmAddress, 50, 800, {
        align: "center",
        width: 500,
      });
    }
  };

  // --- PAGE 1 ---
  doc
    .fillColor("black")
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("INDEPENDENT AUDITOR'S REPORT", { align: "center" });
  doc.moveDown();
  doc.fontSize(11).text("To the Members of");
  doc.text(customer.companyName?.toUpperCase() || customer.name?.toUpperCase());
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`CIN: ${data.cin || customer.cin || "N/A"}`);
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text("Report on the Audit of the Financial Statements");
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").text("Opinion");
  doc
    .font("Helvetica")
    .text(
      `We have audited the accompanying financial statements of ${customer.companyName || customer.name} (“the Company”), which comprise the Balance Sheet as at ${financialYearEnd}, the Statement of Profit and Loss, the Statement of Changes in Equity, and the Cash Flow Statement for the year then ended, and a summary of the significant accounting policies and other explanatory information (collectively referred to as "the financial statements").`,
      { align: "justify" },
    );
  doc.moveDown(0.5);
  doc.text(
    `In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give the information required by the Companies Act, 2013 (“the Act”) in the manner so required and give a true and fair view in conformity with the accounting principles generally accepted in India, of the state of affairs of the Company as at ${financialYearEnd}, its profit, changes in equity, and its cash flows for the year then ended.`,
    { align: "justify" },
  );
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Basis for Opinion");
  doc
    .font("Helvetica")
    .text(
      `We conducted our audit in accordance with the Standards on Auditing (SAs) specified under Section 143(10) of the Act. We are independent of the Company in accordance with the Code of Ethics issued by the Institute of Chartered Accountants of India (ICAI), and we have fulfilled our other ethical responsibilities in accordance with these requirements and the ICAI’s Code of Ethics.`,
      { align: "justify" },
    );
  doc.moveDown(0.5);
  doc.text(
    `We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our audit opinion.`,
    { align: "justify" },
  );
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text(
      "Information Other than the Financial Statements and Auditor’s Report Thereon",
    );
  doc
    .font("Helvetica")
    .text(
      `The Company’s management and Board of Directors are responsible for the preparation of other information. The other information comprises the Board’s Report and its annexures, but does not include the financial statements and our auditor’s report thereon.`,
      { align: "justify" },
    );

  // --- PAGE 2 ---
  doc.addPage();
  doc
    .font("Helvetica")
    .text(
      `Our opinion does not cover the other information and we do not express any form of assurance conclusion thereon. In connection with our audit of the financial statements, our responsibility is to read the other information and, in doing so, consider whether such information is materially inconsistent with the financial statements or our knowledge obtained in the audit. Based on the work performed, nothing has come to our attention that causes us to believe that there is a material misstatement of this other information.`,
      { align: "justify" },
    );
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text("Management’s Responsibility for the Financial Statements");
  doc
    .font("Helvetica")
    .text(
      `The Company’s Board of Directors is responsible for the matters stated in Section 134(5) of the Act with respect to the preparation of these financial statements that give a true and fair view of the financial position, financial performance, changes in equity, and cash flows of the Company in accordance with the accounting principles generally accepted in India, including the Accounting Standards specified under Section 133 of the Act.`,
      { align: "justify" },
    );
  doc.moveDown(0.5);
  doc.text(
    `This responsibility includes the maintenance of adequate accounting records in accordance with the provisions of the Act for safeguarding the assets of the Company and for preventing and detecting frauds and other irregularities; the selection and application of appropriate accounting policies; making judgments and estimates that are reasonable and prudent; and the design, implementation, and maintenance of adequate internal financial controls that were operating effectively for ensuring the accuracy and completeness of the accounting records relevant to the preparation and presentation of the financial statements.`,
    { align: "justify" },
  );
  doc.moveDown(0.5);
  doc.text(
    `In preparing the financial statements, management is responsible for assessing the Company’s ability to continue as a going concern, disclosing, as applicable, matters related to going concern and using the going concern basis of accounting unless management either intends to liquidate the Company or to cease operations, or has no realistic alternative but to do so.`,
    { align: "justify" },
  );
  doc.moveDown();
  doc.text(
    `The Board of Directors is also responsible for overseeing the Company’s financial reporting process.`,
    { align: "justify" },
  );
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text(
      "Auditor’s Responsibilities for the Audit of the Financial Statements",
    );
  doc
    .font("Helvetica")
    .text(
      `Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from material misstatement, whether due to fraud or error, and to issue an auditor’s report that includes our opinion. Reasonable assurance is a high level of assurance but is not a guarantee that an audit conducted in accordance with SAs will always detect a material misstatement when it exists.`,
      { align: "justify" },
    );

  // --- PAGE 3 ---
  doc.addPage();
  doc.text("As part of an audit in accordance with SAs, we:");
  doc.list(
    [
      "Identify and assess the risks of material misstatement, whether due to fraud or error;",
      "Obtain an understanding of internal controls and assess their effectiveness;",
      "Evaluate the appropriateness of accounting policies used and the reasonableness of accounting estimates;",
      "Conclude on the appropriateness of the going concern assumption;",
      "Evaluate the overall presentation of the financial statements.",
    ],
    { bulletRadius: 2, textIndent: 20 },
  );
  doc.moveDown();

  doc.text(
    `We communicate with those charged with governance regarding, among other matters, the planned scope and timing of the audit and significant audit findings, including any significant deficiencies in internal control that we identify during our audit.`,
    { align: "justify" },
  );
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Emphasis of Matter");
  doc
    .font("Helvetica")
    .text(
      `We draw attention to the fact that no matters have been observed during the course of the audit that require emphasis. Hence, no Emphasis of Matter is reported.`,
      { align: "justify" },
    );
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Key Audit Matters");
  doc
    .font("Helvetica")
    .text(
      `In our professional judgment, no Key Audit Matters need to be communicated in this report as per SA 701, “Communicating Key Audit Matters in the Independent Auditor’s Report”.`,
      { align: "justify" },
    );
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Reporting on Internal Financial Controls");
  doc
    .font("Helvetica")
    .text(
      `We have audited the internal financial controls over financial reporting of the Company as of ${financialYearEnd} in conjunction with our audit of the financial statements.`,
      { align: "justify" },
    );
  doc.moveDown(0.5);
  doc.text(
    `In our opinion, the Company has, in all material respects, an adequate internal financial control system over financial reporting and such internal financial controls were operating effectively as at ${financialYearEnd}, based on the internal control criteria established by the Company considering the essential components of internal control stated in the Guidance Note on Audit of Internal Financial Controls Over Financial Reporting issued by the ICAI.`,
    { align: "justify" },
  );

  // --- PAGE 4 ---
  doc.addPage();
  doc.font("Helvetica-Bold").text("Other Legal and Regulatory Requirements");
  doc
    .font("Helvetica")
    .text(
      `1. As required by the Companies (Auditor’s Report) Order, 2020 (“the Order”), issued by the Central Government of India in terms of Section 143(11) of the Act, we give in “Annexure A” a statement on the matters specified in paragraphs 3 and 4 of the Order, to the extent applicable.`,
      { align: "justify" },
    );
  doc.moveDown(0.5);
  doc.text(`2. As required by Section 143(3) of the Act, we report that:`, {
    align: "justify",
  });
  doc.moveDown(0.2);
  const requirements = [
    "We have obtained all the information and explanations which to the best of our knowledge and belief were necessary for the purposes of our audit;",
    "In our opinion, proper books of account as required by law have been kept by the Company so far as it appears from our examination of those books;",
    "The Balance Sheet, the Statement of Profit and Loss, the Statement of Changes in Equity, and the Cash Flow Statement dealt with by this report are in agreement with the books of account;",
    "In our opinion, the aforesaid financial statements comply with the Accounting Standards specified under Section 133 of the Act, read with Rule 7 of the Companies (Accounts) Rules, 2014;",
    "On the basis of written representations received from the directors as on 31st March 2025, none of the directors is disqualified as on that date from being appointed as a director in terms of Section 164(2) of the Act.",
  ];
  requirements.forEach((req, i) => {
    const y = doc.y;
    doc.text(`${String.fromCharCode(65 + i)}.`, 70, y, { width: 20 });
    doc.text(req, 90, y, { width: 450, align: "justify" });
    doc.moveDown(0.3);
  });
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text(
      "Other Matters as per Rule 11 of Companies (Audit and Auditors) Rules, 2014",
    );
  doc
    .font("Helvetica")
    .text(
      `Pursuant to Rule 11 of the Companies (Audit and Auditors) Rules, 2014, we report that:`,
      { align: "justify" },
    );
  doc.moveDown(0.2);
  doc.text(
    `1. The Company does not have any pending litigations which would impact its financial position.`,
    { align: "justify" },
  );
  doc.text(
    `2. The Company did not have any long-term contracts including derivative contracts for which there were any material foreseeable losses.`,
    { align: "justify" },
  );
  doc.text(
    `3. There were no amounts that were required to be transferred to the Investor Education and Protection Fund during the year.`,
    { align: "justify" },
  );
  doc.text(
    `4. A. The Management has represented that, to the best of its knowledge and belief, no funds have been advanced or loaned or invested (either from borrowed funds, share premium or any other sources or kind of funds) by the Company to or in any other person(s) or entity(ies), including foreign entities (“Intermediaries”), with the understanding that the Intermediary shall:`,
    { align: "justify", indent: 15 },
  );

  // --- PAGE 5 ---
  doc.addPage();
  doc.text(
    `a. directly or indirectly lend or invest in other persons or entities identified by or on behalf of the Company (Ultimate Beneficiaries); or`,
    { align: "justify", indent: 30 },
  );
  doc.text(
    `b. provide any guarantee, security, or the like on behalf of the Ultimate Beneficiaries.`,
    { align: "justify", indent: 30 },
  );
  doc.moveDown(0.3);
  doc.text(
    `B. The Management has represented that, to the best of its knowledge and belief, no funds have been received by the Company from any person(s) or entity(ies), including foreign entities (“Funding Parties”), with the understanding that the Company shall:`,
    { align: "justify", indent: 15 },
  );
  doc.text(
    `a. directly or indirectly lend or invest in other persons or entities identified by or on behalf of the Funding Party (Ultimate Beneficiaries); or`,
    { align: "justify", indent: 30 },
  );
  doc.text(
    `b. provide any guarantee, security, or the like on behalf of the Ultimate Beneficiaries.`,
    { align: "justify", indent: 30 },
  );
  doc.moveDown(0.3);
  doc.text(
    `C. Based on the audit procedures performed, nothing has come to our notice that has caused us to believe that the representations under subclauses (a) and (b) contain any material misstatement.`,
    { align: "justify", indent: 15 },
  );
  doc.moveDown(2);

  // --- SIGNATURE SECTION ---
  doc.font("Helvetica-Bold").text(`For ${firmDetails.firmName.toUpperCase()}`);
  doc.text("Chartered Accountants");
  doc.text(`Firm Registration No.: ${firmDetails.firmRegistrationNumber}`);
  doc.moveDown(1.5);
  doc.text(firmDetails.proprietorName.toUpperCase());
  doc.font("Helvetica").text("Proprietor");
  doc.text(`Membership No.: ${firmDetails.membershipNumber}`);
  doc.text(`UDIN: ${data.udin || "N/A"}`);
  doc.text(`Place: Kolkata`);
  doc.text(`Date: ${reportDate}`);

  addFooter();
  doc.end();
};

const a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
const b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function numberToWords(num) {
  if ((num = num.toString()).length > 9) return "overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
      : "";
  return str.trim().toUpperCase() + " RUPEES ONLY";
}

export const generateInvoicePdf = (invoice, customer, res) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const primaryColor = "#D4A96B"; // Define the brown/gold color for fallback stamp
  const docDescription =
    invoice.description ||
    invoice.notes ||
    invoice.remark ||
    invoice.remarks ||
    "—";
  doc.pipe(res);

  // Tax Invoice Title
  if (invoice.totalGst > 0) {
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Tax Invoice", 0, 10, { align: "center", width: doc.page.width });
  }

  // Logo box (Black)
  doc.rect(20, 20, 160, 90).fill("black");
  doc
    .fillColor("white")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("KLEARDOCS", 35, 55);

  // Reset for other text
  doc.fillColor("black");

  // Company Info (Top Right)
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Kleardocs Solutions Private Limited", 300, 30, { align: "right" });
  doc
    .fontSize(8)
    .font("Helvetica")
    .text("Phone: +91 98755 15290 | Email: info@kleardocs.com", 300, 50, {
      align: "right",
    });
  doc.text("465, VIP Nagar, Hastings Colony,", 300, 62, { align: "right" });
  doc.text("Near VIP Bazar Metro Station, Kolkata - 700100", 300, 74, {
    align: "right",
  });
  doc.text("CIN: U69200WB2025PTC278630 | PAN: AALCK7855M", 300, 86, {
    align: "right",
  });

  doc.moveDown(4);
  doc.moveTo(20, 120).lineTo(570, 120).stroke();

  // Invoice Details & Bill To
  let y = 140;
  doc.fontSize(10).font("Helvetica-Bold").text("Bill To:", 50, y);
  doc.fontSize(10).font("Helvetica-Bold").text("Invoice Details:", 350, y);

  y += 18;
  doc.font("Helvetica").fontSize(9);
  doc.text(customer.companyName || customer.name || "N/A", 50, y, {
    fontStyle: "bold",
  });
  doc.text(`Invoice No: ${invoice.invoiceNo}`, 350, y);

  y += 12;
  doc.text(customer.address || "N/A", 50, y, { width: 250 });
  doc.text(
    `Date: ${new Date(invoice.invoiceDate).toLocaleDateString("en-GB")}`,
    350,
    y,
  );

  y += 12;
  doc.text(`Phone: ${customer.phone || "N/A"}`, 50, y);
  doc.text(`Place of Supply: ${invoice.placeOfSupply || "N/A"}`, 350, y);

  // Table Container
  const tableTop = 230;
  doc.rect(20, tableTop, 550, 450).stroke(); // Main table border

  // Table Header
  doc.rect(20, tableTop, 550, 25).fill("#956127"); // Brown/gold header color
  doc.fillColor("black").font("Helvetica-Bold").fontSize(9);
  doc.text("#", 30, tableTop + 8);
  doc.text("Description", 60, tableTop + 8);
  doc.text("HSN/SAC", 320, tableTop + 8);
  doc.text("Price", 420, tableTop + 8, { align: "right", width: 60 });
  doc.text("Amount", 500, tableTop + 8, { align: "right", width: 60 });

  doc
    .moveTo(20, tableTop + 25)
    .lineTo(570, tableTop + 25)
    .stroke();

  // Rows
  let itemY = tableTop + 35;
  doc.font("Helvetica").fontSize(8);
  invoice.items.forEach((item, i) => {
    doc.text((i + 1).toString(), 30, itemY);
    doc.text(item.service?.name || item.description, 60, itemY, { width: 250 });
    doc.text(item.hsn || "998399", 320, itemY);
    doc.text(item.price.toFixed(2), 420, itemY, { align: "right", width: 60 });
    doc.text(item.amount.toFixed(2), 500, itemY, { align: "right", width: 60 });

    // Draw row line (optional, but keep it clean)
    // doc.moveTo(20, itemY + 15).lineTo(570, itemY + 15).stroke();
    itemY += 20;
  });

  // Footer / Totals region
  const footerY = 550;
  doc.moveTo(20, footerY).lineTo(570, footerY).stroke();

  // Amounts in words & Description Table (Simulated)
  const boxTop = footerY + 10;
  const boxLeft = 20;
  const col1Width = 320;
  const col2Width = 230;
  const boxHeight = 40;

  // Header Box
  doc.rect(boxLeft, boxTop, 550, 15).fill("#D4A96B");
  doc.fillColor("black").font("Helvetica-Bold").fontSize(8);
  doc.text("Invoice Amount In Words", boxLeft + 5, boxTop + 4, {
    width: col1Width - 10,
  });
  doc.text("Description", boxLeft + col1Width + 5, boxTop + 4, {
    width: col2Width - 10,
  });

  // Body Box
  doc.rect(boxLeft, boxTop + 15, 550, boxHeight).stroke();
  doc
    .moveTo(boxLeft + col1Width, boxTop)
    .lineTo(boxLeft + col1Width, boxTop + 15 + boxHeight)
    .stroke();

  doc.font("Helvetica").fontSize(8);
  doc.text(
    numberToWords(Math.round(invoice.total || 0)),
    boxLeft + 5,
    boxTop + 20,
    { width: col1Width - 10 },
  );
  doc.text(docDescription, boxLeft + col1Width + 5, boxTop + 20, {
    width: col2Width - 10,
  });

  // Totals side
  let totalY = footerY + 10;
  doc.fontSize(9).font("Helvetica-Bold");
  doc.text("Sub Total:", 400, totalY, { align: "right", width: 90 });
  doc.text(invoice.subTotal.toFixed(2), 500, totalY, {
    align: "right",
    width: 60,
  });

  totalY += 15;
  doc.text("GST Amount:", 400, totalY, { align: "right", width: 90 });
  doc.text(invoice.totalGst.toFixed(2), 500, totalY, {
    align: "right",
    width: 60,
  });

  totalY += 25;
  doc.fontSize(11).text("TOTAL:", 400, totalY, { align: "right", width: 90 });
  doc
    .fillColor("#e63946")
    .text(invoice.total.toFixed(2), 500, totalY, { align: "right", width: 60 });
  doc.fillColor("black");

  // Terms & Signature
  const lastY = 700;
  doc.fontSize(8).font("Helvetica-Bold").text("Notes / Terms:", 30, lastY);
  doc
    .font("Helvetica")
    .text(
      "1. All disputes subject to Kolkata jurisdiction.\n2. Payment due within 7 days of invoice date.",
      30,
      lastY + 12,
    );

  // Authorized Signatory with Stamp
  const signatoryX = 400;
  const signatoryY = lastY;
  const signatoryWidth = 150;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("For Kleardocs Solutions Private Limited", signatoryX, signatoryY, {
      align: "center",
      width: signatoryWidth,
    });

  // Add stamp image
  try {
    const stampPath = new URL(
      "../../../Frontend/src/assets/AuthStamp2.png",
      import.meta.url,
    ).pathname;
    doc.image(
      stampPath,
      signatoryX + signatoryWidth / 2 - 50,
      signatoryY + 20,
      { width: 100, height: 80 },
    );
  } catch (e) {
    // Fallback: draw placeholder circles if image fails
    const centerX = signatoryX + signatoryWidth / 2;
    const centerY = signatoryY + 60;
    doc.lineWidth(1);
    doc.strokeColor("#b4b4b4");
    doc.circle(centerX, centerY, 45);
    doc.circle(centerX, centerY, 40);
    doc.stroke();
    doc
      .fillColor(primaryColor)
      .fontSize(7)
      .font("Helvetica-Bold")
      .text("KLEARDOCS SOLUTIONS PRIVATE LIMITED", centerX, centerY - 5, {
        align: "center",
      });
    doc.fillColor("black");
  }

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Authorized Signatory", signatoryX, signatoryY + 120, {
      align: "center",
      width: signatoryWidth,
    });

  doc.end();
};
