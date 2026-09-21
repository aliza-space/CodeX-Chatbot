import { Router } from "express";
import { z } from "zod";
import { register, login, me, changePassword, googleLogin, googleOAuthCallback } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { verifyToken, requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/google", authRateLimiter, validate(googleSchema), googleLogin);

// Google OAuth 2.0 callback endpoints (handles GET code redirect & POST credential redirect)
router.get("/google/callback", googleOAuthCallback);
router.post("/google/callback", googleOAuthCallback);

router.get("/me", verifyToken, requireAuth, me);
router.post("/change-password", verifyToken, requireAuth, validate(changePasswordSchema), changePassword);

export default router;
