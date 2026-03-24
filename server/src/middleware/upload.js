import multer, { diskStorage } from "multer";
import { extname, basename, join } from "path";

const ALLOWED_EXTENSIONS = [".pdf"];

const storage = diskStorage({
  destination: join(process.cwd(), "uploads/resumes"),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Use only the basename to prevent path traversal via crafted originalname
    const safeName = basename(file.originalname);
    const ext = extname(safeName).toLowerCase();
    // Force .pdf extension regardless of what was extracted
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : ".pdf";
    cb(null, `${req.user.userId}-${uniqueSuffix}${safeExt}`);
  },
});

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
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("resume");
