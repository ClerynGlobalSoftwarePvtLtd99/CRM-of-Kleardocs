import mongoose from "mongoose";

const leadHistorySchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    type: {
      type: String,
      enum: ["created", "updated", "followup", "interaction", "converted", "assigned", "email_update"],
      required: true
    },
    details: { type: String },
    phoneCalled: { type: Boolean, default: false },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    source: {
      type: String,
      enum: ["Instagram", "Facebook", "YouTube", "WhatsApp", "Referral", "Website", "Cold Call", "Other"],
      default: "Other"
    },
    type: { type: String, enum: ["Hot", "Cold", "Warm"], default: "Cold" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    response: {
      type: String,
      enum: ["Interested", "Not Interested", "Call Back", "No Response", "Converted"],
      default: "No Response"
    },
    address: { type: String },
    state: { type: String },
    emails: [{ type: String }],
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nextFollowup: { type: Date },
    lastFollowup: { type: Date },
    isCustomer: { type: Boolean, default: false },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const LeadHistory = mongoose.model("LeadHistory", leadHistorySchema);
export default mongoose.model("Lead", leadSchema);