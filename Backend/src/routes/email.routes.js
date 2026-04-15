import express from "express";
import {
  sendEmail,
  previewEmail,
  getHistory,
  resendEmailController as resendEmail,
  getEmailStatus
} from "../controllers/email.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   POST /api/v1/emails/send-template
 * @desc    Send email using template via Brevo
 * @access  Private (Admin, Agent)
 */
router.post("/send-template", authorize("admin", "agent"), sendEmail);

/**
 * @route   POST /api/v1/emails/preview
 * @desc    Preview email template with parsed placeholders
 * @access  Private (Admin, Agent)
 */
router.post("/preview", authorize("admin", "agent"), previewEmail);

/**
 * @route   GET /api/v1/emails/history/:entityType/:entityId
 * @desc    Get email history for a customer or lead
 * @access  Private (Admin, Agent)
 */
router.get("/history/:entityType/:entityId", authorize("admin", "agent"), getHistory);

/**
 * @route   POST /api/v1/emails/resend/:logId
 * @desc    Resend a previously sent email
 * @access  Private (Admin, Agent)
 */
router.post("/resend/:logId", authorize("admin", "agent"), resendEmail);

/**
 * @route   GET /api/v1/emails/status
 * @desc    Check Brevo email service status
 * @access  Private (Admin)
 */
router.get("/status", authorize("admin"), getEmailStatus);

export default router;
