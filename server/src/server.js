import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function main() {
  await connectDB();
  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`🚀 Coders Club Chatbot API running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  logger.error("Fatal startup error", err);
  process.exit(1);
});
