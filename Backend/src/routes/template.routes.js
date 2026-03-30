import express from "express";
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  uploadAttachment,
  removeAttachment
} from "../controllers/template.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.post("/", authorize("admin"), createTemplate);
router.put("/:id", authorize("admin"), updateTemplate);
router.delete("/:id", authorize("admin"), deleteTemplate);

// Attachments
router.post("/:id/attachments", authorize("admin"), upload.single("file"), uploadAttachment);
router.delete("/:id/attachments/:filename", authorize("admin"), removeAttachment);

export default router;