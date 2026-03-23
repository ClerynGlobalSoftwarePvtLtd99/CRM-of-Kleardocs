import * as invoiceService from "../services/invoice.service.js";
import { ApiResponse } from "../utils/response.js";

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

// PUT /api/v1/recurringinvoices/:riId/disable
export const disableRecurringInvoice = async (req, res) => {
  const ri = await invoiceService.disableRecurringInvoice(req.params.riId);
  res.status(200).json(new ApiResponse(200, ri, "Recurring invoice disabled"));
};