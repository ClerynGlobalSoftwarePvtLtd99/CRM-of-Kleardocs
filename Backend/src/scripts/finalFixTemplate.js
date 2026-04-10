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

async function finalFix() {
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

        // 1. Remove ANY existing QR code images or "Scan to Pay" blocks to start clean
        // This regex looks for images with our base64 data or just anything that looks like a QR section
        body = body.replace(/<p[^>]*>Scan to Pay.*?<\/p>/gi, "");
        body = body.replace(/<div[^>]*>Scan to Pay.*?<\/div>/gi, "");
        body = body.replace(/<p[^>]*><img[^>]*data:image\/jpeg;base64,[^>]*><\/p>/gi, "");
        body = body.replace(/<div[^>]*><img[^>]*data:image\/jpeg;base64,[^>]*><\/div>/gi, "");
        body = body.replace(/<img[^>]*data:image\/jpeg;base64,[^>]*>/gi, "");
        
        // Also remove any remaining "Scan to Pay" text that might be loose
        body = body.replace(/Scan to Pay: QR Code/gi, "");
        body = body.replace(/QR Code/gi, "");

        // 2. Identify a good injection point. Usually before "Contact Us" or "Please let us know"
        const injectionMarkers = [
            "Contact Details",
            "Contact Us",
            "Please let us know",
            "We look forward to working with you"
        ];

        let injected = false;
        const newQrBlock = `
          <div align="center" style="text-align: center; margin: 30px auto; width: 100%; display: block;">
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #333; text-align: center;">Scan to Pay: QR Code</p>
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td align="center" style="text-align: center;">
                  <img src="${qrDataUri}" alt="Payment QR Code" width="220" style="display: block; border: 6px solid #1abc9c; border-radius: 12px; margin: 0 auto;" />
                </td>
              </tr>
            </table>
          </div>
        `;

        for (const marker of injectionMarkers) {
            if (body.includes(marker)) {
                // Insert before the marker
                const parts = body.split(marker);
                // We want to insert it before the paragraph or div containing the marker
                // For simplicity, just insert it before the marker itself
                body = parts[0] + newQrBlock + marker + parts.slice(1).join(marker);
                injected = true;
                console.log(`Injected before marker: ${marker}`);
                break;
            }
        }

        if (!injected) {
            body += newQrBlock;
            console.log("Injected at the end");
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

finalFix();
