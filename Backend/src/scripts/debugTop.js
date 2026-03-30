import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const debugTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const templates = await EmailTemplate.find({});
        
        for (const t of templates) {
            console.log(`--- Template: ${t.name} ---`);
            console.log(`START: ${t.body.substring(0, 500)}`);
            console.log(`--------------------------`);
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
debugTemplates();
