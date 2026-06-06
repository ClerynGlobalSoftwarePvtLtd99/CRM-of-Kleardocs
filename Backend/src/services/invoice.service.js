import Invoice, { InvoicePayment } from "../models/Invoice.model.js";
import RecurringInvoice from "../models/RecurringInvoice.model.js";
import Customer, { CustomerCompliance } from "../models/Customer.model.js";
import { ApiError } from "../utils/response.js";

// ─── West Bengal state variants (all-caps as stored in DB) ───────────────────
const WEST_BENGAL_VARIANTS = new Set(["WEST BENGAL", "WB", "WESTBENGAL"]);

// ─── Helper: determine GST type from customer state ──────────────────────────
const getGstType = (state) => {
  const upper = (state || "").toUpperCase().trim();
  return WEST_BENGAL_VARIANTS.has(upper) ? "CGST_SGST" : "IGST";
};

// ─── State code lookup (for placeOfSupply) ───────────────────────────────────
const STATE_CODES = {
  "ANDHRA PRADESH": "37", "ARUNACHAL PRADESH": "12", "ASSAM": "18",
  "BIHAR": "10", "CHHATTISGARH": "22", "GOA": "30", "GUJARAT": "24",
  "HARYANA": "06", "HIMACHAL PRADESH": "02", "JHARKHAND": "20",
  "KARNATAKA": "29", "KERALA": "32", "MADHYA PRADESH": "23",
  "MAHARASHTRA": "27", "MANIPUR": "14", "MEGHALAYA": "17", "MIZORAM": "15",
  "NAGALAND": "13", "ODISHA": "21", "PUNJAB": "03", "RAJASTHAN": "08",
  "SIKKIM": "11", "TAMIL NADU": "33", "TELANGANA": "36", "TRIPURA": "16",
  "UTTAR PRADESH": "09", "UTTARAKHAND": "05", "WEST BENGAL": "19",
  "DELHI": "07", "JAMMU AND KASHMIR": "01", "LADAKH": "38",
  "CHANDIGARH": "04", "DADRA AND NAGAR HAVELI": "26", "DAMAN AND DIU": "25",
  "LAKSHADWEEP": "31", "PUDUCHERRY": "34", "ANDAMAN AND NICOBAR": "35"
};

// ─── Helper: calculate item totals ───────────────────────────────────────────
const calcItem = (item, no, gstType = "IGST") => {
  const price = (Number(item.professionalFees) || 0) + (Number(item.govtFees) || 0);
  const gstPercent = Number(item.gstPercent) || 0;
  const gstAmount = Math.round((price * gstPercent) / 100 * 100) / 100;

  // GST Split based on customer state
  const isWestBengal = gstType === "CGST_SGST";
  const cgst = isWestBengal ? Math.round(gstAmount / 2 * 100) / 100 : 0;
  const sgst = isWestBengal ? Math.round((gstAmount - cgst) * 100) / 100 : 0; // handle odd paise
  const igst = isWestBengal ? 0 : gstAmount;

  return {
    no,
    service: item.serviceId || undefined,
    hsn: item.hsn || "998399",
    description: item.description || "",
    professionalFees: Number(item.professionalFees) || 0,
    govtFees: Number(item.govtFees) || 0,
    price,
    gstPercent,
    gstAmount,
    cgst,
    sgst,
    igst,
    amount: price + gstAmount
  };
};

// ─── Helper: recalculate invoice totals from payments ────────────────────────
const recalcDue = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) return;
  const payments = await InvoicePayment.find({ invoice: invoiceId });
  invoice.paid = payments.reduce((sum, p) => sum + p.amount, 0);
  invoice.due = Math.max(0, invoice.total - invoice.paid);
  await invoice.save();

  // ─── Auto-update compliance status if fully paid ──────────────────────────
  if (invoice.compliance && invoice.due < 0.01) {
    await CustomerCompliance.findByIdAndUpdate(invoice.compliance, {
      status: "Done",
      completedOn: new Date()
    });
  }

  return invoice;
};

