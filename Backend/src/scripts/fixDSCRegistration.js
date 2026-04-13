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

async function fixDSCRegistration() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", MONGO_URI ? "Set" : "NOT SET");
    
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // First, list ALL templates to see what's in the DB
    const allTemplates = await EmailTemplate.find({}, { name: 1 });
    console.log(`\nAll templates in DB (${allTemplates.length}):`);
    allTemplates.forEach(t => console.log(`  - ${t.name}`));
    
    console.log("\nSearching for 'Startup Station'...");
    // Find ALL templates that contain "Startup Station" in the body
    const templates = await EmailTemplate.find({ body: { $regex: /Startup Station/i } });
    console.log(`Found ${templates.length} template(s) with 'Startup Station'`);
    
    for (const template of templates) {
      console.log(`Processing: ${template.name}`);
      let body = template.body;
      
      // Replace Startup Station with Kleardocs
      body = body.replace(/Startup Station/gi, "Kleardocs");
      template.body = body;
      await template.save();
      console.log(`  - Successfully updated ${template.name}`);
    }
    
    if (templates.length === 0) {
      console.log("No templates with 'Startup Station' found");
    }
    
    // Fix Next Quarter Payment header color from #1ABC9C to #000000
    console.log("\n--- Fixing Next Quarter Payment header color ---");
    const nqTemplate = await EmailTemplate.findOne({ name: "Next Quarter Payment" });
    if (nqTemplate) {
      let body = nqTemplate.body;
      const hasTeal = /#1abc9c/gi.test(body);
      console.log(`Found Next Quarter Payment template - has #1ABC9C: ${hasTeal}`);
      
      if (hasTeal) {
        body = body.replace(/#1abc9c/gi, "#000000");
        nqTemplate.body = body;
        await nqTemplate.save();
        console.log("Successfully updated header color to #000000");
      } else {
        console.log("No #1ABC9C found - header already black or different color");
      }
    } else {
      console.log("Next Quarter Payment template not found");
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixDSCRegistration();
