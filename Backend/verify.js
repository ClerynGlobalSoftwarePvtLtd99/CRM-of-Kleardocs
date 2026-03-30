import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "./src/models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const template = await EmailTemplate.findOne({ name: "Director Resignation" });
        console.log("BODY_START");
        console.log(template.body);
        console.log("BODY_END");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verify();
