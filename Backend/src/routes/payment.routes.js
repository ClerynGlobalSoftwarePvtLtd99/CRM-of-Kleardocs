import express from "express";
import { getAllPayments } from "../controllers/invoice.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(auth);

// GET /api/v1/payments
router.get("/", getAllPayments);

export default router;