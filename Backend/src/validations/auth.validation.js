import { z } from "zod";

// Industry-standard robust email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().regex(emailRegex, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "agent", "accountant", "customer"]).optional()
});

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
