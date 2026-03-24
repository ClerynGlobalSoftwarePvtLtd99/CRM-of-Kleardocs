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

const seedTemplates = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        console.log("Clearing existing templates...");
        await EmailTemplate.deleteMany({});
        console.log("Collection cleared.");

        console.log(`Seeding ${SEED_TEMPLATES.length} templates...`);
        const result = await EmailTemplate.insertMany(SEED_TEMPLATES);
        console.log(`Successfully seeded ${result.length} templates.`);

        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding templates:", error);
        process.exit(1);
    }
};

seedTemplates();
