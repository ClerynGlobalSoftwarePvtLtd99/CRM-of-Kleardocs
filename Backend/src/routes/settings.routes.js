import express from "express";
import * as settingsController from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/email-count", settingsController.getEmailCount);

export default router;
