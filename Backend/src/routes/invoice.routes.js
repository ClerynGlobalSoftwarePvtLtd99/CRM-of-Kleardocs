import express from "express";
import {
  getInvoices, createInvoice, getInvoiceById, deleteInvoice,
  addPayment, deletePayment, downloadInvoicePdf, updateInvoiceDescription
} from "../controllers/invoice.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createInvoiceSchema, addPaymentSchema } from "../validations/invoice.validation.js";

const router = express.Router();
router.use(auth);

// ── Invoice CRUD ──────────────────────────────────────────────────────────────
router.get("/", getInvoices);
router.post("/", checkRole("admin", "agent"), validate(createInvoiceSchema), createInvoice);
router.get("/:invoiceId", getInvoiceById);
router.patch("/:invoiceId/description", checkRole("admin", "agent"), updateInvoiceDescription);
router.get("/:invoiceId/download", downloadInvoicePdf);
router.delete("/:invoiceId", checkRole("admin"), deleteInvoice);

// ── Payments on Invoice ───────────────────────────────────────────────────────
router.post("/:invoiceId/payments", checkRole("admin", "agent"), validate(addPaymentSchema), addPayment);
router.delete("/:invoiceId/payments/:paymentId", checkRole("admin"), deletePayment);

export default router;