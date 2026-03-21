import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/service.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authorize("admin", "agent"), createService);
router.put("/:id", authorize("admin", "agent"), updateService);
router.delete("/:id", authorize("admin"), deleteService);

export default router;
