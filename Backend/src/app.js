import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { securityMiddleware } from "./middleware/xss.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Routes
import AuthRoutes from "./routes/auth.routes.js";
import LeadRoutes from "./routes/lead.routes.js";
import CustomerRoutes from "./routes/customer.routes.js";
import ComplianceSettingRoutes, { financialYearRouter } from "./routes/complianceSetting.routes.js";

// Pre-register models needed for populate (even if their routes aren't built yet)
import "./models/Service.model.js";
import "./models/Invoice.model.js";
import "./models/RecurringInvoice.model.js";

// Billing routes
import InvoiceRoutes from "./routes/invoice.routes.js";
import PaymentRoutes from "./routes/payment.routes.js";
import RecurringInvoiceRoutes from "./routes/recurringInvoice.routes.js";

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
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Anti-Hacking Middlewares
app.use(hpp());
app.use(securityMiddleware);

// Serve static files to client
app.use(express.static("public"));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// API Routes
app.get("/", (req, res) => {
    res.send("Server is healthy ✅");
});
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/leads", LeadRoutes);
app.use("/api/v1/customers", CustomerRoutes);
app.use("/api/v1/compliance-settings", ComplianceSettingRoutes);
app.use("/api/v1/financial-years", financialYearRouter);
app.use("/api/v1/invoices", InvoiceRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/recurringinvoices", RecurringInvoiceRoutes);

// Global Error Handler (must be after all routes)
app.use(errorHandler);

export default app;