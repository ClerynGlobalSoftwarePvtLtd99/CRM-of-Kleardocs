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

async function inspect() {
  try {
    await mongoose.connect(MONGO_URI);
    const t = await EmailTemplate.findOne({ name: "Package plus payment details" });
    if (t) {
      fs.writeFileSync(path.join(process.cwd(), "debug_body.html"), t.body);
      console.log("Body written to debug_body.html");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

inspect();
