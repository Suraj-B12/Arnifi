import { Router } from "express";
import { getApplications } from "../controllers/applications.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getApplications);

export default router;
