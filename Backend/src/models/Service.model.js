import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    professionalFees: { type: Number, default: 0 },
    govtFees: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    hsn: { type: String, default: "998399" },
    template: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
