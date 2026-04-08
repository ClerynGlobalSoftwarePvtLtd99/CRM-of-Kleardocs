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

// ─── Installment Sub-Schema ──────────────────────────────────────────────────
const installmentSchema = new mongoose.Schema({
  number: { type: Number, required: true },     // 1, 2, 3, 4...
  amount: { type: Number, required: true },     // Amount for this installment
  dueDate: { type: Date, required: true },     // When this installment is due
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }, // Linked invoice
  status: { 
    type: String, 
    enum: ["Pending", "Invoiced", "Paid"], 
    default: "Pending" 
  },
  paidDate: { type: Date },                     // When payment was made
  paidAmount: { type: Number, default: 0 }      // Actual amount paid
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

    // Installment tracking
    totalInstallments: { type: Number, default: 1 },  // Number of installments (e.g., 4)
    installmentIntervalMonths: { type: Number, default: 1 }, // Months between installments
    installments: [installmentSchema], // Pre-calculated installments

    // Generated invoices linked back
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("RecurringInvoice", recurringInvoiceSchema);
