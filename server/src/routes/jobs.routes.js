import { Router } from "express";
import { getAllJobs, createJob, updateJob, deleteJob } from "../controllers/jobs.controller.js";
import { applyToJob } from "../controllers/applications.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", getAllJobs);
router.post("/", authenticate, requireAdmin, createJob);
router.put("/:id", authenticate, requireAdmin, updateJob);
router.delete("/:id", authenticate, requireAdmin, deleteJob);
router.post("/:id/apply", authenticate, applyToJob);

export default router;
