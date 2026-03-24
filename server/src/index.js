import { mkdirSync } from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { join } from "path";
import { PORT, CLIENT_URL } from "./config/env.js";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import companiesRoutes from "./routes/companies.routes.js";

// Ensure uploads directory exists
mkdirSync(join(process.cwd(), "uploads/resumes"), { recursive: true });

// Prevent unhandled promise rejections from crashing the server
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "1mb" }));

// Serve uploaded files
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/companies", companiesRoutes);

// Global error handler — suppress stack traces
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: "Something went wrong" });
});

// Warm up DB connection on startup so first user request isn't the cold start victim
prisma.$queryRaw`SELECT 1`.then(() => {
  console.log("Database connection warmed up");
}).catch((err) => {
  console.warn("Database warmup failed (will retry on first request):", err.message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
