import express from "express";
import { register, login, refresh, customerLogin } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/customer-login", customerLogin);
router.post("/refresh-token", refresh);

export default router;