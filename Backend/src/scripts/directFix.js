import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const directFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const templates = await EmailTemplate.find({});
        
        for (const t of templates) {
            let body = t.body;
            
            // Final aggressive replacement for the specific string
            body = body.replace(/contact@startupstation\.in/gi, "info@kleardocs.com");
            
            // And any emoji versions
            body = body.replace(/📧\s*Contact\s*us:\s*info@kleardocs\.com/gi, "");
            
            if (body !== t.body) {
                t.body = body;
                await t.save();
                console.log(`[FIXED EMAIL] ${t.name}`);
            }
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
directFix();
