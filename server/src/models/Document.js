import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sourcePath: { type: String }, // original file path or URL
    category: {
      type: String,
      enum: ["event", "faq", "team", "resource", "rule", "about", "announcement", "other"],
      default: "other",
      index: true,
    },
    status: { type: String, enum: ["upcoming", "ongoing", "completed", "n/a"], default: "n/a" },
    tags: [{ type: String, index: true }],
    eventDate: { type: Date },
    rawText: { type: String, required: true },
    fileType: { type: String, enum: ["md", "pdf", "docx", "txt", "url", "pasted"], default: "md" },
    chunkCount: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastIndexedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
