import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const COMPANY_TYPES = [
  "Sole Proprietorship", "Partnership", "LLP",
  "Private Limited Company", "Public Limited Company",
  "OPC", "Trust", "NGO", "Other"
];

// ─── Create Customer ─────────────────────────────────────────────────────────
export const createCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().length(10, "Phone must be exactly 10 digits"),
  companyName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  gst: z.string().optional(),
  type: z.enum(COMPANY_TYPES).optional(),
  incorporationDate: z.string().optional(),
  newlyIncorporated: z.boolean().optional().default(false),
  onboardingDate: z.string().optional(),
  saleBy: mongoId.optional(), // userId of salesperson
  username: z.string().min(3).optional(),
  emails: z.array(z.string().regex(emailRegex, "Invalid email format")).optional()
});

// ─── Update Customer ─────────────────────────────────────────────────────────
export const updateCustomerSchema = createCustomerSchema.partial();

// ─── Update Emails ───────────────────────────────────────────────────────────
export const updateEmailsSchema = z.object({
  emails: z.array(z.string().regex(emailRegex, "Invalid email format"))
});

// ─── Add Director ────────────────────────────────────────────────────────────
export const addDirectorSchema = z.object({
  name: z.string().min(2, "Director name required"),
  phone: z.string().length(10, "Phone must be exactly 10 digits").optional().or(z.literal("")),
  din: z.string().optional(),
  designation: z.string().optional()
});

// ─── Add Service to Customer ─────────────────────────────────────────────────
export const addCustomerServiceSchema = z.object({
  serviceId: mongoId,
  startDate: z.string().optional(),
  professionalFees: z.number().min(0).optional(),
  govtFees: z.number().min(0).optional(),
  gst: z.number().min(0).max(100).optional().default(18),
  recurring: z.boolean().optional().default(false),
  interval: z.number().optional(),
  intervalType: z.enum(["Day", "Month"]).optional(),
  endDate: z.string().optional(),
  totalInstallments: z.number().min(1).optional().default(1),
  installmentIntervalMonths: z.number().min(1).max(12).optional().default(3)
});

// ─── Add Financial Year ──────────────────────────────────────────────────────
export const addFinancialYearSchema = z.object({
  financialYear: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY")
});

// ─── Update Compliance ───────────────────────────────────────────────────────
export const updateComplianceSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["Ongoing", "To Be Done", "Done"]).optional(),
  accountant: z.string().optional(),
  completedOn: z.string().optional(),
  hasExpiry: z.boolean().optional()
});