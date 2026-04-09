import mongoose from "mongoose";
import dotenv from "dotenv";
import * as customerService from "../src/services/customer.service.js";
import Customer from "../src/models/Customer.model.js";
import Service from "../src/models/Service.model.js";

dotenv.config();

const testAddService = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Get a test customer
    const customer = await Customer.findOne();
    if (!customer) {
      console.log("No customer found to test");
      process.exit(0);
    }
    console.log("Testing with customer:", customer.name, "(", customer._id, ")");

    // 2. Get a test service
    const service = await Service.findOne({ name: "Annual Compliance" }) || await Service.findOne();
    if (!service) {
      console.log("No service master found to test");
      process.exit(0);
    }
    console.log("Testing with service:", service.name, "(", service._id, ")");

    // 3. Try to add service
    console.log("Calling customerService.addService...");
    const result = await customerService.addService(
      customer._id.toString(),
      {
        serviceId: service._id.toString(),
        startDate: new Date().toISOString().split('T')[0],
        professionalFees: 1000,
        govtFees: 500,
        gst: 18,
        recurring: false
      },
      null // userId
    );

    console.log("addService result:", JSON.stringify(result, null, 2));

    // 4. Check if invoice was created
    const { default: Invoice } = await import("../src/models/Invoice.model.js");
    const invoices = await Invoice.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(1);
    console.log("Recent Invoices count for this customer:", invoices.length);
    if (invoices.length > 0) {
      console.log("Latest Invoice details:", JSON.stringify(invoices[0], null, 2));
    } else {
      console.log("FAILED: No invoice found for this customer after addService.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("FATAL ERROR IN TEST:", error);
  }
};

testAddService();
