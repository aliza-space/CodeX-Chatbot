import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Sanitize filename: replace spaces/special chars, keep safe basename
    const sanitizedBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${sanitizedBase}${ext}`);
  },
});

const allowedExt = [".pdf", ".docx", ".txt", ".md"];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}. Allowed: .md, .txt, .pdf, .docx`));
    }
    cb(null, true);
  },
});
