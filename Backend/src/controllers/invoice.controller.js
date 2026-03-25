import * as invoiceService from "../services/invoice.service.js";
import { ApiResponse } from "../utils/response.js";
import ExcelJS from "exceljs";

// ══════════════════════════════════════════════════════════════════════════════
// INVOICE CONTROLLERS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/v1/invoices
export const getInvoices = async (req, res) => {
  const { invoices, count } = await invoiceService.getInvoices(req.query);
  res.status(200).json(new ApiResponse(200, { count, data: invoices }, "Invoices fetched"));
};

// POST /api/v1/invoices
export const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, invoice, "Invoice created successfully"));
};

// GET /api/v1/invoices/:invoiceId
export const getInvoiceById = async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.invoiceId);
  res.status(200).json(new ApiResponse(200, invoice, "Invoice fetched"));
};

// DELETE /api/v1/invoices/:invoiceId
export const deleteInvoice = async (req, res) => {
  await invoiceService.deleteInvoice(req.params.invoiceId);
  res.status(200).json(new ApiResponse(200, null, "Invoice deleted successfully"));
};

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT CONTROLLERS
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/v1/invoices/:invoiceId/payments
export const addPayment = async (req, res) => {
  const payment = await invoiceService.addPayment(req.params.invoiceId, req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, payment, "Payment added successfully"));
};

// DELETE /api/v1/invoices/:invoiceId/payments/:paymentId
export const deletePayment = async (req, res) => {
  await invoiceService.deletePayment(req.params.invoiceId, req.params.paymentId);
  res.status(200).json(new ApiResponse(200, null, "Payment deleted successfully"));
};

// GET /api/v1/payments  (global list)
export const getAllPayments = async (req, res) => {
  const { payments, count } = await invoiceService.getAllPayments(req.query);
  res.status(200).json(new ApiResponse(200, { count, data: payments }, "Payments fetched"));
};

// ══════════════════════════════════════════════════════════════════════════════
// RECURRING INVOICE CONTROLLERS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/v1/recurringinvoices
export const getRecurringInvoices = async (req, res) => {
  const { recurringInvoices, count } = await invoiceService.getRecurringInvoices(req.query);
  res.status(200).json(new ApiResponse(200, { count, data: recurringInvoices }, "Recurring invoices fetched"));
};

// GET /api/v1/recurringinvoices/:riId
export const getRecurringInvoiceById = async (req, res) => {
  const ri = await invoiceService.getRecurringInvoiceById(req.params.riId);
  res.status(200).json(new ApiResponse(200, ri, "Recurring invoice fetched"));
};

// GET /api/v1/recurringinvoices/export
export const exportRecurringInvoices = async (req, res) => {
  const ris = await invoiceService.getAllRecurringInvoicesForExport(req.query);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Recurring Invoices");

  sheet.columns = [
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Customer", key: "customerName", width: 30 },
    { header: "Company", key: "companyName", width: 35 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Services", key: "services", width: 40 },
    { header: "Start Date", key: "startDate", width: 15 },
    { header: "End Date", key: "endDate", width: 15 },
    { header: "Interval", key: "interval", width: 15 },
    { header: "Next Inv. Date", key: "nextDate", width: 15 },
    { header: "Status", key: "status", width: 12 }
  ];

  ris.forEach((ri) => {
    sheet.addRow({
      createdAt: ri.createdAt ? new Date(ri.createdAt).toLocaleDateString("en-IN") : "",
      customerName: ri.customer?.name || "",
      companyName: ri.customer?.companyName || "",
      phone: ri.customer?.phone || "",
      services: ri.items.map(it => it.service?.name || it.description).join(", "),
      startDate: ri.startDate ? new Date(ri.startDate).toLocaleDateString("en-IN") : "",
      endDate: ri.endDate ? new Date(ri.endDate).toLocaleDateString("en-IN") : "",
      interval: `${ri.interval} ${ri.intervalType}${ri.interval > 1 ? "s" : ""}`,
      nextDate: ri.nextDate ? new Date(ri.nextDate).toLocaleDateString("en-IN") : "",
      status: ri.status
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=recurring_invoices.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

// PUT /api/v1/recurringinvoices/:riId/disable
export const disableRecurringInvoice = async (req, res) => {
  const ri = await invoiceService.disableRecurringInvoice(req.params.riId);
  res.status(200).json(new ApiResponse(200, ri, "Recurring invoice status toggled"));
};