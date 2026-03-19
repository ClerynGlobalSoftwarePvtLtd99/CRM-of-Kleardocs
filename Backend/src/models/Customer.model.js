import mongoose from "mongoose";

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
      enum: ["Sole Proprietorship", "Partnership", "LLP", "Private Limited Company", "Public Limited Company", "OPC", "Trust", "NGO", "Other"]
    },
    incorporationDate: { type: Date },
    newlyIncorporated: { type: Boolean, default: false },
    onboardingDate: { type: Date, default: Date.now },
    username: { type: String, unique: true },
    password: { type: String }, // plain generated password stored for portal access
    emails: [{ type: String }],
    saleBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);