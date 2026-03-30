import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const updateTemplates = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const templates = await EmailTemplate.find({});
        console.log(`Found ${templates.length} templates.`);

        let updatedCount = 0;

        // Tailwind classes: text-center, font-bold, text-blue-600, etc.
        const newContactInfoTailwind = `
<div class="text-center w-full mt-6 space-y-2" style="text-align: center;">
  <p class="font-bold text-blue-600" style="color: #007bff; font-weight: bold; margin: 0;">Phone numbers: +91 98755 15290</p>
  <p class="font-bold text-blue-600" style="color: #007bff; font-weight: bold; margin: 5px 0;">Phone numbers: +91 98755 15290</p>
  <br>
  <p class="font-bold text-blue-600" style="color: #007bff; font-weight: bold; margin: 0;">Email : info@kleardocs.com</p>
  <p class="font-bold text-blue-600" style="color: #007bff; font-weight: bold; margin: 5px 0;">Email: kleardocssolutions@gmail.com</p>
</div>
        `.trim();

        for (const template of templates) {
            let body = template.body;
            let originalBody = body;

            // 1. Broadly search for "Contact Details" section or key contact labels
            const contactSectionRegex = /(<h3[^>]*>|<strong>)Contact Details(<\/h3>|<\/strong>).*?<\/td>/si;
            const fallbackPatterns = [
                /(<[^>]+>)?(Relationship Manager|Business Development Manager|Phone):?(<\/[^>]+>)?\s*(<a[^>]*>)?\+?91[\s-]*[0-9\s-]+(<\/a>)?/gi,
                /(<[^>]+>)?(Email|Contact us|📧 Contact us):?(<\/[^>]+>)?\s*(<a[^>]*>)?[\w.-]+@(startupstation|kleardocs|gmail)\.[\w.-]+(<\/a>)?/gi
            ];

            let matched = false;

            if (contactSectionRegex.test(body)) {
                // Replace the entire section
                body = body.replace(contactSectionRegex, `<h3 class="text-center font-bold text-blue-600" style="text-align: center; color: #004AAD; margin-bottom: 10px;">Contact Details</h3>${newContactInfoTailwind}</td>`);
                matched = true;
            } else {
                // Search for individual labels and replace with the new block (removing the old ones)
                // This is slightly destructive but necessary for consistency. 
                // We'll replace the first occurrence found with the new block and remove subsequent occurrences.
                let phoneMatched = false;
                let emailMatched = false;

                body = body.replace(fallbackPatterns[0], (match) => {
                    if (!phoneMatched && !matched) {
                        phoneMatched = true;
                        return newContactInfoTailwind;
                    }
                    return ""; // Remove subsequent phone labels
                });

                body = body.replace(fallbackPatterns[1], (match) => {
                    if (!emailMatched && !phoneMatched && !matched) {
                        emailMatched = true;
                        matched = true;
                        return newContactInfoTailwind;
                    }
                    return ""; // Remove subsequent email labels
                });
                
                if (phoneMatched || emailMatched) matched = true;
            }

            // 3. Absolute Fallback: Append if no contact info was found at all
            if (!matched) {
                console.log(`[APPENDING] ${template.name}`);
                // Find where the main content ends (often before a closing table or div)
                if (body.includes("</table>")) {
                    body = body.replace(/<\/table>\s*$/, `<tr><td style="padding: 20px;">${newContactInfoTailwind}</td></tr></table>`);
                } else if (body.includes("</div>")) {
                    body = body.replace(/<\/div>\s*$/, `<div style="padding-top: 20px;">${newContactInfoTailwind}</div></div>`);
                } else {
                    body += `<br><hr><br>${newContactInfoTailwind}`;
                }
            }

            if (body !== originalBody) {
                template.body = body;
                await template.save();
                updatedCount++;
                console.log(`[UPDATED] ${template.name}`);
            } else {
                console.log(`[NO CHANGE] ${template.name}`);
            }
        }

        console.log(`\nSuccessfully updated ${updatedCount} out of ${templates.length} templates.`);

        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating templates:", error);
        process.exit(1);
    }
};

updateTemplates();
