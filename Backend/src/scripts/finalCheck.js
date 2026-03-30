import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const checkAndFixOnceMore = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Checking database...");
        const templates = await EmailTemplate.find({ 
            body: { $regex: /contact@startupstation\.in/i } 
        });
        
        console.log(`Found ${templates.length} templates still containing old email.`);
        
        for (const t of templates) {
            console.log(`Fixing: ${t.name}`);
            t.body = t.body.replace(/contact@startupstation\.in/gi, "info@kleardocs.com");
            await t.save();
        }
        
        // Also check for the user's specific complaint about DSC Organization
        const dsc = await EmailTemplate.findOne({ name: 'DSC Organization' });
        if (dsc) {
            console.log(`DSC Organization current state: ${dsc.body.substring(dsc.body.indexOf('Contact Details') - 20, dsc.body.indexOf('Contact Details') + 500)}`);
            // Force replace if not right
            if (dsc.body.includes('📞 Call:')) {
                 console.log("Fixing DSC labels...");
                 dsc.body = dsc.body.replace(/📞 Call:/g, 'Phone:').replace(/💬 WhatsApp:/g, 'WhatsApp:').replace(/📧 Email 1:/g, 'Email 1:').replace(/📧 Email 2:/g, 'Email 2:');
                 await dsc.save();
            }
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
checkAndFixOnceMore();
