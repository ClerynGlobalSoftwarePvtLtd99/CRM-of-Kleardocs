import { z } from "zod";

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ID format");

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  companyName: z.string().optional(),
  serviceId: mongoId.optional(),
  source: z.enum(["Instagram", "Facebook", "YouTube", "WhatsApp", "Referral", "Website", "Cold Call", "Other"]).optional(),
  type: z.enum(["Hot", "Cold", "Warm"]).optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  response: z.enum(["Interested", "Not Interested", "Call Back", "No Response", "Converted"]).optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  emails: z.array(z.string().email()).optional(),
  agentId: mongoId.optional()
});

export const updateLeadSchema = createLeadSchema.partial();

export const followupSchema = z.object({
  followupDate: z.string().min(1, "Follow-up date is required"),
  phoneCalled: z.boolean().optional().default(false),
  details: z.string().optional()
});

export const interactionSchema = z.object({
  details: z.string().min(1, "Interaction details are required"),
  phoneCalled: z.boolean().optional().default(false)
});

export const assignAgentSchema = z.object({
  agentId: mongoId
});

export const updateEmailsSchema = z.object({
  emails: z.array(z.string().email()).min(1, "At least one email is required")
});

export const convertToCustomerSchema = z.object({
  companyName: z.string().min(2),
  address: z.string().min(2),
  state: z.string().min(2),
  gst: z.string().optional(),
  type: z.enum(["Sole Proprietorship", "Partnership", "LLP", "Private Limited Company", "Public Limited Company", "OPC", "Trust", "NGO", "Other"]),
  incorporationDate: z.string().optional(),
  newlyIncorporated: z.boolean().optional().default(false),
  username: z.string().min(3)
});