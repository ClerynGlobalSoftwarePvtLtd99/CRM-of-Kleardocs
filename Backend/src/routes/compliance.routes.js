import express from "express";
import { getAllCompliances, updateCompliance } from "../controllers/compliance.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // Requires login

// GET /api/v1/compliances
router.get("/", getAllCompliances);

// PUT /api/v1/compliances/:id
router.put("/:id", authorize("admin", "agent", "accountant"), updateCompliance);

export default router;