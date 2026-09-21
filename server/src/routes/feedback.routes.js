import { Router } from "express";
import { z } from "zod";
import { submitFeedback } from "../controllers/feedback.controller.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

const feedbackSchema = z.object({
  messageId: z.string(),
  rating: z.enum(["up", "down"]),
  comment: z.string().optional(),
});

router.post("/", verifyToken, validate(feedbackSchema), submitFeedback);

export default router;
