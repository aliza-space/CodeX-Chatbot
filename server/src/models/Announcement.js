import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    active: { type: Boolean, default: true },
    priority: { type: Number, default: 0 }, // higher = injected first
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
