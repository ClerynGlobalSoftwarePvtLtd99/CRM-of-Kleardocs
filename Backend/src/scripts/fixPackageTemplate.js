import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const fixPackageTemplate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const t = await EmailTemplate.findOne({ name: 'Package plus payment details' });
        if (!t) { console.log("Template not found."); process.exit(1); }

        let body = t.body;

        // Remove the old "Contact Us:" h3 block + the paragraph containing old contact info
        // This regex matches from <h3...>Contact Us:</h3> all the way through
        // the "Thanks & Regards..." paragraph and up to </td></tr></tbody>
        body = body.replace(
            /<h3[^>]*>Contact Us:<\/h3>\s*<p[^>]*>.*?<\/p>\s*<p[^>]*>Thanks.*?<\/p>\s*<\/td><\/tr><\/tbody>/si,
            `</td></tr></tbody>`
        );

        // Also remove the Quick Links / Access CRM / Leave a Review block if present
        body = body.replace(
            /<h3[^>]*>Quick Links:<\/h3>.*?<\/p>\s*/si,
            ``
        );

        // Remove any lingering "Website: www.startupstation.in" references
        body = body.replace(/Website:\s*www\.startupstation\.in/gi, "");

        // Remove "Phone numbers: +91 98755 15290" duplications (old format)
        body = body.replace(/Phone numbers:\s*\+91\s*98755\s*15290\s*/gi, "");

        // Remove "Email : info@kleardocs.com" old format
        body = body.replace(/Email\s*:\s*info@kleardocs\.com\s*/gi, "");

        // Remove "Thanks & Regards, Startup Station..." block
        body = body.replace(/Thanks\s*&amp;\s*Regards,\s*<br\s*\/?>\s*Startup Station.*?<\/p>/gi, "");

        // Remove "Thanks & Regards, KlearDocs..." block (from source version)
        body = body.replace(/<p[^>]*>Thanks\s*&amp;\s*Regards,\s*<br>KlearDocs.*?<\/p>/si, "");

        console.log("Saving fixed template...");
        t.body = body;
        await t.save();
        console.log("[FIXED] Package plus payment details");

        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};

fixPackageTemplate();
