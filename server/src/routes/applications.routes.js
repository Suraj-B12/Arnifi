import { Router } from "express";
import { getApplications, withdrawApplication } from "../controllers/applications.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getApplications);
router.delete("/:appId/withdraw", authenticate, withdrawApplication);

export default router;
