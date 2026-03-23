import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/job.controller.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", authorize("admin", "agent"), createJob);
router.put("/:id", authorize("admin", "agent", "accountant"), updateJob);
router.delete("/:id", authorize("admin"), deleteJob);

export default router;