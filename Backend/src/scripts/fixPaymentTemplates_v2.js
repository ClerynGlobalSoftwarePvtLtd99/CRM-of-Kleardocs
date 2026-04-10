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
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function fix() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const names = ["Next Quarter Payment", "Package plus payment details"];
    const oldQrUrl = "https://startupstation.in/images/ssupi.jpg";

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        if (template.body.includes(oldQrUrl)) {
          template.body = template.body.replace(new RegExp(oldQrUrl, 'g'), "cid:paymentQR");
          console.log(`Replaced old QR URL in ${name}`);
        }
        
        // Ensure "Scan to Pay: QR Code" terminology if requested? 
        // User said: "Scan to Pay: QR Code show this in Package plus payment details"
        if (name === "Package plus payment details" && !template.body.includes("Scan to Pay: QR Code")) {
           // It has "Scan to Pay:". Let's make it "Scan to Pay: QR Code"
           template.body = template.body.replace("Scan to Pay:", "Scan to Pay: QR Code");
        }

        await template.save();
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fix();
