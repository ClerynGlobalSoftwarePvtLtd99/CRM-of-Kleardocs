import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.routes.js";

import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { securityMiddleware } from "./middleware/xss.middleware.js";

const app = express();

// Standard Security Headers
app.use(helmet());

// DDoS & Brute Force Protection (Max 100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: false, message: "Too many requests, please try again later." }
});
app.use("/api", limiter);

// Middleware
app.use(express.json({ limit: "10kb" })); // Body parser limit
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Anti-Hacking Middlewares
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(securityMiddleware); // Express 5 In-place XSS and NoSQL injection prevention

app.use(express.static("public"));
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


import { errorHandler } from "./middleware/error.middleware.js";

// Routes
app.get("/", (req, res) => {
    res.send("Server is healthy");
});
app.use("/api/v1/auth", AuthRoutes);

// Global Error Handler (must be after routes)
app.use(errorHandler);

export default app;