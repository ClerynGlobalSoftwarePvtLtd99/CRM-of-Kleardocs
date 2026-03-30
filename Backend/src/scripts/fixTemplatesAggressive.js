import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const fixTemplatesAggressive = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const templates = await EmailTemplate.find({});
        console.log(`Found ${templates.length} templates.`);

        const correctContactHtml = `
<div class="text-center w-full mt-6 space-y-2" style="text-align: center; margin-top: 20px;">
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">Phone: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="tel:+919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">WhatsApp: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="https://wa.me/919875515290">+91 98755 15290</a></p>
  <p style="margin: 0 0 5px 0; color: #008CBA; font-weight: bold;">Email 1: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:info@kleardocs.com">info@kleardocs.com</a></p>
  <p style="margin: 0 0 0 0; color: #008CBA; font-weight: bold;">Email 2: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:kleardocssolutions@gmail.com">kleardocssolutions@gmail.com</a></p>
</div>`.trim();

        let updatedCount = 0;

        for (const template of templates) {
            let body = template.body;
            let originalBody = body;

            // 1. ABSOLUTELY PURGE the old email string wherever it exists
            body = body.replace(/contact@startupstation\.in/gi, "info@kleardocs.com");
            
            // 2. Remove the "📧 Contact us: contact@startupstation.in" if it exists
            body = body.replace(/📧\s*Contact\s*us:\s*info@kleardocs\.com/gi, ""); // Replaced by previous step

            // 3. Detect and replace ANY block that looks like a contact info block
            // This includes the messy ones and the new style ones
            const contactSectionRegex = /(<h3[^>]*>(Contact Details|Contact Us)<\/h3>|<strong>(Contact Details|Contact Us)<\/strong>).*?(<\/td>|(?=<div)|(?=<p.*?>Relationship Manager)|<div class="text-center w-full mt-6 space-y-2")/si;
            
            if (contactSectionRegex.test(body)) {
                console.log(`[REPLACING CONTACT SECTION] ${template.name}`);
                // We'll replace up to the next logical boundary
                body = body.replace(contactSectionRegex, `<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>${correctContactHtml}</td>`);
            } else {
                // If no section found, look for individual messy blocks
                const messyBlockRegex = /<div[^>]*style="[^"]*text-align:\s*center;[^"]*"[^>]*>.*?Phone.*?(Email|WhatsApp).*?<\/div>/si;
                if (messyBlockRegex.test(body)) {
                    console.log(`[REPLACING MESSY BLOCK] ${template.name}`);
                    body = body.replace(messyBlockRegex, correctContactHtml);
                }
            }

            // 4. Manual cleanup for specifically mentioned templates if they fail regex
            if (template.name === 'DSC Organization' && body.includes('info@kleardocs.com')) {
                // Double check if labels match
                if (!body.includes('Phone:')) {
                     // Force fix
                     body = body.replace(/📞 Call:/g, 'Phone:');
                }
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

fixTemplatesAggressive();
