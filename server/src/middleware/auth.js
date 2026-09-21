import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    req.user = null; // guest — many routes allow guest access
    return next();
  }
  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, env.JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Authentication required" });
  next();
}
