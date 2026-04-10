import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

const EmailTemplateSchema = new mongoose.Schema({
  subject: String,
  body: String
});

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const templates = await EmailTemplate.find({});
    console.log(`Found ${templates.length} templates`);

    const replacements = [
      { search: /Startup Station/g, replace: "Kleardocs Solutions Private Limited" },
      { search: /STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED/g, replace: "KLEARDOCS SOLUTIONS PRIVATE LIMITED" },
      { search: /startupstation@idfcbank/g, replace: "kleardocssolutions@okaxis" },
      { search: /startupstation@axl/g, replace: "kleardocssolutions@okaxis" },
      { search: /startupstation.axl/g, replace: "kleardocssolutions@okaxis" },
      { search: /50200094441194/g, replace: "925020025764619" },
      { search: /HDFC0005385/g, replace: "UTIB0004234" },
      { search: /89674560601/g, replace: "925020025764619" },
      { search: /IDFB0060119/g, replace: "UTIB0004234" },
      { search: /IDFC Bank/g, replace: "Axis Bank" }
    ];

    let updatedCount = 0;

    for (const template of templates) {
      let modified = false;
      let newSubject = template.subject;
      let newBody = template.body;

      replacements.forEach(({ search, replace }) => {
        if (search.test(newSubject)) {
          newSubject = newSubject.replace(search, replace);
          modified = true;
        }
        if (search.test(newBody)) {
          newBody = newBody.replace(search, replace);
          modified = true;
        }
      });

      if (modified) {
        template.subject = newSubject;
        template.body = newBody;
        await template.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} templates`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
