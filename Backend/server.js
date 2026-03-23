import app from "./src/app.js";
import "./src/config/config.js";
import { connectDB } from "./src/config/db.js";
import { startRecurringInvoiceCron } from "./src/cron/automation.cron.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        startRecurringInvoiceCron(); // ← daily 6AM cron for recurring invoices
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

startServer();
