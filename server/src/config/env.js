import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const DATABASE_URL = process.env.DATABASE_URL;

// Validate required env vars at startup
const required = ["JWT_SECRET", "DATABASE_URL"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
