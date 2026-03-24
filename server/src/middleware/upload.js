import multer from "multer";
import { extname, basename } from "path";

const ALLOWED_EXTENSIONS = [".pdf"];

function fileFilter(req, file, cb) {
  // Check both MIME type and file extension to prevent spoofing
  const safeName = basename(file.originalname);
  const ext = extname(safeName).toLowerCase();
  if (file.mimetype === "application/pdf" && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
}

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("resume");
