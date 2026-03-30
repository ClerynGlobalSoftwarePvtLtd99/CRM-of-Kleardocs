import express from "express";
import {
  getCustomers,
  createCustomer,
  exportCustomers,
  getCustomerList,
  getCustomerById,
  updateCustomer,
  updateEmails,
  addDirector,
  deleteDirector,
  addService,
  endService,
  getCompliances,
  addFinancialYear,
  updateCompliance,
  getDirectorReport,
  getBoardResolution,
  getConsentLetter,
  getAuditorsReport,
  sendCustomerEmail,
  sendCustomerWhatsapp
} from "../controllers/customer.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
  updateEmailsSchema,
  addDirectorSchema,
  addCustomerServiceSchema,
  addFinancialYearSchema,
  updateComplianceSchema
} from "../validations/customer.validation.js";

const router = express.Router();

// All routes require auth
router.use(auth);

// ─── SPECIAL ROUTES (before :customerId to avoid conflicts) ──────────────────
router.get("/export", exportCustomers);
router.get("/list", getCustomerList);

// ─── CUSTOMER CRUD ────────────────────────────────────────────────────────────
router.get("/", getCustomers);
router.post("/", checkRole("admin", "agent"), validate(createCustomerSchema), createCustomer);
router.get("/:customerId", getCustomerById);
router.put("/:customerId", checkRole("admin", "agent"), validate(updateCustomerSchema), updateCustomer);

// ─── EMAILS ───────────────────────────────────────────────────────────────────
router.put("/:customerId/emails", checkRole("admin", "agent"), validate(updateEmailsSchema), updateEmails);

// ─── DIRECTORS ────────────────────────────────────────────────────────────────
router.post("/:customerId/directors", checkRole("admin", "agent"), validate(addDirectorSchema), addDirector);
router.delete("/:customerId/directors/:directorId", checkRole("admin"), deleteDirector);

// ─── SERVICES ─────────────────────────────────────────────────────────────────
router.post("/:customerId/services", checkRole("admin", "agent"), validate(addCustomerServiceSchema), addService);
router.put("/:customerId/services/:serviceId/end", checkRole("admin", "agent"), endService);

// ─── COMPLIANCES ──────────────────────────────────────────────────────────────
router.get("/:customerId/compliances", getCompliances);
router.post("/:customerId/financial-year", checkRole("admin"), validate(addFinancialYearSchema), addFinancialYear);
router.put("/:customerId/compliances/:complianceId", checkRole("admin", "accountant"), validate(updateComplianceSchema), updateCompliance);

// ─── ACTION PANEL (Reports & Messaging) ───────────────────────────────────────
router.get("/:customerId/director-report", getDirectorReport);
router.get("/:customerId/board-resolution", getBoardResolution);
router.get("/:customerId/consent-letter", getConsentLetter);
router.get("/:customerId/auditors-report", getAuditorsReport);
router.post("/:customerId/send-email", checkRole("admin", "agent"), sendCustomerEmail);
router.post("/:customerId/send-whatsapp", checkRole("admin", "agent"), sendCustomerWhatsapp);

export default router;