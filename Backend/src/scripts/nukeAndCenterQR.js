import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

const EmailTemplateSchema = new mongoose.Schema({
  name: String,
  body: String
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function nukeAndFix() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const qrPath = path.join(process.cwd(), "..", "PaymentQR.jpeg");
    const qrBase64 = fs.readFileSync(qrPath, { encoding: 'base64' });
    const qrDataUri = `data:image/jpeg;base64,${qrBase64}`;

    const names = ["Next Quarter Payment", "Package plus payment details"];

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        console.log(`Processing ${name}...`);
        let body = template.body;

        // 1. COMPLETELY NUKE the payment section to avoid any duplication or left-over tags
        // We look for everything from "Payment Details" down to "Please let us know" or "Contact Details"
        // and clean up any mess in between.
        
        // Remove ALL occurrences of "Scan to Pay" and "QR Code" text, regardless of tags
        body = body.replace(/Scan to Pay[:\s]*QR Code/gi, "");
        body = body.replace(/QR Code/gi, "");
        body = body.replace(/Scan to Pay/gi, "");
        
        // Remove any existing base64 images
        body = body.replace(/<img[^>]*data:image\/jpeg;base64,[^>]*>/gi, "");
        
        // Remove empty paragraphs or broken tags that might have contained the above
        body = body.replace(/<p[^>]*>\s*<\/p>/gi, "");
        body = body.replace(/<div[^>]*>\s*<\/div>/gi, "");
        body = body.replace(/<p[^>]*>\s*(<br\s*\/?>\s*)*<\/p>/gi, "");

        // 2. Define the new, perfectly centered payment block
        // Using a 100% table with nested centered table for absolute reliability
        const newQrBlock = `
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 30px 0; text-align: center;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; display: inline-table;">
                  <tr>
                    <td align="center" style="text-align: center;">
                      <p style="font-weight: bold; font-size: 20px; margin: 0 0 20px 0; color: #1abc9c; text-align: center; font-family: sans-serif;">Scan to Pay: QR Code</p>
                      <img src="${qrDataUri}" alt="Payment QR Code" width="240" style="display: block; border: 8px solid #1abc9c; border-radius: 15px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
                      <p style="font-size: 14px; color: #7f8c8d; margin: 15px 0 0 0; text-align: center; font-family: sans-serif;">Please share a screenshot after payment.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;

        // 3. Inject precisely before "Contact Details" or "Please let us know"
        const injectionMarkers = [
            "Contact Details",
            "Please let us know",
            "We look forward to working with you"
        ];

        let injected = false;
        for (const marker of injectionMarkers) {
            if (body.includes(marker)) {
                const parts = body.split(marker);
                body = parts[0] + newQrBlock + marker + parts.slice(1).join(marker);
                injected = true;
                console.log(`Injected before marker: ${marker}`);
                break;
            }
        }

        if (!injected) {
            body += newQrBlock;
            console.log("Injected at end");
        }

        template.body = body;
        await template.save();
        console.log(`Successfully updated ${name}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

nukeAndFix();
