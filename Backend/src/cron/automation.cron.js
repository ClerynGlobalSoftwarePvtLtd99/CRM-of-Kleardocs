import cron from "node-cron";
import { generateDueRecurringInvoices } from "../services/invoice.service.js";

/**
 * Recurring Invoice Cron Job
 * Runs every day at 6:00 AM
 * Checks for recurring invoices whose nextDate <= now and generates actual invoices
 */
export const startRecurringInvoiceCron = () => {
  cron.schedule("0 6 * * *", async () => {
    console.log("[CRON] Running recurring invoice generation —", new Date().toISOString());
    try {
      const count = await generateDueRecurringInvoices();
      console.log(`[CRON] ✅ Generated ${count} recurring invoice(s)`);
    } catch (err) {
      console.error("[CRON] ❌ Error generating recurring invoices:", err.message);
    }
  });

  console.log("[CRON] Recurring invoice cron registered — runs daily at 6:00 AM");
};