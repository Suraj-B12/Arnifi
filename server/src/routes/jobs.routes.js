import { Router } from "express";
import { getAllJobs, getJob, createJob, updateJob, deleteJob } from "../controllers/jobs.controller.js";
import { applyToJob, getJobApplications, updateApplicationStatus } from "../controllers/applications.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

router.get("/", getAllJobs);
router.post("/", authenticate, requireAdmin, createJob);
router.put("/:id", authenticate, requireAdmin, updateJob);
router.delete("/:id", authenticate, requireAdmin, deleteJob);
router.get("/:id", getJob);
router.post("/:id/apply", authenticate, applyToJob);
router.get("/:id/applications", authenticate, requireAdmin, getJobApplications);
router.patch("/:id/applications/:appId", authenticate, requireAdmin, updateApplicationStatus);

export default router;
