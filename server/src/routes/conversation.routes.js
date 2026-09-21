import { Router } from "express";
import { listConversations, getConversation, deleteConversation } from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/", verifyToken, listConversations);
router.get("/:id", verifyToken, getConversation);
router.delete("/:id", verifyToken, deleteConversation);

export default router;
