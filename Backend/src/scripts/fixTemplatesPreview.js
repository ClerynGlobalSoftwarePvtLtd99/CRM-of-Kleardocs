import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";
import { SEED_TEMPLATES } from "../constants/templatesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const TEMPLATE_NAMES_TO_FIX = [
    "DSC Organization",
    "GST Registration",
    "GST Filing",
    "Service List",
    "INC 20A Reminder",
    "ROC plus GST plus ESI plus TDS",
    "Annual Compliance plus Bookkeeping"
];

const fixTemplates = async () => {
    try {
        console.log("Connecting to MongoDB...");
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        let updatedCount = 0;

        for (const templateName of TEMPLATE_NAMES_TO_FIX) {
            const seedData = SEED_TEMPLATES.find(t => t.name === templateName);
            if (!seedData) {
                console.warn(`[WARNING] Template "${templateName}" not found in SEED_TEMPLATES.`);
                continue;
            }

            const dbTemplate = await EmailTemplate.findOne({ name: templateName });
            if (dbTemplate) {
                console.log(`[UPDATING] ${templateName}...`);
                dbTemplate.body = seedData.body;
                dbTemplate.subject = seedData.subject;
                await dbTemplate.save();
                updatedCount++;
                console.log(`[SUCCESS] ${templateName} updated.`);
            } else {
                console.log(`[NOT FOUND] ${templateName} - Creating new entry...`);
                await EmailTemplate.create(seedData);
                updatedCount++;
                console.log(`[SUCCESS] ${templateName} created.`);
            }
        }

        console.log(`\nSuccessfully processed ${updatedCount} templates.`);
        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing templates:", error);
        process.exit(1);
    }
};

fixTemplates();
