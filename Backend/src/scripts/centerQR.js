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
  body: String
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function center() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const names = ["Next Quarter Payment", "Package plus payment details"];

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        console.log(`Centering QR in ${name}...`);
        
        // Let's wrap the QR section in a centered div if it's not already well-centered
        // Look for the image and its preceding text
        let body = template.body;

        // If it's the base64 image we added, replace the whole block with a better centered one
        const qrRegex = /<div style="text-align: center; margin: 20px 0;">.*?Scan to Pay: QR Code.*?<img src="data:image\/jpeg;base64,.*?".*?\/><\/div>/s;
        
        // Alternatively, look for the p tags I replaced
        const pCenteredRegex = /<p style="text-align: center;".*?>Scan to Pay: QR Code.*?<\/p>\s*<p style="text-align: center;".*?><img src="data:image\/jpeg;base64,.*?".*?><\/p>/s;

        const newQrSection = `
          <div align="center" style="text-align: center; margin: 30px 0; width: 100%;">
            <p style="font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #333; text-align: center;">Scan to Pay: QR Code</p>
            <div style="display: block; margin: 0 auto; text-align: center;">
              <img src="data:image/jpeg;base64,REPLACE_BASE64" alt="Payment QR Code" width="200" style="display: inline-block; border: 5px solid #1abc9c; border-radius: 12px; max-width: 200px; height: auto;" />
            </div>
          </div>
        `;

        // Extract base64
        const base64Match = body.match(/data:image\/jpeg;base64,([a-zA-Z0-9+/=]+)/);
        if (base64Match) {
            const b64 = base64Match[1];
            const finalQrSection = newQrSection.replace("REPLACE_BASE64", b64);
            
            // Re-replace the suspected section
            if (pCenteredRegex.test(body)) {
                body = body.replace(pCenteredRegex, finalQrSection);
            } else if (qrRegex.test(body)) {
                body = body.replace(qrRegex, finalQrSection);
            } else {
                // Last resort: find the image and wrap it
                body = body.replace(/<img.*?src="data:image\/jpeg;base64,.*?".*?>/, (match) => {
                    return `<div align="center" style="text-align: center;">${match}</div>`;
                });
            }
        }

        template.body = body;
        await template.save();
        console.log(`Finished centering for ${name}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

center();
