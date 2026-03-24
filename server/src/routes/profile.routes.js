import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { uploadResume } from "../middleware/upload.js";
import {
  getMyProfile,
  updateProfile,
  uploadResumeHandler,
  getUserProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/", authenticate, getMyProfile);
router.put("/", authenticate, updateProfile);
router.post("/resume", authenticate, uploadResume, uploadResumeHandler);
router.get("/:userId", authenticate, requireAdmin, getUserProfile);

export default router;
