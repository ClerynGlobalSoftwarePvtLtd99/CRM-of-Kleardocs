import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { securityMiddleware } from "./middleware/xss.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import path from "path";

// Routes
import AuthRoutes from "./routes/auth.routes.js";
import LeadRoutes from "./routes/lead.routes.js";
import CustomerRoutes from "./routes/customer.routes.js";
import ComplianceSettingRoutes, { financialYearRouter } from "./routes/complianceSetting.routes.js";
import DashboardRoutes from "./routes/dashboard.routes.js";
import SettingsRoutes from "./routes/settings.routes.js";
import ServiceRoutes from "./routes/service.routes.js";
import ComplianceRoutes from "./routes/compliance.routes.js";
import TemplateRoutes from "./routes/template.routes.js";
import JobRoutes from "./routes/job.routes.js";
import UserRoutes from "./routes/user.routes.js";

// Pre-register models needed for populate (even if their routes aren't built yet)
import "./models/Service.model.js";
import "./models/Invoice.model.js";
import "./models/RecurringInvoice.model.js";

// Billing routes
import InvoiceRoutes from "./routes/invoice.routes.js";
import PaymentRoutes from "./routes/payment.routes.js";
import RecurringInvoiceRoutes from "./routes/recurringInvoice.routes.js";

const app = express();

// ─── CORS — must be FIRST so preflight OPTIONS requests are answered ──────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://crm-of-kleardocs.vercel.app",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(o => o.trim()).filter(o => o) : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Explicitly handle preflight for every route if necessary, but app.use(cors()) usually handles it.
// If you encounter preflight issues, use app.use(cors(corsOptions)) which is already below.

// Standard Security Headers - Configured to allow cross-origin resource sharing for attachments
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  contentSecurityPolicy: false, // Disable CSP for local dev to prevent blocking previews/attachments
}));

// DDoS & Brute Force Protection (Max 100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: false, message: "Too many requests, please try again later." }
});
app.use("/api", limiter);

// Middleware
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// Anti-Hacking Middlewares
// app.use(mongoSanitize()); // Prevent NoSQL Injections - Temporarily disabled for Express 5 debug
// app.use(hpp()); // Prevent HTTP Parameter Pollution - Temporarily disabled for Express 5 debug
app.use(securityMiddleware); // Custom XSS Payload Scrubber

// Serve static files to client with explicit CORS
app.use("/uploads", cors(corsOptions), express.static(path.join(process.cwd(), "public/uploads")));
app.use(express.static("public"));

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
app.use("/api/v1/dashboard", DashboardRoutes);
app.use("/api/v1/settings", SettingsRoutes);
app.use("/api/v1/services", ServiceRoutes);
app.use("/api/v1/compliances", ComplianceRoutes);
app.use("/api/v1/templates", TemplateRoutes);
app.use("/api/v1/jobs", JobRoutes);
app.use("/api/v1/users", UserRoutes);

// Global Error Handler (must be after all routes) 
app.use(errorHandler);

export default app;
