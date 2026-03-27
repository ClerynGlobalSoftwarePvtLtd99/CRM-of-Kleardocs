import express from "express";
import {
  getLeads, createLead, getLeadById, updateLead, deleteLead,
  addFollowup, addInteraction, getEmails, updateEmails, assignAgent,
  convertToCustomer, sendEmailTemplate, sendWhatsappTemplate
} from "../controllers/lead.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createLeadSchema, updateLeadSchema, followupSchema,
  interactionSchema, assignAgentSchema, updateEmailsSchema,
  convertToCustomerSchema, templateLogSchema
} from "../validations/lead.validation.js";

const router = express.Router();

// All lead routes require authentication
router.use(auth);

// ─── LEAD CRUD ─────────────────────────────────────────────────────────────
router.get("/", getLeads);
router.post("/", checkRole("admin", "agent"), validate(createLeadSchema), createLead);
router.get("/:leadId", getLeadById);
router.put("/:leadId", checkRole("admin", "agent"), validate(updateLeadSchema), updateLead);
router.delete("/:leadId", checkRole("admin"), deleteLead);

// ─── LEAD ACTIONS ─────────────────────────────────────────────────────────
router.post("/:leadId/followup", checkRole("admin", "agent"), validate(followupSchema), addFollowup);
router.post("/:leadId/interaction", checkRole("admin", "agent"), validate(interactionSchema), addInteraction);
router.get("/:leadId/emails", getEmails);
router.put("/:leadId/emails", checkRole("admin", "agent"), validate(updateEmailsSchema), updateEmails);
router.put("/:leadId/assign", checkRole("admin"), validate(assignAgentSchema), assignAgent);
router.post("/:leadId/convert", checkRole("admin", "agent"), validate(convertToCustomerSchema), convertToCustomer);

// ─── TEMPLATE LOGGING ─────────────────────────────────────────────────────
router.post("/:leadId/send-email-template", checkRole("admin", "agent"), validate(templateLogSchema), sendEmailTemplate);
router.post("/:leadId/send-whatsapp-template", checkRole("admin", "agent"), validate(templateLogSchema), sendWhatsappTemplate);

export default router;