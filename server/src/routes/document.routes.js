import { Router } from "express";
import { listDocuments, uploadDocument, reindexDocument, removeDocument } from "../controllers/document.controller.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(verifyToken, requireAuth, requireRole("admin"));

router.get("/", listDocuments);
router.post("/upload", upload.single("file"), uploadDocument);
router.post("/:id/reindex", reindexDocument);
router.delete("/:id", removeDocument);

export default router;
