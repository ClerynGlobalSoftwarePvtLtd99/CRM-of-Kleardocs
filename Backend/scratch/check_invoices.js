import mongoose from "mongoose";
import dotenv from "dotenv";
import Invoice from "../src/models/Invoice.model.js";

dotenv.config();

const checkInvoices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const count = await Invoice.countDocuments();
    console.log("Total Invoices in DB:", count);

    const latest = await Invoice.find().sort({ createdAt: -1 }).limit(5).populate("customer", "name");
    console.log("Latest 5 Invoices:", JSON.stringify(latest, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

checkInvoices();
