import mongoose from "express"; // oh wait, I should import mongoose normally

import mongoosepkg from "mongoose";
const { Schema, model } = mongoosepkg;

const emailLogSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    template: { type: Schema.Types.ObjectId, ref: "EmailTemplate" },
    templateName: { type: String },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default model("EmailLog", emailLogSchema);