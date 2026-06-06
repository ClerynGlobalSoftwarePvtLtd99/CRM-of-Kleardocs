import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root Backend directory, override any already-set vars
dotenv.config({ 
  path: path.resolve(__dirname, "../../.env"),
  override: true 
});

// Startup check — confirms Brevo config is loaded
console.log("[CONFIG] Env loaded ✓");
console.log("[CONFIG] BREVO_API_KEY:", process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.substring(0, 16)}...` : "❌ NOT SET");
console.log("[CONFIG] BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL || "❌ NOT SET");

// export const config = {
//     port: process.env.PORT || 5000,
//     mongoURI: process.env.MONGO_URI,
//     jwtSecret: process.env.JWT_SECRET,
//     jwtExpiration: process.env.JWT_EXPIRATION,
//     email: {
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// };