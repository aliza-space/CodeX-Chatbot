import { Router } from "express";
import { getAnalytics, deleteUser } from "../controllers/analytics.controller.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

router.get("/", verifyToken, requireAuth, requireRole("admin"), getAnalytics);
router.delete("/users/:id", verifyToken, requireAuth, requireRole("admin"), deleteUser);

export default router;