// ─── Helper: auto-generate invoice number ────────────────────────────────────
const getNextInvoiceNo = async () => {
  const { default: SystemSetting } = await import("../models/SystemSetting.model.js");
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }

  const prefix = settings.invoicePrefix || "INV";
  const startNum = settings.invoiceStartingNumber || 1;

  try {
    // Find the latest invoice with the current prefix
    const latestInvoice = await Invoice.findOne({
      invoiceNo: { $regex: new RegExp(`^${prefix}`) }
    })
    .sort({ invoiceNo: -1 })
    .lean();

    let nextSequence = startNum;
    if (latestInvoice && latestInvoice.invoiceNo) {
      // Try to extract the numeric part at the end
      const match = latestInvoice.invoiceNo.match(/\d+$/);
      if (match) {
        const lastSequence = parseInt(match[0]);
        // If the last sequence found is greater than or equal to startNum, increment it
        if (lastSequence >= startNum) {
          nextSequence = lastSequence + 1;
        }
      }
    }

    // Format with at least 6 digits padding (as per user example 000001)
    return `${prefix}${String(nextSequence).padStart(6, "0")}`;
  } catch (err) {
    console.error("Error generating invoice number:", err);
    return `${prefix}${String(startNum).padStart(6, "0")}`;
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// INVOICE SERVICE
// ══════════════════════════════════════════════════════════════════════════════

// ─── 1. GET ALL INVOICES ──────────────────────────────────────────────────────
export const getInvoices = async (query) => {
  const {
    search, startDate, endDate,
    filterType, filterFn, filterValue,
    page = 1, limit = 20
  } = query;

  const filter = {};

  if (startDate || endDate) {
    filter.invoiceDate = {};
    if (startDate) filter.invoiceDate.$gte = new Date(startDate);
    if (endDate) filter.invoiceDate.$lte = new Date(endDate);
  }

  // Numeric field filter (price/gst/total/due)
  if (filterType && filterValue != null) {
    const val = Number(filterValue);
    if (filterFn === "gte") filter[filterType] = { $gte: val };
    else if (filterFn === "lte") filter[filterType] = { $lte: val };
    else filter[filterType] = val;
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Handle search separately (need customer lookup)
  let customerIds = [];
  if (search) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ]
    }).select("_id");
    customerIds = customers.map((c) => c._id);

    filter.$or = [
      { invoiceNo: { $regex: search, $options: "i" } },
      { customer: { $in: customerIds } }
    ];
  }

  const [invoices, count] = await Promise.all([
    Invoice.find(filter)
      .populate("customer", "name phone companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Invoice.countDocuments(filter)
  ]);

  return { invoices, count };
};

// ─── 2. CREATE INVOICE ────────────────────────────────────────────────────────
export const createInvoice = async (data, userId) => {
  const customer = await Customer.findById(data.customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  // Determine GST type from customer state
  const gstType = getGstType(customer.state);

  // Build items with calculated amounts and GST split
  const items = data.items.map((item, i) => calcItem(item, i + 1, gstType));
  const subTotal = items.reduce((s, it) => s + it.price, 0);
  const totalGst = items.reduce((s, it) => s + it.gstAmount, 0);
  const total = subTotal + totalGst;

  // GST split totals
  const totalCgst = items.reduce((s, it) => s + it.cgst, 0);
  const totalSgst = items.reduce((s, it) => s + it.sgst, 0);
  const totalIgst = items.reduce((s, it) => s + it.igst, 0);

  // Place of supply from customer state code
  const stateCode = STATE_CODES[customer.state?.toUpperCase()] || "";
  const placeOfSupply = stateCode ? `${stateCode} - ${customer.state}` : customer.state || "";

  const invoiceNo = await getNextInvoiceNo();

  const invoice = await Invoice.create({
    invoiceNo,
    invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
    customer: data.customerId,
    placeOfSupply,
    items,
    subTotal,
    totalGst,
    total,
    paid: 0,
    due: total,
    gstType,
    totalCgst,
    totalSgst,
    totalIgst,
    isRecurring: data.recurring || false,
    description: data.description || "",
    compliance: data.complianceId || undefined,
    createdBy: userId
  });

  // If recurring → create RecurringInvoice
  let ri = null;
  if (data.recurring && data.interval && data.intervalType) {
    const startDate = invoice.invoiceDate;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;
    const nextDate = calcNextDate(startDate, data.interval, data.intervalType);

    ri = await RecurringInvoice.create({
      customer: data.customerId,
      items: data.items.map((item) => ({
        service: item.serviceId || undefined,
        description: item.description || "",
        professionalFees: item.professionalFees || 0,
        govtFees: item.govtFees || 0,
        gstPercent: item.gstPercent || 0,
        hsn: item.hsn || "998399"
      })),
      startDate,
      endDate,
      nextDate,
      interval: data.interval,
      intervalType: data.intervalType,
      description: data.description || "",
      invoices: [invoice._id],
      createdBy: userId
    });

    invoice.recurringInvoice = ri._id;
    await invoice.save();

    // Populate customer info for the recurring invoice for frontend use
    ri = await RecurringInvoice.findById(ri._id).populate("customer", "name companyName phone");
  }

  return { invoice, recurringInvoice: ri };
};

// ─── 3. GET SINGLE INVOICE ────────────────────────────────────────────────────
export const getInvoiceById = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId)
    .populate("customer", "name phone companyName emails address state")
    .populate("items.service", "name hsn")
    .lean();

  if (!invoice) throw new ApiError(404, "Invoice not found");

  const payments = await InvoicePayment.find({ invoice: invoiceId })
    .sort({ paymentDate: -1 })
    .lean();

  return { ...invoice, payments };
};

