import mongoose from "mongoose";

// ─── Recurring Invoice Item Sub-Schema ───────────────────────────────────────
const riItemSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  description: { type: String },
  professionalFees: { type: Number, default: 0 },
  govtFees: { type: Number, default: 0 },
  gstPercent: { type: Number, default: 0 },
  hsn: { type: String, default: "998399" }
});

// ─── Recurring Invoice Schema ─────────────────────────────────────────────────
const recurringInvoiceSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [riItemSchema],

    startDate: { type: Date },
    endDate: { type: Date },
    nextDate: { type: Date },     // next generation date (managed by cron)
    lastGenerated: { type: Date },

    interval: { type: Number, default: 1 },
    intervalType: { type: String, enum: ["Day", "Month"], default: "Month" },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    description: { type: String }, // Optional recurring invoice description

    // Generated invoices linked back
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("RecurringInvoice", recurringInvoiceSchema);
