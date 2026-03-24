import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { uploadResume } from "../middleware/upload.js";
import {
  getMyProfile,
  updateProfile,
  uploadResumeHandler,
  serveResume,
  getUserProfile,
} from "../controllers/profile.controller.js";

const router = Router();

// Wrap multer to return proper error responses instead of crashing
function handleUpload(req, res, next) {
  uploadResume(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 5 MB." });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

router.get("/", authenticate, getMyProfile);
router.put("/", authenticate, updateProfile);
router.post("/resume", authenticate, handleUpload, uploadResumeHandler);
router.get("/resume/:userId", serveResume);
router.get("/:userId", authenticate, requireAdmin, getUserProfile);

export default router;
