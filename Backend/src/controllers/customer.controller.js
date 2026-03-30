import * as customerService from "../services/customer.service.js";
import * as pdfService from "../services/pdf.service.js";
import * as communicationService from "../services/communication.service.js";
import * as templateService from "../services/template.service.js";
import { ApiResponse } from "../utils/response.js";
import ExcelJS from "exceljs";

// ─── GET /api/v1/customers ────────────────────────────────────────────────────
export const getCustomers = async (req, res) => {
  const { customers, count } = await customerService.getCustomers(req.query);
  res.status(200).json(new ApiResponse(200, { count, data: customers }, "Customers fetched"));
};

// ─── POST /api/v1/customers ───────────────────────────────────────────────────
export const createCustomer = async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
};

// ─── GET /api/v1/customers/export ─────────────────────────────────────────────
export const exportCustomers = async (req, res) => {
  const customers = await customerService.getAllCustomersForExport();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Customers");

  sheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Company Name", key: "companyName", width: 35 },
    { header: "Type", key: "type", width: 28 },
    { header: "GST", key: "gst", width: 22 },
    { header: "State", key: "state", width: 22 },
    { header: "Address", key: "address", width: 40 },
    { header: "Incorporation Date", key: "incorporationDate", width: 20 },
    { header: "Onboarding Date", key: "onboardingDate", width: 20 },
    { header: "Newly Incorporated", key: "newlyIncorporated", width: 18 },
    { header: "Username", key: "username", width: 20 },
    { header: "Sales Person", key: "salesPerson", width: 22 }
  ];

  customers.forEach((c) => {
    sheet.addRow({
      name: c.name,
      phone: c.phone,
      companyName: c.companyName || "",
      type: c.type || "",
      gst: c.gst || "",
      state: c.state || "",
      address: c.address || "",
      incorporationDate: c.incorporationDate
        ? new Date(c.incorporationDate).toLocaleDateString("en-IN")
        : "",
      onboardingDate: c.onboardingDate
        ? new Date(c.onboardingDate).toLocaleDateString("en-IN")
        : "",
      newlyIncorporated: c.newlyIncorporated ? "Yes" : "No",
      username: c.username || "",
      salesPerson: c.saleBy?.name || ""
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

// ─── GET /api/v1/customers/list ────────────────────────────────────────────────
export const getCustomerList = async (req, res) => {
  const list = await customerService.getCustomerList();
  res.status(200).json(new ApiResponse(200, list, "Customer list fetched"));
};

// ─── GET /api/v1/customers/:customerId ────────────────────────────────────────
export const getCustomerById = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.status(200).json(new ApiResponse(200, customer, "Customer fetched"));
};

// ─── PUT /api/v1/customers/:customerId ────────────────────────────────────────
export const updateCustomer = async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.customerId, req.body);
  res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully"));
};

// ─── PUT /api/v1/customers/:customerId/emails ─────────────────────────────────
export const updateEmails = async (req, res) => {
  await customerService.updateEmails(req.params.customerId, req.body.emails);
  res.status(200).json(new ApiResponse(200, null, "Emails updated successfully"));
};

// ─── POST /api/v1/customers/:customerId/directors ─────────────────────────────
export const addDirector = async (req, res) => {
  const director = await customerService.addDirector(req.params.customerId, req.body);
  res.status(201).json(new ApiResponse(201, director, "Director added successfully"));
};

// ─── DELETE /api/v1/customers/:customerId/directors/:directorId ───────────────
export const deleteDirector = async (req, res) => {
  await customerService.deleteDirector(req.params.customerId, req.params.directorId);
  res.status(200).json(new ApiResponse(200, null, "Director removed successfully"));
};

// ─── POST /api/v1/customers/:customerId/services ──────────────────────────────
export const addService = async (req, res) => {
  const cs = await customerService.addService(req.params.customerId, req.body);
  res.status(201).json(new ApiResponse(201, cs, "Service added successfully"));
};

// ─── PUT /api/v1/customers/:customerId/services/:serviceId/end ────────────────
export const endService = async (req, res) => {
  const result = await customerService.endService(
    req.params.customerId,
    req.params.serviceId
  );
  res.status(200).json(new ApiResponse(200, result, "Service ended successfully"));
};

// ─── GET /api/v1/customers/:customerId/compliances?year= ──────────────────────
export const getCompliances = async (req, res) => {
  const compliances = await customerService.getCompliances(
    req.params.customerId,
    req.query.year
  );
  res.status(200).json(new ApiResponse(200, compliances, "Compliances fetched"));
};

// ─── POST /api/v1/customers/:customerId/financial-year ────────────────────────
export const addFinancialYear = async (req, res) => {
  const result = await customerService.addFinancialYear(
    req.params.customerId,
    req.body.financialYear
  );
  res.status(201).json(new ApiResponse(201, result, "Financial year added successfully"));
};

// ─── PUT /api/v1/customers/:customerId/compliances/:complianceId ──────────────
export const updateCompliance = async (req, res) => {
  const compliance = await customerService.updateCompliance(
    req.params.customerId,
    req.params.complianceId,
    req.body
  );
  res.status(200).json(new ApiResponse(200, compliance, "Compliance updated successfully"));
};

// ─── ACTION PANEL CONTROLLERS ─────────────────────────────────────────────────

export const getDirectorReport = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=DirectorReport_${req.params.customerId}.pdf`);
  pdfService.generateDirectorReport(customer, req.query, res);
};

export const getBoardResolution = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=BoardResolution_${req.params.customerId}.pdf`);
  pdfService.generateBoardResolution(customer, req.query, res);
};

export const getConsentLetter = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ConsentLetter_${req.params.customerId}.pdf`);
  pdfService.generateConsentLetter(customer, req.query, res);
};

export const getAuditorsReport = async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.customerId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=AuditorsReport_${req.params.customerId}.pdf`);
  pdfService.generateAuditorsReport(customer, req.query, res);
};

export const sendCustomerEmail = async (req, res) => {
  const { customerId } = req.params;
  const { templateId, templateName, data } = req.body;
  const customer = await customerService.getCustomerById(customerId);
  
  if (!customer.emails || customer.emails.length === 0) {
    throw new ApiError(400, "Customer has no registered emails");
  }

  // Fetch template to get attachments
  let attachments = [];
  if (templateId) {
    const template = await templateService.getTemplateById(templateId);
    if (template && template.attachments) {
      attachments = template.attachments;
    }
  }

  await communicationService.sendEmail({
    to: customer.emails[0], // Send to primary email
    subject: data.subject,
    html: data.content,
    customerId,
    templateId,
    templateName,
    userId: req.user.id,
    attachments // Pass attachments to the service
  });

  res.status(200).json(new ApiResponse(200, null, "Email sent successfully"));
};

export const sendCustomerWhatsapp = async (req, res) => {
  const { customerId } = req.params;
  const { templateId, templateName, data } = req.body;
  const customer = await customerService.getCustomerById(customerId);

  await communicationService.sendWhatsapp({
    phone: customer.phone,
    content: data.content,
    customerId,
    templateId,
    templateName,
    userId: req.user.id
  });

  res.status(200).json(new ApiResponse(200, null, "WhatsApp message sent successfully"));
};