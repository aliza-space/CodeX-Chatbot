import { Router } from "express";
import {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", listAnnouncements); // public: bot needs these injected too, exposed read-only
router.post("/", verifyToken, requireAuth, requireRole("admin"), createAnnouncement);
router.patch("/:id", verifyToken, requireAuth, requireRole("admin"), updateAnnouncement);
router.delete("/:id", verifyToken, requireAuth, requireRole("admin"), deleteAnnouncement);

export default router;
