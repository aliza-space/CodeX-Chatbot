import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  logger.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: "Route not found" });
}
