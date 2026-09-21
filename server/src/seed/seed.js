import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Announcement from "../models/Announcement.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";

// Creates a default admin account (change the password immediately after first login)
// and one sample announcement. Run once: `npm run seed`.
async function main() {
  await connectDB();

  const adminEmail = "admin@codersclub.gprec.ac.in";
  const existing = await User.findOne({ email: adminEmail });

  if (!existing) {
    const passwordHash = await User.hashPassword("ChangeMe123!");
    await User.create({
      name: "Coders Club Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
    logger.info(`Created admin user: ${adminEmail} / ChangeMe123! (change this immediately)`);
  } else {
    logger.info("Admin user already exists, skipping.");
  }

  const annCount = await Announcement.countDocuments();
  if (annCount === 0) {
    await Announcement.create({
      text: "CodeX 4.0 registrations close on 23 September 2026 — register before it's too late!",
      active: true,
      priority: 10,
    });
    logger.info("Created sample announcement.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  logger.error("Seed script crashed", err);
  process.exit(1);
});
