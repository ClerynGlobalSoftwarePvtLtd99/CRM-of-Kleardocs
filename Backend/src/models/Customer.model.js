import mongoose from "mongoose";

// ─── Director Sub-Schema ────────────────────────────────────────────────────
const directorSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    name: { type: String, required: true },
    phone: { type: String },
    din: { type: String },
    designation: { type: String, default: "Director" }
  },
  { timestamps: true }
);

// ─── Customer Service Sub-Schema ────────────────────────────────────────────
const customerServiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    professionalFees: { type: Number, default: 0 },
    govtFees: { type: Number, default: 0 },
    gst: { type: Number, default: 18 },
    // Recurring invoice config
    recurring: { type: Boolean, default: false },
    interval: { type: Number },
    intervalType: { type: String, enum: ["Day", "Month"] }
  },
  { timestamps: true }
);

// ─── Customer Compliance Sub-Schema ─────────────────────────────────────────
const customerComplianceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    financialYear: { type: String, required: true }, // e.g. "2025-2026"
    name: { type: String, required: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ["To Be Done", "Ongoing", "Done"],
      default: "To Be Done"
    },
    completedOn: { type: Date },
    accountant: { type: String }, // name of accountant assigned
    // Detailed configuration fields from template
    hasExpiry: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ─── Customer Main Schema ────────────────────────────────────────────────────
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    state: { type: String },
    gst: { type: String },
    type: {
      type: String,
      enum: [
        "Sole Proprietorship", "Partnership", "LLP",
        "Private Limited Company", "Public Limited Company",
        "OPC", "Trust", "NGO", "Other"
      ]
    },
    incorporationDate: { type: Date },
    newlyIncorporated: { type: Boolean, default: false },
    onboardingDate: { type: Date, default: Date.now },
    username: { type: String, unique: true, sparse: true },
    password: { type: String }, // plain generated password for portal
    emails: [{ type: String }],
    financialYears: [{ type: String }], // attached FYs, e.g. ["2025-2026"]
    saleBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Director = mongoose.model("Director", directorSchema);
export const CustomerService = mongoose.model("CustomerService", customerServiceSchema);
export const CustomerCompliance = mongoose.model("CustomerCompliance", customerComplianceSchema);
export default mongoose.model("Customer", customerSchema);