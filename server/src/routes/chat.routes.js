import { Router } from "express";
import { z } from "zod";
import { streamChat } from "../controllers/chat.controller.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  guestSessionId: z.string().optional(),
});

router.post("/", verifyToken, chatRateLimiter, validate(chatSchema), streamChat);

export default router;
