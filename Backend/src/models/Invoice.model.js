import mongoose from "mongoose";

// ─── Invoice Item Sub-Schema ──────────────────────────────────────────────────
const invoiceItemSchema = new mongoose.Schema({
  no: { type: Number },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  hsn: { type: String, default: "998399" },
  description: { type: String },            // service name shown on invoice
  quantity: { type: Number, default: 1 },
  professionalFees: { type: Number, default: 0 },
  govtFees: { type: Number, default: 0 },
  price: { type: Number, default: 0 },      // professionalFees + govtFees
  gstPercent: { type: Number, default: 0 }, // 0 or 18 (total GST rate)
  gstAmount: { type: Number, default: 0 },  // total GST (cgst+sgst or igst)
  // GST split: West Bengal → cgst+sgst; Other states → igst
  cgst: { type: Number, default: 0 },       // 9% for West Bengal
  sgst: { type: Number, default: 0 },       // 9% for West Bengal
  igst: { type: Number, default: 0 },       // 18% for other states
  amount: { type: Number, default: 0 }      // price + gstAmount
});

// ─── Invoice Schema ───────────────────────────────────────────────────────────
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    placeOfSupply: { type: String },          // derived from customer state
    items: [invoiceItemSchema],

    // Totals (calculated and stored for fast reads)
    subTotal: { type: Number, default: 0 },   // sum of item prices
    totalGst: { type: Number, default: 0 },   // sum of item gstAmounts
    total: { type: Number, default: 0 },      // subTotal + totalGst
    paid: { type: Number, default: 0 },       // sum of payments
    due: { type: Number, default: 0 },        // total - paid
    // GST type determined by customer state
    gstType: { type: String, enum: ["CGST_SGST", "IGST"], default: "IGST" }, // CGST_SGST for West Bengal
    totalCgst: { type: Number, default: 0 },  // sum of item cgst (West Bengal only)
    totalSgst: { type: Number, default: 0 },  // sum of item sgst (West Bengal only)
    totalIgst: { type: Number, default: 0 },  // sum of item igst (other states)

    // Recurring invoice link
    recurringInvoice: { type: mongoose.Schema.Types.ObjectId, ref: "RecurringInvoice" },
    isRecurring: { type: Boolean, default: false },

    // Compliance link (for auto-status update)
    compliance: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerCompliance" },

    description: { type: String }, // Optional invoice description

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// ─── Payment Schema ───────────────────────────────────────────────────────────
// Stored in separate collection — also embedded in invoice.paid recalculated
const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, required: true },
    mode: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Bank Transfer", "Cheque", "Other"],
      default: "UPI"
    },
    note: { type: String },
    paymentDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const InvoicePayment = mongoose.model("InvoicePayment", paymentSchema);
export default mongoose.model("Invoice", invoiceSchema);