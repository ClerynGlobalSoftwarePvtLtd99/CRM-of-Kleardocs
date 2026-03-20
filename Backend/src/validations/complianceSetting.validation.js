import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");

// ─── Financial Year ───────────────────────────────────────────────────────────
export const createFinancialYearSchema = z.object({
  year: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY e.g. 2025-2026")
});

export const updateFinancialYearSchema = createFinancialYearSchema;

// ─── Compliance Setting ───────────────────────────────────────────────────────
export const createComplianceSettingSchema = z.object({
  name: z.string().min(3, "Compliance name required"),
  year: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY"),
  hasExpiry: z.boolean().optional().default(false),
  expiryDate: z.string().optional(),
  isNew: z.boolean().optional().default(false),
  inc20: z.boolean().optional().default(false),
  daysOfExpiry: z.number().optional().default(30),
  expiryTemplateId: mongoId.optional(),
  completeTemplateId: mongoId.optional()
});

export const updateComplianceSettingSchema = createComplianceSettingSchema.partial();
