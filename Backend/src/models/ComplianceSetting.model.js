import mongoose from "mongoose";

// ─── Financial Year Schema ────────────────────────────────────────────────────
const financialYearSchema = new mongoose.Schema(
  {
    financialYear: { type: String, required: true, unique: true } // "2025-2026"
  },
  { timestamps: true }
);

// ─── Compliance Setting Schema ────────────────────────────────────────────────
// Global templates — when a customer gets a financial year added,
// all ComplianceSetting entries for that year are cloned into CustomerCompliance
const complianceSettingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    financialYear: { type: String, required: true },         // "2025-2026"
    hasExpiry: { type: Boolean, default: false },
    expiryDate: { type: Date },
    forNewCompany: { type: Boolean, default: false },        // new companies only
    isNewCompany: { type: Boolean, default: false },        // new companies only
    inc20: { type: Boolean, default: false },        // INC-20A relevant
    daysOfExpiry: { type: Number, default: 30 },
    expiryTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "EmailTemplate" },
    completeTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "EmailTemplate" }
  },
  { timestamps: true }
);

export const FinancialYear = mongoose.model("FinancialYear", financialYearSchema);
export default mongoose.model("ComplianceSetting", complianceSettingSchema);
