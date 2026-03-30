import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const finalPolish = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const templates = await EmailTemplate.find({});
        
        const finalContactHtml = `
<div class="text-center w-full mt-6 space-y-2" style="text-align: center; margin-top: 20px;">
  <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Phone: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="tel:+919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">WhatsApp: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="https://wa.me/919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Email 1:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:info@kleardocs.com">info@kleardocs.com</a></p>
  <p style="margin: 0 0 0 0; color: #008CBA; font-weight: bold;">Email 2:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:kleardocssolutions@gmail.com">kleardocssolutions@gmail.com</a></p>
</div>`.trim();

        for (const t of templates) {
            let body = t.body;
            
            // Aggressive replacement of the contact section with the polished version
            const sectionRegex = /<h3[^>]*>Contact Details<\/h3>.*?<\/td>/si;
            if (sectionRegex.test(body)) {
                body = body.replace(sectionRegex, `<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>${finalContactHtml}</td>`);
            } else if (body.includes('info@kleardocs.com')) {
                // If the section regex failed but our emails are there, it's probably the messy div style
                const messyDivRegex = /<div[^>]*style="[^"]*text-align:\s*center;[^"]*"[^>]*>.*?info@kleardocs\.com.*?<\/div>/si;
                body = body.replace(messyDivRegex, finalContactHtml);
            }
            
            // Final check for the old email just in case
            body = body.replace(/contact@startupstation\.in/gi, "info@kleardocs.com");

            if (body !== t.body) {
                t.body = body;
                await t.save();
                console.log(`[POLISHED] ${t.name}`);
            }
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
finalPolish();
