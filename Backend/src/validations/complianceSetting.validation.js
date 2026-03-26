import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");

// ─── Financial Year ───────────────────────────────────────────────────────────
export const createFinancialYearSchema = z.object({
  year: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY e.g. 2025-2026")
});

export const updateFinancialYearSchema = createFinancialYearSchema;

// ─── Compliance Setting ───────────────────────────────────────────────────────
const baseComplianceSettingSchema = z.object({
  name: z.string().min(3, "Compliance name required").optional(),
  financialYear: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY").optional(),
  year: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY").optional(),
  hasExpiry: z.boolean().optional().default(false),
  expiryDate: z.string().optional(),
  forNewCompany: z.boolean().optional().default(false),
  inc20: z.boolean().optional().default(false),
  daysOfExpiry: z.number().optional().default(30),
  expiryTemplateId: mongoId.optional(),
  completeTemplateId: mongoId.optional(),
  expiryTemplate: z.string().optional(),
  completeTemplate: z.string().optional(),
});

export const createComplianceSettingSchema = baseComplianceSettingSchema.extend({
  name: z.string().min(3, "Compliance name required"),
}).refine(
  (d) => d.financialYear || d.year,
  { message: "financialYear is required", path: ["financialYear"] }
);

export const updateComplianceSettingSchema = baseComplianceSettingSchema.partial();