// ─── 4. DELETE INVOICE ────────────────────────────────────────────────────────
export const deleteInvoice = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new ApiError(404, "Invoice not found");
  await InvoicePayment.deleteMany({ invoice: invoiceId });
  await invoice.deleteOne();
};

// ─── 4.1 UPDATE INVOICE DESCRIPTION ──────────────────────────────────────────
export const updateInvoiceDescription = async (invoiceId, description) => {
  const invoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    { description },
    { new: true }
  ).populate("customer", "name phone companyName emails address state")
   .populate("items.service", "name hsn");

  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT SERVICE
// ══════════════════════════════════════════════════════════════════════════════

// ─── 5. ADD PAYMENT ───────────────────────────────────────────────────────────
export const addPayment = async (invoiceId, data, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new ApiError(404, "Invoice not found");

  // Guard: cannot pay more than due
  if (data.amount > invoice.due + 0.01) {
    throw new ApiError(400, `Amount (₹${data.amount}) exceeds due amount (₹${invoice.due})`);
  }

  const payment = await InvoicePayment.create({
    invoice: invoiceId,
    customer: invoice.customer,
    amount: data.amount,
    mode: data.mode || "UPI",
    note: data.note || "",
    paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date()
  });

  // Auto-update invoice paid & due — return updated totals
  const updatedInvoice = await recalcDue(invoiceId);

  return {
    payment,
    invoiceTotals: {
      total: updatedInvoice.total,
      paid: updatedInvoice.paid,
      due: updatedInvoice.due
    }
  };
};

// ─── 6. DELETE PAYMENT ────────────────────────────────────────────────────────
export const deletePayment = async (invoiceId, paymentId) => {
  const payment = await InvoicePayment.findOne({ _id: paymentId, invoice: invoiceId });
  if (!payment) throw new ApiError(404, "Payment not found");
  await payment.deleteOne();
  await recalcDue(invoiceId);
};

// ─── 7. GET ALL PAYMENTS (global list) ────────────────────────────────────────
export const getAllPayments = async (query) => {
  const { search, startDate, endDate, type, page = 1, limit = 20 } = query;

  const filter = {};
  if (type) filter.mode = type;
  if (startDate || endDate) {
    filter.paymentDate = {};
    if (startDate) filter.paymentDate.$gte = new Date(startDate);
    if (endDate) filter.paymentDate.$lte = new Date(endDate);
  }

  let customerIds = [];
  if (search) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ]
    }).select("_id");
    customerIds = customers.map((c) => c._id);
    if (customerIds.length) filter.customer = { $in: customerIds };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [payments, count] = await Promise.all([
    InvoicePayment.find(filter)
      .populate("customer", "name companyName phone")
      .populate("invoice", "invoiceNo")
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    InvoicePayment.countDocuments(filter)
  ]);

  return { payments, count };
};

// ══════════════════════════════════════════════════════════════════════════════
// RECURRING INVOICE SERVICE
// ══════════════════════════════════════════════════════════════════════════════

// ─── Helper: calculate next date ─────────────────────────────────────────────
export const calcNextDate = (from, interval, intervalType) => {
  const d = new Date(from);
  if (intervalType === "Month") d.setMonth(d.getMonth() + interval);
  else d.setDate(d.getDate() + interval);
  return d;
};

// ─── 8. GET ALL RECURRING INVOICES ───────────────────────────────────────────
export const getRecurringInvoices = async (query) => {
  const { search, dateType, startDate, endDate, status, page = 1, limit = 20 } = query;
  const filter = {};
  if (status) filter.status = status;

  if (startDate || endDate) {
    const field = dateType === "end" ? "endDate" : dateType === "next" ? "nextDate" :
                  dateType === "start" ? "startDate" : "createdAt";
    filter[field] = {};
    if (startDate) filter[field].$gte = new Date(startDate);
    if (endDate) filter[field].$lte = new Date(endDate);
  }

  let customerIds = [];
  if (search) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ]
    }).select("_id");
    customerIds = customers.map((c) => c._id);
    if (customerIds.length) filter.customer = { $in: customerIds };
    else filter.customer = new mongoose.Types.ObjectId(); // No matches
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [ris, count] = await Promise.all([
    RecurringInvoice.find(filter)
      .populate("customer", "name companyName phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    RecurringInvoice.countDocuments(filter)
  ]);

  return { recurringInvoices: ris, count };
};

