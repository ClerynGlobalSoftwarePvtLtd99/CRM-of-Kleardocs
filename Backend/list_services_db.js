import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Service from "./src/models/Service.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const listAllServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const services = await Service.find({}, { name: 1, professionalFees: 1, govtFees: 1 });
        console.log("SERVICES IN DB:");
        services.forEach(s => console.log(`- ${s.name}: PF=₹${s.professionalFees}, GF=₹${s.govtFees}`));
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listAllServices();
