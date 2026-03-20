import mongoose from "mongoose";

// Alias — InvoicePayment is defined in Invoice.model.js
// This file re-exports it for convenience and to match the Payment model placeholder
export { InvoicePayment as default } from "./Invoice.model.js";