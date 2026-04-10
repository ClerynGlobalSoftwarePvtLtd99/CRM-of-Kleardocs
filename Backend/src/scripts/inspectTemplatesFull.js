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
  subject: String,
  body: String
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function inspect() {
  try {
    await mongoose.connect(MONGO_URI);
    const names = ["Next Quarter Payment", "Package plus payment details"];
    const templates = await EmailTemplate.find({ name: { $in: names } });
    templates.forEach(t => {
      console.log(`--- ${t.name} ---`);
      console.log(t.body);
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

inspect();
