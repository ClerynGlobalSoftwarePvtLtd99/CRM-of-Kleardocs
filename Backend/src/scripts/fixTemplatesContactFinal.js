import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const fixTemplates = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const templates = await EmailTemplate.find({});
        console.log(`Found ${templates.length} templates.`);

        const correctContactBlock = `
<div class="text-center w-full mt-6 space-y-2" style="text-align: center; margin-top: 20px;">
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">📞 Call: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="tel:+919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">💬 WhatsApp: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="https://wa.me/919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">📧 Email 1: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:info@kleardocs.com">info@kleardocs.com</a></p>
  <p style="margin: 0 0 0 0; color: #008CBA; font-weight: bold;">📧 Email 2: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:kleardocssolutions@gmail.com">kleardocssolutions@gmail.com</a></p>
</div>`.trim();

        let updatedCount = 0;

        for (const template of templates) {
            let body = template.body;
            let originalBody = body;

            // 1. Remove the specific redundant string requested by user
            const redundantString = /📧\s*Contact\s*us:\s*contact@startupstation\.in/gi;
            body = body.replace(redundantString, "");

            // 2. Identify the redundant blocks with multiple phone numbers/emails
            // This regex looks for the specific mess created by the previous script
            const messyBlockRegex = /<div[^>]*style="[^"]*text-align:\s*center;[^"]*"[^>]*>.*?Phone numbers:.*?Phone numbers:.*?Email\s*:.*?Email:.*?<\/div>/si;
            
            if (messyBlockRegex.test(body)) {
                console.log(`[FIXING MESSY BLOCK] ${template.name}`);
                body = body.replace(messyBlockRegex, correctContactBlock);
            }

            // 3. Fallback: Clean up any remaining "Contact Details" or "Contact Us" sections that might have leftovers
            // or were missed by the messyBlockRegex but still have the old email.
            const contactSectionRegex = /<h3[^>]*>(Contact Details|Contact Us)<\/h3>.*?<\/td>/si;
            if (contactSectionRegex.test(body) && (body.includes("startupstation.in") || body.match(/\+91\s*98755\s*15290/g)?.length > 2)) {
                 console.log(`[CLEANING SECTION] ${template.name}`);
                 body = body.replace(contactSectionRegex, `<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>${correctContactBlock}</td>`);
            }

            // 4. Final check for startupstation email anywhere else
            if (body.includes("contact@startupstation.in")) {
                console.log(`[REMOVING REMAINING OLD EMAIL] ${template.name}`);
                body = body.replace(/contact@startupstation\.in/g, "info@kleardocs.com");
            }

            if (body !== originalBody) {
                template.body = body;
                await template.save();
                updatedCount++;
                console.log(`[UPDATED] ${template.name}`);
            }
        }

        console.log(`\nSuccessfully fixed ${updatedCount} templates.`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error fixing templates:", error);
        process.exit(1);
    }
};

fixTemplates();
