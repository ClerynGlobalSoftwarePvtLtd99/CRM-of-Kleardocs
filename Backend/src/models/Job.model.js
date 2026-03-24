import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    jobTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ["To be done", "Ongoing", "Done"],
      default: "To be done"
    },
    accountant: { type: String }, // name like "Samrat", "Tapas", "Jagjyot"
    hasExpiry: { type: Boolean, default: false },
    expiryDate: { type: Date },
    completedOn: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);