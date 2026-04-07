import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");

// ─── Invoice Item ─────────────────────────────────────────────────────────────
const invoiceItemSchema = z.object({
  serviceId: mongoId.optional(),
  description: z.string().optional(),
  hsn: z.string().optional(),
  professionalFees: z.number().min(0).default(0),
  govtFees: z.number().min(0).default(0),
  gstPercent: z.number().min(0).max(100).default(0)
});

// ─── Create Invoice ───────────────────────────────────────────────────────────
export const createInvoiceSchema = z.object({
  customerId: mongoId,
  invoiceDate: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item required"),
  // Recurring invoice params (optional)
  recurring: z.boolean().optional().default(false),
  interval: z.number().optional(),
  intervalType: z.enum(["Day", "Month"]).optional(),
  endDate: z.string().optional(),
  description: z.string().optional()
});

// ─── Add Payment ──────────────────────────────────────────────────────────────
export const addPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  mode: z.enum(["Cash", "UPI", "Card", "Net Banking", "Cheque", "Other"]).default("UPI"),
  note: z.string().optional(),
  paymentDate: z.string().optional()
});

// ─── Global Payments list filter (no body schema needed — query params only) ─