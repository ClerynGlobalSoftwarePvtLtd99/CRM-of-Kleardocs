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

async function purgeEmptyTags() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for final purge");

    const names = ["Next Quarter Payment", "Package plus payment details"];

    for (const name of names) {
      const template = await EmailTemplate.findOne({ name });
      if (template) {
        let body = template.body;

        // Purge empty table structures left by previous scripts
        // Match table/div/tr/td that only contain whitespace or line breaks
        const purgeRegex = /<(table|div|tr|td|p|h3)[^>]*>(\s|<br\s*\/?>)*<\/\1>/gi;
        
        let oldLength = body.length;
        // Run multiple times to catch nested empty tags
        for (let i = 0; i < 5; i++) {
            body = body.replace(purgeRegex, "");
        }
        
        if (body.length !== oldLength) {
            console.log(`Purged empty fragments from ${name}`);
            template.body = body;
            await template.save();
        } else {
            console.log(`No fragments to purge in ${name}`);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

purgeEmptyTags();
