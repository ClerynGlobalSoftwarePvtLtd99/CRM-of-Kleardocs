import express from "express";
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from "../controllers/template.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.post("/", authorize("admin"), createTemplate);
router.put("/:id", authorize("admin"), updateTemplate);
router.delete("/:id", authorize("admin"), deleteTemplate);

export default router;