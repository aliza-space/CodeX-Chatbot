import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", verifyToken, requireAuth, requireRole("admin"), getAnalytics);

export default router;
