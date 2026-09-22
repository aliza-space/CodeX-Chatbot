import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import documentRoutes from "./routes/document.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();

// Trust Render/Vercel/Nginx reverse proxy so rate-limiting and IP logging work correctly
app.set("trust proxy", 1);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (origin === env.CLIENT_URL) return true;
  if (env.CLIENT_URL && env.CLIENT_URL.split(",").map((s) => s.trim()).includes(origin)) return true;
  if (/^https?:\/\/.*\.vercel\.app$/.test(origin)) return true;
  if (/^https?:\/\/.*\.onrender\.com$/.test(origin)) return true;
  if (/^https?:\/\/.*\.netlify\.app$/.test(origin)) return true;
  if (/^https?:\/\/.*\.ngrok-free\.app$/.test(origin)) return true;
  if (/^https?:\/\/.*\.ngrok\.app$/.test(origin)) return true;
  if (/^https?:\/\/.*\.ngrok\.io$/.test(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin)) return true;
  if (env.NODE_ENV === "development") return true;
  return false;
};

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/admin/documents", documentRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
