import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true }, // Rich text or HTML
    type: { 
      type: String, 
      enum: ["Email", "WhatsApp"], 
      default: "Email" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("EmailTemplate", emailTemplateSchema);