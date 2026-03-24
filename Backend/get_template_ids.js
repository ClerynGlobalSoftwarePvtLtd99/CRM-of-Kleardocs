import mongoose from "mongoose";
import dotenv from "dotenv";
import EmailTemplate from "./src/models/EmailTemplate.model.js";

dotenv.config({ path: ".env" });

async function run() {
  try {
    console.log("Connecting to " + process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    const templates = await EmailTemplate.find({}, "_id name");
    console.log("TEMPLATE_IDS_START");
    console.log(JSON.stringify(templates, null, 2));
    console.log("TEMPLATE_IDS_END");
  } catch (err) {
    console.error("FATAL ERROR:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
