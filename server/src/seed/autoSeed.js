import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Announcement from "../models/Announcement.js";
import Chunk from "../models/Chunk.js";
import { ingestFile } from "../services/ingestion/ingest.js";
import { logger } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function walk(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walk(full)));
      } else if ([".md", ".txt"].includes(path.extname(entry.name).toLowerCase())) {
        files.push(full);
      }
    }
    return files;
  } catch (err) {
    logger.warn(`Could not read directory ${dir}: ${err.message}`);
    return [];
  }
}

export async function autoSeedDatabase() {
  try {
    // 1. Admin user
    const adminEmail = "admin@codersclub.gprec.ac.in";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await User.hashPassword("ChangeMe123!");
      await User.create({
        name: "Coders Club Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
      logger.info(`✅ Auto-seed: Created admin user (${adminEmail})`);
    }

    // 2. Announcement
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.create({
        text: "CodeX 4.0 registrations close on 23 September 2026 — register before it's too late!",
        active: true,
        priority: 10,
      });
      logger.info("✅ Auto-seed: Created default announcement");
    }

    // 3. Knowledge Base
    const chunkCount = await Chunk.countDocuments();
    if (chunkCount === 0) {
      logger.info("ℹ️ Chunks empty, auto-ingesting knowledge base...");
      const possibleKbPaths = [
        path.resolve(process.cwd(), "knowledge-base"),
        path.resolve(process.cwd(), "../knowledge-base"),
        path.resolve(__dirname, "../../../knowledge-base"),
      ];

      let kbDir = null;
      for (const p of possibleKbPaths) {
        try {
          const stat = await fs.stat(p);
          if (stat.isDirectory()) {
            kbDir = p;
            break;
          }
        } catch {}
      }

      if (kbDir) {
        const files = await walk(kbDir);
        logger.info(`Found ${files.length} knowledge-base files to ingest at ${kbDir}`);
        for (const f of files) {
          try {
            await ingestFile(f);
          } catch (err) {
            logger.warn(`Auto-ingest skipped ${f}: ${err.message}`);
          }
        }
        logger.info("✅ Auto-seed: Knowledge base ingestion complete");
      } else {
        logger.warn("⚠️ Knowledge base directory not found for auto-seed");
      }
    }
  } catch (err) {
    logger.warn(`Auto-seed non-fatal error: ${err.message}`);
  }
}
