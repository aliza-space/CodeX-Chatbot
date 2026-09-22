import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import { ingestFile } from "../services/ingestion/ingest.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Walks KB_SOURCE_DIR (see .env — points at the extracted knowledge-base/ folder,
// same layout as your KNOWLEDGE_BASE.zip: about/, events/, faqs/, resources/,
// rules/, team/, README.md) and ingests every .md file it finds.
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if ([".md", ".txt", ".pdf", ".docx"].includes(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const kbDir = path.resolve(process.cwd(), env.KB_SOURCE_DIR);
  logger.info(`Scanning knowledge base at: ${kbDir}`);

  await connectDB();

  const files = await walk(kbDir);
  logger.info(`Found ${files.length} files to ingest`);

  let ok = 0;
  let failed = 0;
  for (const filePath of files) {
    try {
      await ingestFile(filePath);
      ok++;
    } catch (err) {
      failed++;
      logger.error(`Failed to ingest ${filePath}:`, err.message);
    }
  }

  logger.info(`Ingestion complete: ${ok} succeeded, ${failed} failed.`);
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  logger.error("Ingestion script crashed", err);
  process.exit(1);
});
