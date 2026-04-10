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
  body: String,
  attachments: [String]
}, { timestamps: true });

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function upgrade() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const qrPath = path.join(process.cwd(), "..", "PaymentQR.jpeg");
    if (!fs.existsSync(qrPath)) {
        console.error("PaymentQR.jpeg not found in root");
        process.exit(1);
    }

    const qrBase64 = fs.readFileSync(qrPath, { encoding: 'base64' });
    const qrDataUri = `data:image/jpeg;base64,${qrBase64}`;

    const names = ["Next Quarter Payment", "Package plus payment details"];

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        console.log(`Updating ${name}...`);
        
        // Remove from attachments array so it doesn't show in "Attached Files" UI
        template.attachments = [];

        // Update body with Base64 image
        // We look for cid:paymentQR (from my previous fix) or the old URL
        const oldQrUrl = "https://startupstation.in/images/ssupi.jpg";
        
        let newBody = template.body;
        
        // Standardize the QR section
        const qrSectionHtml = `
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">Scan to Pay: QR Code</p>
            <img src="${qrDataUri}" alt="Payment QR Code" style="max-width: 200px; border: 4px solid #1abc9c; border-radius: 10px;" />
          </div>
        `;

        if (newBody.includes("cid:paymentQR")) {
            // Replace the whole paragraph/section containing cid:paymentQR
            // Or just replace the src
            newBody = newBody.replace(/src="cid:paymentQR"/g, `src="${qrDataUri}"`);
            newBody = newBody.replace("Scan to Pay:", "Scan to Pay: QR Code");
        } else if (newBody.includes(oldQrUrl)) {
            newBody = newBody.replace(new RegExp(oldQrUrl, 'g'), qrDataUri);
            newBody = newBody.replace("Scan to Pay:", "Scan to Pay: QR Code");
        } else {
            // If it's not found in a specific way, append it before the contact details or at the end
            if (!newBody.includes(qrDataUri.substring(0, 50))) {
                newBody += qrSectionHtml;
            }
        }

        template.body = newBody;
        await template.save();
        console.log(`Successfully upgraded ${name}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Upgrade failed:", error);
    process.exit(1);
  }
}

upgrade();
