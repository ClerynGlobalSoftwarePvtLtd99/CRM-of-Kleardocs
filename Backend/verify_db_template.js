import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import EmailTemplate from "./src/models/EmailTemplate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const template = await EmailTemplate.findOne({ name: 'Next Quarter Payment' });
        if (template) {
            console.log("TEMPLATE FOUND IN DB:");
            console.log("Body excerpt:", template.body.substring(template.body.indexOf("Bank Account Details") - 20, template.body.indexOf("Bank Account Details") + 200));
            console.log("Includes old account number 50200094441194:", template.body.includes("50200094441194"));
            console.log("Includes new account number 925020025764619:", template.body.includes("925020025764619"));
        } else {
            console.log("TEMPLATE NOT FOUND");
        }
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
