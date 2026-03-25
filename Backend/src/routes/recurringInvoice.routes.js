import express from "express";
import {
  getRecurringInvoices,
  getRecurringInvoiceById,
  disableRecurringInvoice,
  exportRecurringInvoices
} from "../controllers/invoice.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = express.Router();
router.use(auth);

router.get("/", getRecurringInvoices);
router.get("/export", exportRecurringInvoices);
router.get("/:riId", getRecurringInvoiceById);
router.put("/:riId/disable", checkRole("admin"), disableRecurringInvoice);

export default router;
