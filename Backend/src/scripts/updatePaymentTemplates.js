import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
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

async function update() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const qrPath = "/uploads/templates/PaymentQR.jpeg";
    const names = ["Next Quarter Payment", "Package plus payment details"];

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        // Add attachment if not already present
        if (!template.attachments.includes(qrPath)) {
          template.attachments.push(qrPath);
        }

        // Specifically for "Package plus payment details", replace the old hardcoded QR URL
        if (name === "Package plus payment details") {
          const oldQrUrl = "https://startupstation.in/images/ssupi.jpg";
          if (template.body.includes(oldQrUrl)) {
            // Replace with the CID reference that my communication service uses
            template.body = template.body.replace(oldQrUrl, "cid:paymentQR");
          }
        }

        await template.save();
        console.log(`Updated template: ${name}`);
      } else {
        console.log(`Template not found: ${name}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

update();
