import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: {type: String, required: true},
    role: {
      type: String,
      enum: ["admin", "agent", "accountant", "customer"],
      default: "agent"
    },
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    refreshToken: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);  