// ─── 8.1 GET ALL RECURRING INVOICES FOR EXPORT ───────────────────────────────
export const getAllRecurringInvoicesForExport = async (query) => {
  const { search, dateType, startDate, endDate, status } = query;
  const filter = {};
  if (status) filter.status = status;

  if (startDate || endDate) {
    const field = dateType === "end" ? "endDate" : dateType === "next" ? "nextDate" :
                  dateType === "start" ? "startDate" : "createdAt";
    filter[field] = {};
    if (startDate) filter[field].$gte = new Date(startDate);
    if (endDate) filter[field].$lte = new Date(endDate);
  }

  if (search) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } }
      ]
    }).select("_id");
    const customerIds = customers.map((c) => c._id);
    if (customerIds.length) filter.customer = { $in: customerIds };
    else filter.customer = new mongoose.Types.ObjectId(); 
  }

  const ris = await RecurringInvoice.find(filter)
    .populate("customer", "name companyName phone")
    .populate("items.service", "name")
    .sort({ createdAt: -1 })
    .lean();

  return ris;
};

// ─── 9. GET SINGLE RECURRING INVOICE ─────────────────────────────────────────
export const getRecurringInvoiceById = async (riId) => {
  const ri = await RecurringInvoice.findById(riId)
    .populate("customer", "name companyName phone emails")
    .populate("items.service", "name hsn")
    .populate("invoices")
    .lean();
  if (!ri) throw new ApiError(404, "Recurring invoice not found");
  return ri;
};

// ─── 10. DISABLE RECURRING INVOICE ───────────────────────────────────────────
export const disableRecurringInvoice = async (riId) => {
  const ri = await RecurringInvoice.findById(riId);
  if (!ri) throw new ApiError(404, "Recurring invoice not found");
  ri.status = ri.status === "Active" ? "Inactive" : "Active";
  await ri.save();
  return ri;
};

// ─── 11. CRON — generate due recurring invoices ──────────────────────────────
export const generateDueRecurringInvoices = async () => {
  const now = new Date();
  const due = await RecurringInvoice.find({
    status: "Active",
    nextDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }]
  }).populate("customer");

  let generated = 0;
  for (const ri of due) {
    if (!ri.customer) continue;

    // Determine GST type from customer state
    const gstType = getGstType(ri.customer.state);

    // Build invoice items with GST split
    const items = ri.items.map((item, i) => calcItem({
      serviceId: item.service,
      description: item.description,
      professionalFees: item.professionalFees,
      govtFees: item.govtFees,
      gstPercent: item.gstPercent,
      hsn: item.hsn
    }, i + 1, gstType));

    const subTotal = items.reduce((s, it) => s + it.price, 0);
    const totalGst = items.reduce((s, it) => s + it.gstAmount, 0);
    const total = subTotal + totalGst;
    const totalCgst = items.reduce((s, it) => s + it.cgst, 0);
    const totalSgst = items.reduce((s, it) => s + it.sgst, 0);
    const totalIgst = items.reduce((s, it) => s + it.igst, 0);
    const stateCode = STATE_CODES[ri.customer.state?.toUpperCase()] || "";
    const placeOfSupply = stateCode ? `${stateCode} - ${ri.customer.state}` : ri.customer.state || "";
    const invoiceNo = await getNextInvoiceNo();

    const invoice = await Invoice.create({
      invoiceNo,
      invoiceDate: now,
      customer: ri.customer._id,
      placeOfSupply,
      items,
      subTotal,
      totalGst,
      total,
      paid: 0,
      due: total,
      gstType,
      totalCgst,
      totalSgst,
      totalIgst,
      isRecurring: true,
      description: ri.description || "",
      recurringInvoice: ri._id
    });


    // Update recurring invoice
    ri.invoices.push(invoice._id);
    ri.lastGenerated = now;
    ri.nextDate = calcNextDate(now, ri.interval, ri.intervalType);

    // Deactivate if end date passed
    if (ri.endDate && ri.nextDate > ri.endDate) ri.status = "Inactive";
    await ri.save();
    generated++;
  }

  return generated;
};