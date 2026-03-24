import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/dashboard", authenticate, requireAdmin, getDashboardAnalytics);

export default router;
