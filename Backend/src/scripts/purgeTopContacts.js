import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "../models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const purgeTopContacts = async () => {
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
            let originalBody = body;

            // 1. If there's emoji-based contact info at the VERY START (within first 200 chars), remove it
            // Case 1: 📞 Call or similar at the start
            const emojiContactAtStart = /^\s*(\+?\d+|📞|💬|📧|Phone|WhatsApp|Email).*?(info@kleardocs|kleardocssolutions|contact@startupstation).*?[\r\n\s]+/si;
            if (emojiContactAtStart.test(body)) {
                console.log(`[PURGING TOP CONTACT] ${t.name}`);
                body = body.replace(emojiContactAtStart, "");
            }

            // 2. Remove ANY Contact Details block that is NOT at the intended location (bottom)
            // We'll replace ALL existing Contact Details blocks with an empty string first
            // and then re-inject ONE at the correct location.
            const allContactBlocks = /<h3[^>]*>Contact Details<\/h3>.*?<\/td>/gis;
            body = body.replace(allContactBlocks, "");
            
            const messyDivBlocks = /<div class="text-center w-full mt-6 space-y-2".*?<\/div>/gis;
            body = body.replace(messyDivBlocks, "");

            // 3. Now re-inject a SINGLE clean contact details block at the BOTTOM 
            // We'll look for the last </td> inside the table structures
            if (body.includes("</table>")) {
                 // Try to find the last </td> before the closing </tbody> or </table>
                 const parts = body.split("</td>");
                 if (parts.length > 1) {
                     // Last cell usually contains either the review link or the contact details site
                     // We'll append it before the very last </td> or just before the closing </table>
                     if (body.includes('Leave a Review')) {
                         // Some templates have "Leave a Review" in a separate <tr>.
                         // We want the contact info BEFORE it.
                         body = body.replace(/<tr>\s*<td style="padding: 20px; text-align: center;">\s*<a[^>]*>Leave a Review/i, (match) => {
                             return `<tr><td style="padding: 15px; background: #f0f8ff; text-align: center;">\n<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>\n${finalContactHtml}\n</td></tr>\n${match}`;
                         });
                     } else {
                         // Common fallback: append to end of table
                         body = body.replace(/<\/tbody>\s*<\/table>/i, `<tr><td style="padding: 15px; background: #f0f8ff; text-align: center;">\n<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>\n${finalContactHtml}\n</td></tr>\n</tbody>\n</table>`);
                     }
                 }
            } else {
                body += `<br><hr><br><h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA;">Contact Details</h3>${finalContactHtml}`;
            }

            // 4. One final global replace for the old email just in case
            body = body.replace(/contact@startupstation\.in/gi, "info@kleardocs.com");

            if (body !== t.body) {
                t.body = body;
                await t.save();
                console.log(`[SUCCESS] Fixed positioning for ${t.name}`);
            }
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
purgeTopContacts();
