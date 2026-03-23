import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema({
  invoicePrefix: { type: String, default: "INV-24-25" },
  invoiceStartingNumber: { type: Number, default: 10835 },
  emailFromName: { type: String, default: "Kleardocs" },
  fromEmail: { type: String, default: "kleardocssolutions@gmail.com" },
  
  invoiceTemplate: { type: String },
  gstTemplate: { type: String, default: "GST Filing" },
  ptaxTemplate: { type: String, default: "Professional Tax" },
  startupIndiaTemplate: { type: String, default: "Startup India Promotion" },
  inc20Template: { type: String, default: "INC 20A Reminder" },
  recurringInvoiceTemplate: { type: String, default: "Next Quarter Payment" },
  serviceListTemplate: { type: String, default: "Startup India Registration" },
  websiteTemplate: { type: String, default: "Website" },
  isoTemplate: { type: String, default: "Service List" }
}, { timestamps: true });

export default mongoose.model("SystemSetting", systemSettingSchema);
