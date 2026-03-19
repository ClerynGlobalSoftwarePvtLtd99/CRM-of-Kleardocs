import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.routes.js";

import helmet from "helmet"; //For setting HTTP headers
import hpp from "hpp"; //For preventing HTTP Parameter Pollution
import cookieParser from "cookie-parser"; //For parsing cookies
import rateLimit from "express-rate-limit"; //For rate limiting
import { securityMiddleware } from "./middleware/xss.middleware.js"; //For XSS and NoSQL injection prevention

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
app.use(express.json({ limit: "50kb" })); // Body parser limit
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Anti-Hacking Middlewares
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(securityMiddleware); // Express 5 In-place XSS and NoSQL injection prevention

// Serve static files to client
app.use(express.static("public"));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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