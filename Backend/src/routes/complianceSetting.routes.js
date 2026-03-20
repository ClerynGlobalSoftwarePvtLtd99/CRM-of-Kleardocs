import express from "express";
import {
  getFinancialYears,
  createFinancialYear,
  updateFinancialYear
} from "../controllers/complianceSetting.controller.js";
import {
  getComplianceSettings,
  createComplianceSetting,
  updateComplianceSetting,
  deleteComplianceSetting
} from "../controllers/complianceSetting.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createFinancialYearSchema,
  updateFinancialYearSchema,
  createComplianceSettingSchema,
  updateComplianceSettingSchema
} from "../validations/complianceSetting.validation.js";

const router = express.Router();
router.use(auth);

// ─── FINANCIAL YEARS ─── /api/v1/financial-years ─────────────────────────────
export const financialYearRouter = express.Router();
financialYearRouter.use(auth);
financialYearRouter.get("/", getFinancialYears);
financialYearRouter.post("/", checkRole("admin"), validate(createFinancialYearSchema), createFinancialYear);
financialYearRouter.put("/:yearId", checkRole("admin"), validate(updateFinancialYearSchema), updateFinancialYear);

// ─── COMPLIANCE SETTINGS ─── /api/v1/compliance-settings ─────────────────────
router.get("/", getComplianceSettings);
router.post("/", checkRole("admin"), validate(createComplianceSettingSchema), createComplianceSetting);
router.put("/:complianceId", checkRole("admin"), validate(updateComplianceSettingSchema), updateComplianceSetting);
router.delete("/:complianceId", checkRole("admin"), deleteComplianceSetting);

export default router;
