import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/leads", dashboardController.getLeadsSummary);
router.get("/customers", dashboardController.getCustomersSummary);
router.get("/sales", dashboardController.getSalesSummary);
router.get("/compliance-jobs", dashboardController.getComplianceJobsSummary);
router.get("/graphs", dashboardController.getGraphsData);

export default router;